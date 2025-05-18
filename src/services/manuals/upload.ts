
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
    // First, check if we need to create a motorcycle record
    let motorcycleId = params.motorcycle_id;
    
    if (!motorcycleId && params.make && params.model) {
      // Find if a motorcycle with this make/model exists
      const { data: existingBikes } = await supabase
        .from('motorcycles')
        .select('id, model_name, brand_id')
        .eq('model_name', params.model);
      
      if (existingBikes && existingBikes.length > 0) {
        // Use existing motorcycle
        motorcycleId = existingBikes[0].id;
        console.log('Using existing motorcycle:', motorcycleId);
      } else {
        // Need to find or create the brand first
        const { data: brands } = await supabase
          .from('brands')
          .select('id')
          .ilike('name', params.make)
          .limit(1);
        
        let brandId: string;
        if (brands && brands.length > 0) {
          // Use existing brand
          brandId = brands[0].id;
          console.log('Using existing brand:', brandId);
        } else {
          // Create new brand
          const slug = params.make.toLowerCase().replace(/\s+/g, '-');
          const { data: newBrand, error: brandError } = await supabase
            .from('brands')
            .insert({
              name: params.make,
              slug: slug
            })
            .select()
            .single();
          
          if (brandError) {
            throw new Error(`Failed to create brand: ${brandError.message}`);
          }
          
          brandId = newBrand.id;
          console.log('Created new brand:', brandId);
        }
        
        // Create new motorcycle
        const slug = `${params.make}-${params.model}`.toLowerCase().replace(/\s+/g, '-');
        const { data: newMotorcycle, error: motorcycleError } = await supabase
          .from('motorcycles')
          .insert({
            brand_id: brandId,
            model_name: params.model,
            year: params.year,
            slug: slug,
            is_placeholder: true // Mark as placeholder for incomplete record
          })
          .select()
          .single();
        
        if (motorcycleError) {
          throw new Error(`Failed to create motorcycle: ${motorcycleError.message}`);
        }
        
        motorcycleId = newMotorcycle.id;
        console.log('Created new motorcycle:', motorcycleId);
      }
    }
    
    if (!motorcycleId) {
      throw new Error('Missing motorcycle ID and not enough information to create one');
    }
    
    // Now create the manual record
    const manualData: ManualInfo = {
      title: params.title,
      manual_type: params.manual_type,
      motorcycle_id: motorcycleId,
      year: params.year,
      file_url: params.file_url,
      file_size_mb: params.file_size_mb
    };
    
    console.log('Creating manual with data:', manualData);
    
    // Create the manual record
    const { data: manual, error: manualError } = await supabase
      .from('manuals')
      .insert(manualData)
      .select('*, motorcycles!inner(model_name)')
      .single();
    
    if (manualError) {
      throw new Error(`Failed to create manual: ${manualError.message}`);
    }
    
    console.log('Manual created successfully:', manual);
    
    // Process tags if provided
    if (params.tags && params.tags.length > 0) {
      console.log("Processing tags for manual:", params.tags);
      
      try {
        // Get or create the tags by name
        const tags = await getOrCreateTagsByNames(params.tags);
        console.log("Retrieved/created tags:", tags);
        
        // Associate tags with the manual
        await associateTagsWithManual(manual.id, tags.map(tag => tag.id));
        console.log("Associated tags with manual");
        
        // Add tag details to the manual
        manual.tag_details = tags;
      } catch (tagError) {
        console.error("Error processing tags:", tagError);
        // Don't fail the import just because tags failed
      }
    }
    
    // Format the response to match ManualWithMotorcycle type
    const manualWithMotorcycle: ManualWithMotorcycle = {
      ...manual,
      motorcycle_name: manual.motorcycles?.model_name
    };
    
    return manualWithMotorcycle;
  } catch (error) {
    console.error('Error in importManual:', error);
    throw error;
  }
};
