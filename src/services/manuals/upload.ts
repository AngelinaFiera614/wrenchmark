
// Functions for handling file uploads
import { supabase } from "@/integrations/supabase/client";
import { ManualInfo, ManualWithMotorcycle } from "./types";
import { createManual } from "./update";

/**
 * Upload a file to storage
 */
export const uploadManualFile = async (file: File, path: string): Promise<string> => {
  const { data, error } = await supabase
    .storage
    .from('manuals')
    .upload(path, file);

  if (error) {
    console.error("Error uploading manual file:", error);
    throw error;
  }

  // Return the path to the uploaded file
  return data.path;
};

/**
 * Complete process to upload a manual file and create the database record
 */
export const uploadManual = async (file: File, manualInfo: ManualInfo): Promise<ManualWithMotorcycle> => {
  try {
    // Generate a unique file path
    const timestamp = Date.now();
    const filePath = `${timestamp}_${file.name.replace(/\s+/g, '_')}`;
    
    // Upload the file to storage
    const path = await uploadManualFile(file, filePath);
    
    // Get the public URL for the file
    const { data: fileData } = await supabase
      .storage
      .from('manuals')
      .getPublicUrl(path);
    
    // Create the manual record with the file URL
    const updatedManualInfo = {
      ...manualInfo,
      file_url: fileData.publicUrl
    };
    
    // Create the manual record or use existing ID
    const manual = await createManual(updatedManualInfo);
    
    return manual;
  } catch (error) {
    console.error("Error in uploadManual:", error);
    throw error;
  }
};
