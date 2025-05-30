
import { supabase } from "@/integrations/supabase/client";
import { Configuration } from "@/types/motorcycle";

// Fetch configurations for a specific model year
export const fetchConfigurations = async (modelYearId: string): Promise<Configuration[]> => {
  try {
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
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in fetchConfigurations:", error);
    return [];
  }
};

// Create a new configuration
export const createConfiguration = async (configData: Omit<Configuration, 'id' | 'engine' | 'brakes' | 'frame' | 'suspension' | 'wheels' | 'colors'>): Promise<Configuration | null> => {
  try {
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
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in createConfiguration:", error);
    return null;
  }
};

// Update an existing configuration
export const updateConfiguration = async (id: string, configData: Partial<Configuration>): Promise<Configuration | null> => {
  try {
    const { data, error } = await supabase
      .from('model_configurations')
      .update(configData)
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
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in updateConfiguration:", error);
    return null;
  }
};

// Delete a configuration
export const deleteConfiguration = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('model_configurations')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error("Error deleting configuration:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in deleteConfiguration:", error);
    return false;
  }
};

// Clone a configuration
export const cloneConfiguration = async (sourceId: string, newName: string): Promise<Configuration | null> => {
  try {
    // First fetch the source configuration
    const { data: sourceConfig, error: fetchError } = await supabase
      .from('model_configurations')
      .select('*')
      .eq('id', sourceId)
      .single();
      
    if (fetchError || !sourceConfig) {
      console.error("Error fetching source configuration:", fetchError);
      return null;
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
    return null;
  }
};
