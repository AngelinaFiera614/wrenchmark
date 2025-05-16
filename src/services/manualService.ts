
import { supabase } from "@/integrations/supabase/client";
import { Manual, ManualType } from "@/types";
import { toast } from "sonner";

export const getManualsByMotorcycleId = async (motorcycleId: string): Promise<Manual[]> => {
  const { data, error } = await supabase
    .from("manuals")
    .select("*")
    .eq("motorcycle_id", motorcycleId)
    .order("title");

  if (error) {
    console.error("Error fetching manuals:", error);
    throw error;
  }

  return data || [];
};

export const getAllManuals = async (): Promise<Manual[]> => {
  const { data, error } = await supabase
    .from("manuals")
    .select("*, motorcycles(make, model_name, year)")
    .order("title");

  if (error) {
    console.error("Error fetching all manuals:", error);
    throw error;
  }

  return data || [];
};

export const getManualById = async (id: string): Promise<Manual | null> => {
  const { data, error } = await supabase
    .from("manuals")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null; // No manual found
    }
    console.error("Error fetching manual:", error);
    throw error;
  }

  return data;
};

export const incrementDownloadCount = async (manualId: string): Promise<void> => {
  const { error } = await supabase
    .from("manuals")
    .update({ downloads: supabase.rpc('increment', { inc_amount: 1, row_id: manualId }) })
    .eq("id", manualId);

  if (error) {
    console.error("Error incrementing download count:", error);
    // Don't throw an error since this is not critical functionality
  }
};

export const uploadManual = async (
  file: File,
  metadata: {
    title: string;
    manual_type: ManualType;
    motorcycle_id: string;
    year?: number;
    file_size_mb?: number;
  }
): Promise<Manual> => {
  // 1. Upload file to storage
  const fileExt = file.name.split('.').pop();
  const filePath = `${metadata.motorcycle_id}/${Date.now()}.${fileExt}`;
  
  const { error: uploadError, data: fileData } = await supabase.storage
    .from("manuals")
    .upload(filePath, file);

  if (uploadError) {
    console.error("Error uploading manual file:", uploadError);
    throw uploadError;
  }

  // 2. Get the public URL for the file
  const { data: publicUrlData } = supabase.storage
    .from("manuals")
    .getPublicUrl(filePath);

  const file_url = publicUrlData.publicUrl;

  // 3. Calculate file size in MB if not provided
  const file_size_mb = metadata.file_size_mb || parseFloat((file.size / (1024 * 1024)).toFixed(2));

  // 4. Insert manual record in database
  const { data, error: dbError } = await supabase
    .from("manuals")
    .insert({
      title: metadata.title,
      manual_type: metadata.manual_type,
      motorcycle_id: metadata.motorcycle_id,
      file_url,
      file_size_mb,
      year: metadata.year || null,
      downloads: 0
    })
    .select()
    .single();

  if (dbError) {
    // Clean up the uploaded file if database insert fails
    await supabase.storage.from("manuals").remove([filePath]);
    console.error("Error creating manual record:", dbError);
    throw dbError;
  }

  return data;
};

export const deleteManual = async (manual: Manual): Promise<void> => {
  try {
    // Extract the file path from the URL
    const storageUrl = supabase.storage.from("manuals").getPublicUrl("").data.publicUrl;
    let filePath = manual.file_url.replace(storageUrl, "");
    
    // Remove the leading slash if present
    if (filePath.startsWith("/")) {
      filePath = filePath.substring(1);
    }
    
    // Delete the file from storage
    const { error: storageError } = await supabase.storage
      .from("manuals")
      .remove([filePath]);
      
    if (storageError) {
      console.error("Error deleting file from storage:", storageError);
      // Continue to delete the database record even if storage delete fails
    }
    
    // Delete the manual record
    const { error: dbError } = await supabase
      .from("manuals")
      .delete()
      .eq("id", manual.id);
      
    if (dbError) {
      console.error("Error deleting manual record:", dbError);
      throw dbError;
    }
    
  } catch (error) {
    console.error("Error in manual deletion process:", error);
    throw error;
  }
};
