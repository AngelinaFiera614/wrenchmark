
import { supabase } from "@/integrations/supabase/client";
import { Configuration } from "@/types/motorcycle";

export const createConfiguration = async (configData: Partial<Configuration>): Promise<Configuration | null> => {
  try {
    console.log("Creating configuration with data:", configData);
    
    // Ensure required fields are present
    if (!configData.model_year_id) {
      throw new Error("Model year ID is required");
    }
    
    if (!configData.name || configData.name.trim() === '') {
      throw new Error("Configuration name is required");
    }
    
    // If this is being set as default, first unset any existing default for this model year
    if (configData.is_default) {
      console.log("Unsetting existing default configurations for model year:", configData.model_year_id);
      const { error: unsetError } = await supabase
        .from('model_configurations')
        .update({ is_default: false })
        .eq('model_year_id', configData.model_year_id)
        .eq('is_default', true);
        
      if (unsetError) {
        console.error("Error unsetting existing default:", unsetError);
        throw new Error(`Failed to unset existing default: ${unsetError.message}`);
      }
    }
    
    const { data, error } = await supabase
      .from('model_configurations')
      .insert([configData])
      .select('*')
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

export const updateConfiguration = async (configId: string, updateData: Partial<Configuration>): Promise<Configuration | null> => {
  try {
    console.log("Updating configuration:", configId, "with data:", updateData);
    
    // If this is being set as default, first unset any existing default for this model year
    if (updateData.is_default) {
      // First get the model_year_id for this configuration
      const { data: configData, error: fetchError } = await supabase
        .from('model_configurations')
        .select('model_year_id')
        .eq('id', configId)
        .single();
        
      if (fetchError) {
        throw new Error(`Failed to fetch configuration: ${fetchError.message}`);
      }
      
      console.log("Unsetting existing default configurations for model year:", configData.model_year_id);
      const { error: unsetError } = await supabase
        .from('model_configurations')
        .update({ is_default: false })
        .eq('model_year_id', configData.model_year_id)
        .eq('is_default', true)
        .neq('id', configId); // Don't unset the one we're updating
        
      if (unsetError) {
        console.error("Error unsetting existing default:", unsetError);
        throw new Error(`Failed to unset existing default: ${unsetError.message}`);
      }
    }
    
    const { data, error } = await supabase
      .from('model_configurations')
      .update(updateData)
      .eq('id', configId)
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

export const deleteConfiguration = async (configId: string): Promise<boolean> => {
  try {
    console.log("Deleting configuration:", configId);
    
    const { error } = await supabase
      .from('model_configurations')
      .delete()
      .eq('id', configId);
      
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

export const fetchConfigurations = async (modelYearId: string): Promise<Configuration[]> => {
  try {
    console.log("Fetching configurations for model year:", modelYearId);
    
    const { data, error } = await supabase
      .from('model_configurations')
      .select(`
        *,
        engine:engines(*),
        brakes:brake_systems(*),
        frame:frames(*),
        suspension:suspensions(*),
        wheels:wheels(*),
        color:color_variants(*)
      `)
      .eq('model_year_id', modelYearId)
      .order('name');
      
    if (error) {
      console.error("Error fetching configurations:", error);
      throw new Error(`Failed to fetch configurations: ${error.message}`);
    }
    
    console.log("Configurations fetched successfully:", data);
    return data || [];
  } catch (error) {
    console.error("Error in fetchConfigurations:", error);
    throw error;
  }
};

export const getAvailableTargetYears = async (motorcycleId: string) => {
  try {
    console.log("Fetching available target years for motorcycle:", motorcycleId);
    
    const { data, error } = await supabase
      .from('model_years')
      .select('id, year')
      .eq('motorcycle_id', motorcycleId)
      .order('year', { ascending: false });
      
    if (error) {
      console.error("Error fetching target years:", error);
      throw new Error(`Failed to fetch target years: ${error.message}`);
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getAvailableTargetYears:", error);
    throw error;
  }
};

// Add missing exports to fix build errors
export const cloneConfiguration = async (sourceConfigId: string, targetModelYearId: string): Promise<Configuration | null> => {
  try {
    // Get the source configuration
    const { data: sourceConfig, error: fetchError } = await supabase
      .from('model_configurations')
      .select('*')
      .eq('id', sourceConfigId)
      .single();
      
    if (fetchError || !sourceConfig) {
      throw new Error('Source configuration not found');
    }
    
    // Create new configuration data (excluding id and timestamps)
    const newConfigData = {
      ...sourceConfig,
      id: undefined,
      created_at: undefined,
      updated_at: undefined,
      model_year_id: targetModelYearId,
      is_default: false, // Don't clone as default to avoid conflicts
    };
    
    return await createConfiguration(newConfigData);
  } catch (error) {
    console.error("Error cloning configuration:", error);
    throw error;
  }
};

export const copyConfigurationToMultipleYears = async (sourceConfigId: string, targetYearIds: string[]): Promise<Configuration[]> => {
  try {
    const results: Configuration[] = [];
    
    for (const yearId of targetYearIds) {
      const cloned = await cloneConfiguration(sourceConfigId, yearId);
      if (cloned) {
        results.push(cloned);
      }
    }
    
    return results;
  } catch (error) {
    console.error("Error copying configuration to multiple years:", error);
    throw error;
  }
};

export const getYearsWithExistingConfigs = async (motorcycleId: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('model_configurations')
      .select('model_year_id')
      .in('model_year_id', 
        await supabase
          .from('model_years')
          .select('id')
          .eq('motorcycle_id', motorcycleId)
          .then(res => res.data?.map(y => y.id) || [])
      );
      
    if (error) {
      throw new Error(`Failed to fetch existing configurations: ${error.message}`);
    }
    
    return data?.map(config => config.model_year_id) || [];
  } catch (error) {
    console.error("Error getting years with existing configs:", error);
    throw error;
  }
};

export const checkForExistingDefault = async (modelYearId: string): Promise<Configuration | null> => {
  try {
    const { data, error } = await supabase
      .from('model_configurations')
      .select('*')
      .eq('model_year_id', modelYearId)
      .eq('is_default', true)
      .single();
      
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw error;
    }
    
    return data || null;
  } catch (error) {
    console.error("Error checking for existing default:", error);
    return null;
  }
};
