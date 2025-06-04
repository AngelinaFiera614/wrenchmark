import { supabase } from "@/integrations/supabase/client";
import { Configuration } from "@/types/motorcycle";
import { 
  createConfiguration, 
  updateConfiguration, 
  deleteConfiguration, 
  fetchConfigurations 
} from "./configurationCore";

// Re-export core functions to maintain compatibility
export { 
  createConfiguration, 
  updateConfiguration, 
  deleteConfiguration, 
  fetchConfigurations 
};

// Additional service functions that extend the core functionality
export const fetchConfigurationsForMultipleYears = async (modelYearIds: string[]): Promise<Configuration[]> => {
  try {
    console.log("Fetching configurations for multiple years:", modelYearIds);
    
    if (modelYearIds.length === 0) return [];
    
    const { data, error } = await supabase
      .from('model_configurations')
      .select(`
        *,
        engine:engines(*),
        brakes:brake_systems(*),
        frame:frames(*),
        suspension:suspensions(*),
        wheels:wheels(*),
        color:color_options(*)
      `)
      .in('model_year_id', modelYearIds)
      .order('name');
      
    if (error) {
      console.error("Error fetching configurations for multiple years:", error);
      console.error("Error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      
      // Try a simpler query without joins if the main query fails
      console.log("Attempting fallback query without joins for multiple years...");
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('model_configurations')
        .select('*')
        .in('model_year_id', modelYearIds)
        .order('name');
        
      if (fallbackError) {
        console.error("Fallback query for multiple years also failed:", fallbackError);
        throw new Error(`Failed to fetch configurations: ${error.message}`);
      }
      
      console.log("Fallback query for multiple years succeeded:", fallbackData);
      return fallbackData || [];
    }
    
    console.log("Configurations fetched successfully for multiple years:", data);
    return data || [];
  } catch (error) {
    console.error("Error in fetchConfigurationsForMultipleYears:", error);
    throw error;
  }
};

export const checkForExistingDefault = async (modelYearId: string): Promise<Configuration | null> => {
  try {
    console.log("Checking for existing default configuration for year:", modelYearId);
    
    const { data, error } = await supabase
      .from('model_configurations')
      .select('*')
      .eq('model_year_id', modelYearId)
      .eq('is_default', true)
      .maybeSingle();
      
    if (error) {
      console.error("Error checking for existing default:", error);
      throw new Error(`Failed to check for existing default: ${error.message}`);
    }
    
    console.log("Existing default check result:", data);
    return data;
  } catch (error) {
    console.error("Error in checkForExistingDefault:", error);
    throw error;
  }
};

export const cloneConfiguration = async (sourceConfigId: string, newName: string): Promise<Configuration | null> => {
  try {
    console.log("Cloning configuration:", sourceConfigId, "with new name:", newName);
    
    // Get source configuration
    const { data: sourceConfig, error: fetchError } = await supabase
      .from('model_configurations')
      .select('*')
      .eq('id', sourceConfigId)
      .single();

    if (fetchError) {
      console.error("Error fetching source configuration:", fetchError);
      throw new Error(`Failed to fetch source configuration: ${fetchError.message}`);
    }

    // Create new configuration with copied data
    const newConfigData = {
      ...sourceConfig,
      id: undefined, // Remove ID to create new record
      name: newName,
      is_default: false, // Don't copy default status
      created_at: undefined,
      updated_at: undefined,
    };

    const clonedConfig = await createConfiguration(newConfigData);
    console.log("Configuration cloned successfully:", clonedConfig);
    return clonedConfig;
  } catch (error) {
    console.error("Error in cloneConfiguration:", error);
    throw error;
  }
};

export const getAvailableTargetYears = async (motorcycleId: string) => {
  const { data, error } = await supabase
    .from('model_years')
    .select('*')
    .eq('motorcycle_id', motorcycleId)
    .order('year', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch target years: ${error.message}`);
  }

  return data || [];
};

export const copyConfigurationToYear = async (sourceConfigId: string, targetYearId: string, overrides: Partial<Configuration> = {}) => {
  // Get source configuration
  const { data: sourceConfig, error: fetchError } = await supabase
    .from('model_configurations')
    .select('*')
    .eq('id', sourceConfigId)
    .single();

  if (fetchError) {
    throw new Error(`Failed to fetch source configuration: ${fetchError.message}`);
  }

  // Create new configuration with copied data
  const newConfigData = {
    ...sourceConfig,
    id: undefined, // Remove ID to create new record
    model_year_id: targetYearId,
    is_default: false, // Don't copy default status
    created_at: undefined,
    updated_at: undefined,
    ...overrides // Apply any overrides
  };

  return createConfiguration(newConfigData);
};
