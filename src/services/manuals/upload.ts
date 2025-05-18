
// Functions for handling file uploads
import { supabase } from "@/integrations/supabase/client";
import { ManualInfo, ManualWithMotorcycle } from "./types";
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

export const importManual = async (importData: ImportManualData): Promise<ManualWithMotorcycle> => {
  console.log("Starting manual import process for:", importData.file_name);
  
  try {
    // Verify file exists in storage
    console.log("Checking if file exists in storage:", importData.file_name);
    const { data: fileList, error: listError } = await supabase
      .storage
      .from('manuals')
      .list('', { 
        search: importData.file_name 
      });
      
    if (listError) {
      console.error("Error checking if file exists:", listError);
      throw listError;
    }
    
    console.log("Files found in storage:", fileList?.map(f => f.name));
    const fileExists = fileList?.some(item => item.name === importData.file_name);
    
    if (!fileExists) {
      console.error(`File "${importData.file_name}" not found in storage`);
      throw new Error(`File "${importData.file_name}" not found in storage`);
    }
    
    // Make sure title is provided if it's optional
    if (!importData.title) {
      importData.title = importData.file_name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      console.log("Generated title from filename:", importData.title);
    }
    
    // Ensure motorcycle_id is valid
    if (!importData.motorcycle_id) {
      console.error("Missing motorcycle_id in import data");
      throw new Error("Motorcycle ID is required for manual import");
    }
    
    console.log("Creating manual record with data:", {
      title: importData.title,
      manual_type: importData.manual_type,
      motorcycle_id: importData.motorcycle_id,
      year: importData.year,
      file_size_mb: importData.file_size_mb,
      file_url: importData.file_url,
      file_name: importData.file_name,
      tags: importData.tags
    });
    
    // Create the manual record
    const manual = await createManual({
      title: importData.title,
      manual_type: importData.manual_type,
      motorcycle_id: importData.motorcycle_id,
      year: importData.year,
      file_size_mb: importData.file_size_mb,
      file_url: importData.file_url,
      file_name: importData.file_name
    });
    
    console.log("Manual record created successfully:", manual);
    
    // Process tags if provided
    if (importData.tags && importData.tags.length > 0) {
      console.log("Processing tags for imported manual:", importData.tags);
      
      try {
        // Get or create the tags by name
        const tags = await getOrCreateTagsByNames(importData.tags);
        console.log("Retrieved/created tags:", tags);
        
        // Associate tags with the manual
        await associateTagsWithManual(manual.id, tags.map(tag => tag.id));
        console.log("Associated tags with manual");
        
        // Add tag details to the manual object
        manual.tag_details = tags;
      } catch (tagError) {
        console.error("Error processing tags for imported manual:", tagError);
        // Don't fail the whole import just because tags failed
      }
    }
    
    return manual;
  } catch (error) {
    console.error("Error importing manual:", error);
    throw error;
  }
};
