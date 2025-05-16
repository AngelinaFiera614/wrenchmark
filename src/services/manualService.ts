
import { supabase } from "@/integrations/supabase/client";
import { Manual, ManualType, ManualUpload } from "@/types";
import { createOrGetPlaceholderMotorcycle } from "./motorcycleService";
import { v4 as uuidv4 } from 'uuid';

export const getManualById = async (id: string): Promise<Manual | null> => {
  const { data, error } = await supabase
    .from('manuals')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error("Error fetching manual:", error);
    throw error;
  }

  return data;
};

export const getManualsByMotorcycleId = async (motorcycleId: string): Promise<Manual[]> => {
  const { data, error } = await supabase
    .from('manuals')
    .select('*')
    .eq('motorcycle_id', motorcycleId)
    .order('manual_type', { ascending: true });

  if (error) {
    console.error("Error fetching manuals:", error);
    throw error;
  }

  return data || [];
};

export const uploadManualFile = async (file: File, path: string): Promise<string> => {
  const { data, error } = await supabase.storage
    .from('manuals')
    .upload(path, file);

  if (error) {
    console.error("Error uploading manual:", error);
    throw error;
  }

  const { data: urlData } = supabase.storage
    .from('manuals')
    .getPublicUrl(data.path);

  return urlData.publicUrl;
};

export const createManual = async (manual: ManualUpload, file: File): Promise<Manual> => {
  // First check if the motorcycle exists, if not create a placeholder
  const motorcycleId = manual.motorcycle_id;
  let finalMotorcycleId = motorcycleId;

  // Prepare the file path
  const fileExt = file.name.split('.').pop();
  const filePath = `${manual.manual_type}/${uuidv4()}.${fileExt}`;
  
  // Upload the file
  const fileUrl = await uploadManualFile(file, filePath);
  
  // Create the manual record
  const { data, error } = await supabase
    .from('manuals')
    .insert([{
      title: manual.title,
      manual_type: manual.manual_type as ManualType,
      file_url: fileUrl,
      file_size_mb: manual.file_size_mb,
      motorcycle_id: finalMotorcycleId,
      year: manual.year,
      downloads: 0
    }])
    .select()
    .single();

  if (error) {
    console.error("Error creating manual:", error);
    throw error;
  }

  return data;
};

export const incrementDownloadCount = async (manualId: string): Promise<void> => {
  const { error } = await supabase
    .rpc('increment_manual_downloads', { manual_id: manualId });

  if (error) {
    console.error("Error incrementing download count:", error);
    throw error;
  }
};

export const deleteManual = async (id: string): Promise<void> => {
  // First get the manual to find the file URL
  const manual = await getManualById(id);
  
  if (!manual) {
    throw new Error("Manual not found");
  }
  
  // Extract filename from URL
  const fileUrl = manual.file_url;
  const urlParts = fileUrl.split('/');
  const filePath = `${manual.manual_type}/${urlParts[urlParts.length - 1]}`;
  
  // Delete the file from storage
  const { error: storageError } = await supabase.storage
    .from('manuals')
    .remove([filePath]);
  
  if (storageError) {
    console.error("Error deleting manual file:", storageError);
    throw storageError;
  }
  
  // Delete the database record
  const { error } = await supabase
    .from('manuals')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting manual record:", error);
    throw error;
  }
};
