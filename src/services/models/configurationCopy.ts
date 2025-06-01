
import { supabase } from "@/integrations/supabase/client";
import { Configuration } from "@/types/motorcycle";
import { createConfiguration, updateConfiguration } from "./configurationCore";

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

// Copy configuration to multiple years with enhanced options including updates
export const copyConfigurationToMultipleYears = async (
  sourceId: string, 
  targetModelYearIds: string[],
  options: {
    newName?: string;
    copyComponents?: boolean;
    copyDimensions?: boolean;
    copyBasicInfo?: boolean;
    allowOverwrite?: boolean;
  } = {}
): Promise<Array<{ success: boolean; yearId: string; error?: string; configuration?: Configuration; action: 'created' | 'updated' }>> => {
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
          error: `Failed to fetch source configuration: ${fetchError?.message || 'Not found'}`,
          action: 'created'
        });
        continue;
      }

      const configName = options.newName || sourceConfig.name;

      // Check if configuration with same name already exists
      const { data: existingConfig } = await supabase
        .from('model_configurations')
        .select('*')
        .eq('model_year_id', yearId)
        .eq('name', configName)
        .single();

      let resultConfig: Configuration | null = null;
      let action: 'created' | 'updated' = 'created';

      if (existingConfig && options.allowOverwrite) {
        // Update existing configuration
        const updateData: any = {
          model_year_id: yearId,
        };

        // Copy basic info
        if (options.copyBasicInfo !== false) {
          updateData.name = configName;
          updateData.market_region = sourceConfig.market_region;
          updateData.trim_level = sourceConfig.trim_level;
          updateData.special_features = sourceConfig.special_features;
          updateData.optional_equipment = sourceConfig.optional_equipment;
          updateData.price_premium_usd = sourceConfig.price_premium_usd;
          updateData.image_url = sourceConfig.image_url;
        }

        // Copy components
        if (options.copyComponents !== false) {
          updateData.engine_id = sourceConfig.engine_id;
          updateData.brake_system_id = sourceConfig.brake_system_id;
          updateData.frame_id = sourceConfig.frame_id;
          updateData.suspension_id = sourceConfig.suspension_id;
          updateData.wheel_id = sourceConfig.wheel_id;
          updateData.color_id = sourceConfig.color_id;
        }

        // Copy dimensions
        if (options.copyDimensions !== false) {
          updateData.seat_height_mm = sourceConfig.seat_height_mm;
          updateData.weight_kg = sourceConfig.weight_kg;
          updateData.wheelbase_mm = sourceConfig.wheelbase_mm;
          updateData.fuel_capacity_l = sourceConfig.fuel_capacity_l;
          updateData.ground_clearance_mm = sourceConfig.ground_clearance_mm;
        }

        resultConfig = await updateConfiguration(existingConfig.id, updateData);
        action = 'updated';
      } else if (!existingConfig) {
        // Create new configuration
        const newConfig: any = {
          model_year_id: yearId,
          is_default: false // Never copy as default to avoid conflicts
        };

        // Copy basic info
        if (options.copyBasicInfo !== false) {
          newConfig.name = configName;
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

        resultConfig = await createConfiguration(newConfig);
        action = 'created';
      } else {
        // Configuration exists but overwrite not allowed
        results.push({
          success: false,
          yearId,
          error: `Configuration "${configName}" already exists. Enable "Allow Overwrite" to update it.`,
          action: 'created'
        });
        continue;
      }
      
      if (resultConfig) {
        results.push({
          success: true,
          yearId,
          configuration: resultConfig,
          action
        });
      } else {
        results.push({
          success: false,
          yearId,
          error: `Failed to ${action === 'updated' ? 'update' : 'create'} configuration`,
          action
        });
      }
    } catch (error: any) {
      console.error(`Error copying to year ${yearId}:`, error);
      results.push({
        success: false,
        yearId,
        error: error.message,
        action: 'created'
      });
    }
  }
  
  return results;
};

// Get all target years for copying (now includes all years)
export const getAvailableTargetYears = async (motorcycleId: string, excludeConfigName?: string): Promise<any[]> => {
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

// Get years with existing configurations for conflict detection
export const getYearsWithExistingConfigs = async (motorcycleId: string, configName: string): Promise<Set<string>> => {
  try {
    const { data: existingConfigs } = await supabase
      .from('model_configurations')
      .select('model_year_id')
      .eq('name', configName)
      .in('model_year_id', 
        await supabase
          .from('model_years')
          .select('id')
          .eq('motorcycle_id', motorcycleId)
          .then(({ data }) => data?.map(y => y.id) || [])
      );
      
    return new Set(existingConfigs?.map(c => c.model_year_id) || []);
  } catch (error) {
    console.error("Error getting years with existing configs:", error);
    return new Set();
  }
};
