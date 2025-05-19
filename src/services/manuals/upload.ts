
// Functions for handling file uploads
import { supabase } from "@/integrations/supabase/client";
import { ManualInfo, ManualWithMotorcycle, ImportManualParams, ManualTag } from './types';
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
 * Now stores make/model/year directly on the manual record without creating motorcycles
 */
export const importManual = async (params: ImportManualParams): Promise<ManualWithMotorcycle> => {
  console.log('Importing manual with params:', params);
  
  try {
    // Create the manual record with make/model/year directly
    // Use motorcycle_id if provided, but it's now optional
    const manualData: any = {
      title: params.title || params.file_name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
      manual_type: params.manual_type,
      file_url: params.file_url,
      file_size_mb: params.file_size_mb,
      year: params.year
    };
    
    // Add motorcycle_id only if provided
    if (params.motorcycle_id) {
      manualData.motorcycle_id = params.motorcycle_id;
    }
    
    // Store make/model directly on the manual record
    if (params.make) {
      manualData.make = params.make;
    }
    
    if (params.model) {
      manualData.model = params.model;
    }
    
    console.log('Creating manual with data:', manualData);
    
    // Create the manual record
    const { data: manual, error: manualError } = await supabase
      .from('manuals')
      .insert(manualData)
      .select('*, motorcycles(*)')
      .single();
    
    if (manualError) {
      throw new Error(`Failed to create manual: ${manualError.message}`);
    }
    
    console.log('Manual created successfully:', manual);
    
    // Process tags if provided
    let tagDetails: ManualTag[] = [];
    if (params.tags && params.tags.length > 0) {
      console.log("Processing tags for manual:", params.tags);
      
      try {
        // Get or create the tags by name
        const tags = await getOrCreateTagsByNames(params.tags);
        console.log("Retrieved/created tags:", tags);
        
        // Associate tags with the manual
        await associateTagsWithManual(manual.id, tags.map(tag => tag.id));
        console.log("Associated tags with manual");
        
        // Store the tag details
        tagDetails = tags;
      } catch (tagError) {
        console.error("Error processing tags:", tagError);
        // Don't fail the import just because tags failed
      }
    }
    
    // Format the response to match ManualWithMotorcycle type
    // Include make/model from the manual itself if motorcycle is not linked
    const manualWithMotorcycle: ManualWithMotorcycle = {
      ...manual,
      motorcycle_name: manual.motorcycles?.model_name || manual.model,
      make: manual.make,
      model: manual.model,
      tag_details: tagDetails
    };
    
    return manualWithMotorcycle;
  } catch (error) {
    console.error('Error in importManual:', error);
    throw error;
  }
};
