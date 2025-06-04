
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
      .in('model_year_id', modelYearIds)
      .order('name');
      
    if (error) {
      console.error("Error fetching configurations for multiple years:", error);
      throw new Error(`Failed to fetch configurations: ${error.message}`);
    }
    
    console.log("Configurations fetched successfully for multiple years:", data);
    return data || [];
  } catch (error) {
    console.error("Error in fetchConfigurationsForMultipleYears:", error);
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
