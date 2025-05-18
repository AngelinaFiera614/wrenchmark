// Functions for handling file uploads
import { supabase } from "@/integrations/supabase/client";
import { ManualInfo, ManualWithMotorcycle, ImportManualParams } from './types';
import { createManual } from "./update";
import { getOrCreateTagsByNames, associateTagsWithManual } from "./tags";

/**
 * Upload a file to storage
 */
export const uploadManualFile = async (file: File, path: string): Promise<string> => {
  try {
    console.log(`Uploading file ${file.name} to path ${path}`);
    
    const { data, error } = await supabase
      .storage
      .from('manuals')
      .upload(path, file);

    if (error) {
      console.error("Error uploading manual file:", error);
      throw error;
    }

    console.log("File uploaded successfully:", data.path);
    // Return the path to the uploaded file
    return data.path;
  } catch (error) {
    console.error("Exception in uploadManualFile:", error);
    throw error;
  }
};

/**
 * Complete process to upload a manual file and create the database record with tags
 */
export const uploadManual = async (file: File, manualInfo: ManualInfo): Promise<ManualWithMotorcycle> => {
  try {
    console.log("Starting manual upload process for:", file.name, "with info:", manualInfo);
    
    // Generate a unique file path
    const timestamp = Date.now();
    const filePath = `${timestamp}_${file.name.replace(/\s+/g, '_')}`;
    
    // Upload the file to storage
    const path = await uploadManualFile(file, filePath);
    console.log("File uploaded to path:", path);
    
    // Get the public URL for the file
    const { data: fileData } = await supabase
      .storage
      .from('manuals')
      .getPublicUrl(path);

    console.log("Generated public URL:", fileData.publicUrl);

    // Make sure title is provided if it's optional
    if (!manualInfo.title) {
      manualInfo.title = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      console.log("Generated title from filename:", manualInfo.title);
    }
    
    // Create the manual record with the file URL
    const updatedManualInfo = {
      ...manualInfo,
      file_url: fileData.publicUrl,
      file_name: file.name
    };
    
    console.log("Creating manual record with data:", updatedManualInfo);
    // Create the manual record or use existing ID
    const manual = await createManual(updatedManualInfo);
    console.log("Manual record created:", manual);
    
    // Process tags if provided
    if (manualInfo.tags && manualInfo.tags.length > 0) {
      console.log("Processing tags for manual:", manualInfo.tags);
      
      try {
        // Get or create the tags by name
        const tags = await getOrCreateTagsByNames(manualInfo.tags);
        console.log("Retrieved/created tags:", tags);
        
        // Associate tags with the manual
        await associateTagsWithManual(manual.id, tags.map(tag => tag.id));
        console.log("Associated tags with manual");
        
        // Add tag details to the manual object
        manual.tag_details = tags;
      } catch (tagError) {
        console.error("Error processing tags:", tagError);
        // Don't fail the whole upload just because tags failed
      }
    }
    
    return manual;
  } catch (error) {
    console.error("Error in uploadManual:", error);
    throw error;
  }
};

/**
 * Create a manual record from an existing file in the storage bucket
 */
export interface ImportManualData extends ManualInfo {
  file_name: string;
}

/**
 * Function to import an existing manual file (already in storage)
 */
export const importManual = async (params: ImportManualParams): Promise<ManualWithMotorcycle> => {
  console.log('Importing manual with params:', params);
  
  try {
    // Call the RPC function to handle the import (which should handle motorcycle creation if needed)
    const { data, error } = await supabase.rpc('import_manual', {
      _title: params.title,
      _manual_type: params.manual_type,
      _year: params.year,
      _file_url: params.file_url,
      _file_name: params.file_name,
      _file_size_mb: params.file_size_mb,
      _tags: params.tags || [],
      _make: params.make,  // Pass make for motorcycle creation
      _model: params.model  // Pass model for motorcycle creation
    });

    if (error) {
      console.error('Error importing manual:', error);
      throw new Error(`Failed to import manual: ${error.message}`);
    }

    console.log('Manual imported successfully:', data);
    return data as ManualWithMotorcycle;
  } catch (error) {
    console.error('Error in importManual:', error);
    throw error;
  }
};
