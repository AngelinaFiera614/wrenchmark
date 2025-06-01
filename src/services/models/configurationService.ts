import { supabase } from "@/integrations/supabase/client";
import { Configuration } from "@/types/motorcycle";

// Fetch configurations for a specific model year with proper error handling
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

// Create a new configuration with proper validation
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
      // Ensure numeric fields are properly converted or null
      seat_height_mm: configData.seat_height_mm ? Number(configData.seat_height_mm) : null,
      weight_kg: configData.weight_kg ? Number(configData.weight_kg) : null,
      wheelbase_mm: configData.wheelbase_mm ? Number(configData.wheelbase_mm) : null,
      fuel_capacity_l: configData.fuel_capacity_l ? Number(configData.fuel_capacity_l) : null,
      ground_clearance_mm: configData.ground_clearance_mm ? Number(configData.ground_clearance_mm) : null,
      price_premium_usd: configData.price_premium_usd ? Number(configData.price_premium_usd) : null,
    };

    // Validate positive dimensions
    const dimensionFields = ['seat_height_mm', 'weight_kg', 'wheelbase_mm', 'fuel_capacity_l', 'ground_clearance_mm'];
    for (const field of dimensionFields) {
      const value = cleanConfigData[field as keyof typeof cleanConfigData];
      if (value !== null && value !== undefined && Number(value) <= 0) {
        throw new Error(`${field.replace(/_/g, ' ')} must be a positive number`);
      }
    }

    // Validate price premium is not negative
    if (cleanConfigData.price_premium_usd !== null && cleanConfigData.price_premium_usd < 0) {
      throw new Error("Price premium cannot be negative");
    }

    const { data: basicConfig, error: insertError } = await supabase
      .from('model_configurations')
      .insert(cleanConfigData)
      .select('*')
      .single();
      
    if (insertError) {
      console.error("Error creating configuration:", insertError);
      throw new Error(`Failed to create configuration: ${insertError.message}`);
    }

    console.log("Configuration created successfully:", basicConfig);

    // Fetch the configuration with relationships
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

// Update an existing configuration
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

    // Convert numeric fields
    if (updateData.seat_height_mm !== undefined) {
      updateData.seat_height_mm = updateData.seat_height_mm ? Number(updateData.seat_height_mm) : null;
    }
    if (updateData.weight_kg !== undefined) {
      updateData.weight_kg = updateData.weight_kg ? Number(updateData.weight_kg) : null;
    }
    if (updateData.wheelbase_mm !== undefined) {
      updateData.wheelbase_mm = updateData.wheelbase_mm ? Number(updateData.wheelbase_mm) : null;
    }
    if (updateData.fuel_capacity_l !== undefined) {
      updateData.fuel_capacity_l = updateData.fuel_capacity_l ? Number(updateData.fuel_capacity_l) : null;
    }
    if (updateData.ground_clearance_mm !== undefined) {
      updateData.ground_clearance_mm = updateData.ground_clearance_mm ? Number(updateData.ground_clearance_mm) : null;
    }
    if (updateData.price_premium_usd !== undefined) {
      updateData.price_premium_usd = updateData.price_premium_usd ? Number(updateData.price_premium_usd) : null;
    }

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
