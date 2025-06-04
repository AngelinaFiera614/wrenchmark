
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

// Enhanced copy configuration to multiple years with better validation and error handling
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
  
  if (!sourceId || !targetModelYearIds.length) {
    throw new Error("Source ID and target year IDs are required");
  }

  console.log(`Starting copy operation: ${sourceId} -> ${targetModelYearIds.length} years`);
  
  const results = [];
  
  // Fetch source configuration once
  const { data: sourceConfig, error: fetchError } = await supabase
    .from('model_configurations')
    .select('*')
    .eq('id', sourceId)
    .single();
    
  if (fetchError || !sourceConfig) {
    throw new Error(`Failed to fetch source configuration: ${fetchError?.message || 'Not found'}`);
  }

  const configName = options.newName || sourceConfig.name;
  console.log(`Using configuration name: ${configName}`);

  for (const yearId of targetModelYearIds) {
    try {
      console.log(`Processing year: ${yearId}`);

      // Check if configuration with same name already exists
      const { data: existingConfig } = await supabase
        .from('model_configurations')
        .select('*')
        .eq('model_year_id', yearId)
        .eq('name', configName)
        .maybeSingle();

      let resultConfig: Configuration | null = null;
      let action: 'created' | 'updated' = 'created';

      if (existingConfig && options.allowOverwrite) {
        // Update existing configuration
        console.log(`Updating existing configuration for year ${yearId}`);
        
        const updateData: Partial<Configuration> = {
          model_year_id: yearId,
        };

        // Apply copy options
        if (options.copyBasicInfo !== false) {
          updateData.name = configName;
          updateData.market_region = sourceConfig.market_region;
          updateData.trim_level = sourceConfig.trim_level;
          updateData.special_features = sourceConfig.special_features;
          updateData.optional_equipment = sourceConfig.optional_equipment;
          updateData.price_premium_usd = sourceConfig.price_premium_usd;
          updateData.image_url = sourceConfig.image_url;
        }

        if (options.copyComponents !== false) {
          updateData.engine_id = sourceConfig.engine_id;
          updateData.brake_system_id = sourceConfig.brake_system_id;
          updateData.frame_id = sourceConfig.frame_id;
          updateData.suspension_id = sourceConfig.suspension_id;
          updateData.wheel_id = sourceConfig.wheel_id;
          updateData.color_id = sourceConfig.color_id;
        }

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
        console.log(`Creating new configuration for year ${yearId}`);
        
        const newConfig: Partial<Configuration> = {
          model_year_id: yearId,
          is_default: false // Never copy as default to avoid conflicts
        };

        // Apply copy options
        if (options.copyBasicInfo !== false) {
          newConfig.name = configName;
          newConfig.market_region = sourceConfig.market_region;
          newConfig.trim_level = sourceConfig.trim_level;
          newConfig.special_features = sourceConfig.special_features;
          newConfig.optional_equipment = sourceConfig.optional_equipment;
          newConfig.price_premium_usd = sourceConfig.price_premium_usd;
          newConfig.image_url = sourceConfig.image_url;
        }

        if (options.copyComponents !== false) {
          newConfig.engine_id = sourceConfig.engine_id;
          newConfig.brake_system_id = sourceConfig.brake_system_id;
          newConfig.frame_id = sourceConfig.frame_id;
          newConfig.suspension_id = sourceConfig.suspension_id;
          newConfig.wheel_id = sourceConfig.wheel_id;
          newConfig.color_id = sourceConfig.color_id;
        }

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
        console.log(`Configuration "${configName}" exists for year ${yearId}, overwrite not allowed`);
        results.push({
          success: false,
          yearId,
          error: `Configuration "${configName}" already exists. Enable "Allow Overwrite" to update it.`,
          action: 'created'
        });
        continue;
      }
      
      if (resultConfig) {
        console.log(`Successfully ${action} configuration for year ${yearId}`);
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
        error: error.message || 'Unknown error occurred',
        action: 'created'
      });
    }
  }
  
  console.log(`Copy operation completed. ${results.filter(r => r.success).length}/${results.length} successful`);
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

// Enhanced function to get years with existing configurations for conflict detection
export const getYearsWithExistingConfigs = async (motorcycleId: string, configName: string): Promise<Set<string>> => {
  try {
    if (!motorcycleId || !configName) {
      return new Set();
    }

    console.log(`Checking for existing configs: motorcycle=${motorcycleId}, name=${configName}`);

    // First get all years for this motorcycle
    const { data: years, error: yearsError } = await supabase
      .from('model_years')
      .select('id')
      .eq('motorcycle_id', motorcycleId);

    if (yearsError) {
      console.error("Error fetching years:", yearsError);
      return new Set();
    }

    if (!years || years.length === 0) {
      return new Set();
    }

    const yearIds = years.map(y => y.id);

    // Then check for existing configurations with this name
    const { data: existingConfigs, error: configsError } = await supabase
      .from('model_configurations')
      .select('model_year_id')
      .eq('name', configName)
      .in('model_year_id', yearIds);

    if (configsError) {
      console.error("Error fetching existing configs:", configsError);
      return new Set();
    }

    const existingYearIds = new Set(existingConfigs?.map(c => c.model_year_id) || []);
    console.log(`Found ${existingYearIds.size} existing configurations`);
    
    return existingYearIds;
  } catch (error) {
    console.error("Error getting years with existing configs:", error);
    return new Set();
  }
};
