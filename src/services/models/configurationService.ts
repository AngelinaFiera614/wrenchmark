
import { supabase } from "@/integrations/supabase/client";
import { Configuration } from "@/types/motorcycle";

// Fetch configurations for a specific model year with fallback queries
export const fetchConfigurations = async (modelYearId: string): Promise<Configuration[]> => {
  try {
    console.log("Fetching configurations for model year:", modelYearId);
    
    // First try with all relationships
    let { data, error } = await supabase
      .from('model_configurations')
      .select(`
        *,
        engine:engine_id(*),
        brakes:brake_system_id(*),
        frame:frame_id(*),
        suspension:suspension_id(*),
        wheels:wheel_id(*),
        colors:color_options(*)
      `)
      .eq('model_year_id', modelYearId)
      .order('is_default', { ascending: false });
      
    // If the complex query fails, try a simpler one
    if (error) {
      console.warn("Complex query failed, trying simple query:", error);
      
      const { data: simpleData, error: simpleError } = await supabase
        .from('model_configurations')
        .select('*')
        .eq('model_year_id', modelYearId)
        .order('is_default', { ascending: false });
        
      if (simpleError) {
        console.error("Simple query also failed:", simpleError);
        throw new Error(`Failed to fetch configurations: ${simpleError.message}`);
      }
      
      data = simpleData;
    }
    
    console.log("Fetched configurations:", data);
    return data || [];
  } catch (error) {
    console.error("Error in fetchConfigurations:", error);
    throw error;
  }
};

// Create a new configuration with better validation and error handling
export const createConfiguration = async (configData: Omit<Configuration, 'id' | 'engine' | 'brakes' | 'frame' | 'suspension' | 'wheels' | 'colors'>): Promise<Configuration | null> => {
  try {
    console.log("Creating configuration with data:", configData);
    
    // Validate required fields
    if (!configData.model_year_id) {
      throw new Error("Model year ID is required");
    }
    
    if (!configData.name || configData.name.trim() === '') {
      throw new Error("Configuration name is required");
    }

    // Clean the data - remove any undefined or empty string values for foreign keys
    const cleanConfigData = {
      ...configData,
      engine_id: configData.engine_id || null,
      brake_system_id: configData.brake_system_id || null,
      frame_id: configData.frame_id || null,
      suspension_id: configData.suspension_id || null,
      wheel_id: configData.wheel_id || null,
    };

    // First create the basic configuration without relationships
    const { data: basicConfig, error: insertError } = await supabase
      .from('model_configurations')
      .insert(cleanConfigData)
      .select('*')
      .single();
      
    if (insertError) {
      console.error("Error creating basic configuration:", insertError);
      throw new Error(`Failed to create configuration: ${insertError.message}`);
    }

    console.log("Basic configuration created:", basicConfig);

    // Now try to fetch it with relationships (but don't fail if relationships don't work)
    try {
      const { data: configWithRelations, error: relationError } = await supabase
        .from('model_configurations')
        .select(`
          *,
          engine:engine_id(*),
          brakes:brake_system_id(*),
          frame:frame_id(*),
          suspension:suspension_id(*),
          wheels:wheel_id(*)
        `)
        .eq('id', basicConfig.id)
        .single();

      if (relationError) {
        console.warn("Could not fetch relationships, returning basic config:", relationError);
        return basicConfig;
      }

      return configWithRelations;
    } catch (relationError) {
      console.warn("Relationship fetch failed, returning basic config:", relationError);
      return basicConfig;
    }
  } catch (error) {
    console.error("Error in createConfiguration:", error);
    throw error;
  }
};

// Update an existing configuration with better error handling
export const updateConfiguration = async (id: string, configData: Partial<Configuration>): Promise<Configuration | null> => {
  try {
    console.log("Updating configuration:", id, "with data:", configData);
    
    // Remove read-only fields that shouldn't be updated
    const { engine, brakes, frame, suspension, wheels, colors, created_at, updated_at, ...updateData } = configData;
    
    // Clean foreign key values
    if (updateData.engine_id === '') updateData.engine_id = null;
    if (updateData.brake_system_id === '') updateData.brake_system_id = null;
    if (updateData.frame_id === '') updateData.frame_id = null;
    if (updateData.suspension_id === '') updateData.suspension_id = null;
    if (updateData.wheel_id === '') updateData.wheel_id = null;

    const { data, error } = await supabase
      .from('model_configurations')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();
      
    if (error) {
      console.error("Error updating configuration:", error);
      throw new Error(`Failed to update configuration: ${error.message}`);
    }
    
    console.log("Configuration updated successfully:", data);
    return data;
  } catch (error) {
    console.error("Error in updateConfiguration:", error);
    throw error;
  }
};

// Delete a configuration
export const deleteConfiguration = async (id: string): Promise<boolean> => {
  try {
    console.log("Deleting configuration:", id);
    
    const { error } = await supabase
      .from('model_configurations')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error("Error deleting configuration:", error);
      throw new Error(`Failed to delete configuration: ${error.message}`);
    }
    
    console.log("Configuration deleted successfully");
    return true;
  } catch (error) {
    console.error("Error in deleteConfiguration:", error);
    throw error;
  }
};

// Clone a configuration with better error handling
export const cloneConfiguration = async (sourceId: string, newName: string): Promise<Configuration | null> => {
  try {
    console.log("Cloning configuration:", sourceId, "with new name:", newName);
    
    // First fetch the source configuration
    const { data: sourceConfig, error: fetchError } = await supabase
      .from('model_configurations')
      .select('*')
      .eq('id', sourceId)
      .single();
      
    if (fetchError || !sourceConfig) {
      console.error("Error fetching source configuration:", fetchError);
      throw new Error(`Failed to fetch source configuration: ${fetchError?.message || 'Not found'}`);
    }
    
    // Create new configuration based on source
    const newConfig = {
      ...sourceConfig,
      name: newName,
      is_default: false
    };
    delete newConfig.id;
    delete newConfig.created_at;
    delete newConfig.updated_at;
    
    return await createConfiguration(newConfig);
  } catch (error) {
    console.error("Error in cloneConfiguration:", error);
    throw error;
  }
};
