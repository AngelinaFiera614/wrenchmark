
import { supabase } from "@/integrations/supabase/client";
import { Configuration } from "@/types/motorcycle";
import { createConfiguration } from "./configurationCore";

// Clone a configuration within the same year
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

// Copy configuration to multiple years with options
export const copyConfigurationToMultipleYears = async (
  sourceId: string, 
  targetModelYearIds: string[],
  options: {
    newName?: string;
    copyComponents?: boolean;
    copyDimensions?: boolean;
    copyBasicInfo?: boolean;
  } = {}
): Promise<Array<{ success: boolean; yearId: string; error?: string; configuration?: Configuration }>> => {
  const results = [];
  
  for (const yearId of targetModelYearIds) {
    try {
      console.log(`Copying configuration ${sourceId} to year ${yearId}`);
      
      // Fetch the source configuration
      const { data: sourceConfig, error: fetchError } = await supabase
        .from('model_configurations')
        .select('*')
        .eq('id', sourceId)
        .single();
        
      if (fetchError || !sourceConfig) {
        console.error("Error fetching source configuration:", fetchError);
        results.push({
          success: false,
          yearId,
          error: `Failed to fetch source configuration: ${fetchError?.message || 'Not found'}`
        });
        continue;
      }
      
      // Prepare new configuration data based on options
      const newConfig: any = {
        model_year_id: yearId,
        is_default: false // Never copy as default to avoid conflicts
      };

      // Copy basic info
      if (options.copyBasicInfo !== false) {
        newConfig.name = options.newName || sourceConfig.name;
        newConfig.market_region = sourceConfig.market_region;
        newConfig.trim_level = sourceConfig.trim_level;
        newConfig.special_features = sourceConfig.special_features;
        newConfig.optional_equipment = sourceConfig.optional_equipment;
        newConfig.price_premium_usd = sourceConfig.price_premium_usd;
        newConfig.image_url = sourceConfig.image_url;
      }

      // Copy components
      if (options.copyComponents !== false) {
        newConfig.engine_id = sourceConfig.engine_id;
        newConfig.brake_system_id = sourceConfig.brake_system_id;
        newConfig.frame_id = sourceConfig.frame_id;
        newConfig.suspension_id = sourceConfig.suspension_id;
        newConfig.wheel_id = sourceConfig.wheel_id;
        newConfig.color_id = sourceConfig.color_id;
      }

      // Copy dimensions
      if (options.copyDimensions !== false) {
        newConfig.seat_height_mm = sourceConfig.seat_height_mm;
        newConfig.weight_kg = sourceConfig.weight_kg;
        newConfig.wheelbase_mm = sourceConfig.wheelbase_mm;
        newConfig.fuel_capacity_l = sourceConfig.fuel_capacity_l;
        newConfig.ground_clearance_mm = sourceConfig.ground_clearance_mm;
      }

      // Remove fields that shouldn't be copied
      delete newConfig.id;
      delete newConfig.created_at;
      delete newConfig.updated_at;

      const copiedConfig = await createConfiguration(newConfig);
      
      if (copiedConfig) {
        results.push({
          success: true,
          yearId,
          configuration: copiedConfig
        });
      } else {
        results.push({
          success: false,
          yearId,
          error: "Failed to create configuration"
        });
      }
    } catch (error: any) {
      console.error(`Error copying to year ${yearId}:`, error);
      results.push({
        success: false,
        yearId,
        error: error.message
      });
    }
  }
  
  return results;
};

// Get available target years for copying (excluding years that already have this config name)
export const getAvailableTargetYears = async (motorcycleId: string, excludeConfigName?: string): Promise<any[]> => {
  try {
    console.log("Fetching available target years for motorcycle:", motorcycleId);
    
    let query = supabase
      .from('model_years')
      .select('*')
      .eq('motorcycle_id', motorcycleId)
      .order('year', { ascending: false });

    const { data: years, error } = await query;
      
    if (error) {
      console.error("Error fetching model years:", error);
      throw new Error(`Failed to fetch model years: ${error.message}`);
    }
    
    // If we have a config name to exclude, filter out years that already have a config with that name
    if (excludeConfigName && years) {
      const { data: existingConfigs } = await supabase
        .from('model_configurations')
        .select('model_year_id, name')
        .in('model_year_id', years.map(y => y.id))
        .eq('name', excludeConfigName);
        
      const excludeYearIds = new Set(existingConfigs?.map(c => c.model_year_id) || []);
      return years.filter(year => !excludeYearIds.has(year.id));
    }
    
    return years || [];
  } catch (error) {
    console.error("Error in getAvailableTargetYears:", error);
    throw error;
  }
};
