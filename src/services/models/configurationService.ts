
import { supabase } from "@/integrations/supabase/client";
import { Configuration } from "@/types/motorcycle";

// Fetch configurations for a specific model year
export const fetchConfigurations = async (modelYearId: string): Promise<Configuration[]> => {
  try {
    console.log("Fetching configurations for model year ID:", modelYearId);
    
    const { data, error } = await supabase
      .from('model_configurations')
      .select(`
        *,
        engine:engines(*),
        brake_systems:brake_systems(*),
        frame:frames(*),
        suspension:suspensions(*),
        wheels:wheels(*),
        color_variants:color_variants(*)
      `)
      .eq('model_year_id', modelYearId)
      .order('name', { ascending: true });
      
    if (error) {
      console.error("Error fetching configurations:", error);
      return [];
    }
    
    console.log("Fetched configurations:", data);
    return data || [];
  } catch (error) {
    console.error("Error in fetchConfigurations:", error);
    return [];
  }
};

// Create a new configuration
export const createConfiguration = async (configData: Omit<Configuration, 'id'>): Promise<Configuration | null> => {
  try {
    const { data, error } = await supabase
      .from('model_configurations')
      .insert(configData)
      .select()
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
      .select()
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

// Check for existing default configuration
export const checkForExistingDefault = async (modelYearId: string): Promise<Configuration | null> => {
  try {
    const { data, error } = await supabase
      .from('model_configurations')
      .select('*')
      .eq('model_year_id', modelYearId)
      .eq('is_default', true)
      .single();
      
    if (error && error.code !== 'PGRST116') {
      console.error("Error checking for existing default:", error);
      return null;
    }
    
    return data || null;
  } catch (error) {
    console.error("Error in checkForExistingDefault:", error);
    return null;
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

// Get available target years for copying
export const getAvailableTargetYears = async (motorcycleId: string): Promise<any[]> => {
  try {
    console.log("Fetching available target years for motorcycle:", motorcycleId);
    
    const { data: years, error } = await supabase
      .from('model_years')
      .select('*')
      .eq('motorcycle_id', motorcycleId)
      .order('year', { ascending: false });
      
    if (error) {
      console.error("Error fetching model years:", error);
      throw new Error(`Failed to fetch model years: ${error.message}`);
    }
    
    return years || [];
  } catch (error) {
    console.error("Error in getAvailableTargetYears:", error);
    throw error;
  }
};
