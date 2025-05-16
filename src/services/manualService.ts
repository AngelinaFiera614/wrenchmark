
import { supabase } from "@/integrations/supabase/client";
import { Manual, ManualType, ManualUpload } from "@/types";

/**
 * Get all manuals for a specific motorcycle
 */
export const getManualsByMotorcycleId = async (motorcycleId: string): Promise<Manual[]> => {
  try {
    const { data, error } = await supabase
      .from("manuals")
      .select("*")
      .eq("motorcycle_id", motorcycleId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    
    // Type assertion to ensure compatibility with ManualType
    return data.map(manual => ({
      ...manual,
      manual_type: manual.manual_type as ManualType
    }));
  } catch (error) {
    console.error("Error getting manuals:", error);
    throw error;
  }
};

/**
 * Get all manuals with optional filters (for admin)
 */
export const getAllManuals = async (): Promise<Manual[]> => {
  try {
    const { data, error } = await supabase
      .from("manuals")
      .select("*, motorcycles:motorcycle_id(*)")
      .order("created_at", { ascending: false });

    if (error) throw error;
    
    // Type assertion to ensure compatibility with ManualType
    return data.map(manual => ({
      ...manual,
      manual_type: manual.manual_type as ManualType,
      // We don't include motorcycles here as it's not part of Manual type
    }));
  } catch (error) {
    console.error("Error getting all manuals:", error);
    throw error;
  }
};

/**
 * Get a single manual by id
 */
export const getManualById = async (manualId: string): Promise<Manual> => {
  try {
    const { data, error } = await supabase
      .from("manuals")
      .select("*")
      .eq("id", manualId)
      .single();

    if (error) throw error;
    
    return {
      ...data,
      manual_type: data.manual_type as ManualType
    };
  } catch (error) {
    console.error("Error getting manual:", error);
    throw error;
  }
};

/**
 * Increment the download count for a manual
 */
export const incrementDownloadCount = async (manualId: string): Promise<number> => {
  try {
    // Use the PostgreSQL function to increment the download count
    const { data, error } = await supabase
      .rpc('increment', { row_id: manualId, inc_amount: 1 });

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error incrementing download count:", error);
    throw error;
  }
};

/**
 * Upload a manual file to storage and create a database entry
 */
export const uploadManual = async (
  file: File,
  manualData: ManualUpload
): Promise<Manual> => {
  try {
    // 1. Upload the file to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `manuals/${fileName}`;
    
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('manuals')
      .upload(filePath, file, {
        contentType: file.type,
        cacheControl: '3600'
      });

    if (uploadError) throw uploadError;

    // 2. Get the public URL for the uploaded file
    const { data: urlData } = supabase
      .storage
      .from('manuals')
      .getPublicUrl(filePath);

    const file_url = urlData.publicUrl;

    // 3. Create the manual record in the database
    const { data: manualRecord, error: dbError } = await supabase
      .from('manuals')
      .insert({
        title: manualData.title,
        manual_type: manualData.manual_type,
        motorcycle_id: manualData.motorcycle_id,
        file_url,
        file_size_mb: manualData.file_size_mb,
        year: manualData.year,
        downloads: 0
      })
      .select()
      .single();

    if (dbError) throw dbError;

    return {
      ...manualRecord,
      manual_type: manualRecord.manual_type as ManualType
    };
  } catch (error) {
    console.error("Error uploading manual:", error);
    throw error;
  }
};

/**
 * Delete a manual (including its file in storage)
 */
export const deleteManual = async (manualId: string): Promise<void> => {
  try {
    // 1. Get the manual to find the file_url
    const manual = await getManualById(manualId);
    
    // 2. Delete the database record
    const { error: dbError } = await supabase
      .from('manuals')
      .delete()
      .eq('id', manualId);
    
    if (dbError) throw dbError;

    // 3. Extract the path from the URL and delete from storage
    if (manual.file_url) {
      const path = manual.file_url.split('/').pop();
      if (path) {
        const { error: storageError } = await supabase
          .storage
          .from('manuals')
          .remove([`manuals/${path}`]);
          
        if (storageError) {
          console.warn("Could not delete file from storage:", storageError);
          // Continue anyway since the database record is deleted
        }
      }
    }
  } catch (error) {
    console.error("Error deleting manual:", error);
    throw error;
  }
};
