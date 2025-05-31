
import { supabase } from "@/integrations/supabase/client";
import { Configuration } from "@/types/motorcycle";

// Fetch configurations for a specific model year
export const fetchConfigurations = async (modelYearId: string): Promise<Configuration[]> => {
  try {
    console.log("Fetching configurations for model year:", modelYearId);
    
    const { data, error } = await supabase
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
      
    if (error) {
      console.error("Error fetching configurations:", error);
      throw new Error(`Failed to fetch configurations: ${error.message}`);
    }
    
    console.log("Fetched configurations:", data);
    return data || [];
  } catch (error) {
    console.error("Error in fetchConfigurations:", error);
    throw error;
  }
};

// Create a new configuration
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
    
    const { data, error } = await supabase
      .from('model_configurations')
      .insert(configData)
      .select(`
        *,
        engine:engine_id(*),
        brakes:brake_system_id(*),
        frame:frame_id(*),
        suspension:suspension_id(*),
        wheels:wheel_id(*)
      `)
      .single();
      
    if (error) {
      console.error("Error creating configuration:", error);
      throw new Error(`Failed to create configuration: ${error.message}`);
    }
    
    console.log("Configuration created successfully:", data);
    return data;
  } catch (error) {
    console.error("Error in createConfiguration:", error);
    throw error;
  }
};

// Update an existing configuration
export const updateConfiguration = async (id: string, configData: Partial<Configuration>): Promise<Configuration | null> => {
  try {
    console.log("Updating configuration:", id, "with data:", configData);
    
    // Remove read-only fields that shouldn't be updated
    const { engine, brakes, frame, suspension, wheels, colors, created_at, updated_at, ...updateData } = configData;
    
    const { data, error } = await supabase
      .from('model_configurations')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        engine:engine_id(*),
        brakes:brake_system_id(*),
        frame:frame_id(*),
        suspension:suspension_id(*),
        wheels:wheel_id(*)
      `)
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

// Clone a configuration
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
