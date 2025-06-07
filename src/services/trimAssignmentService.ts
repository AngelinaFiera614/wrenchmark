
import { supabase } from "@/integrations/supabase/client";

interface TrimAssignmentResult {
  success: boolean;
  error?: string;
  createdConfigurations?: string[];
  existingConfigurations?: string[];
}

// Copy a trim configuration to multiple years with duplicate prevention
export const assignTrimToYears = async (
  sourceConfigurationId: string,
  targetYearIds: string[]
): Promise<TrimAssignmentResult> => {
  try {
    console.log(`Copying trim ${sourceConfigurationId} to years:`, targetYearIds);

    // First, get the source configuration data
    const { data: sourceConfig, error: fetchError } = await supabase
      .from('model_configurations')
      .select('*')
      .eq('id', sourceConfigurationId)
      .single();

    if (fetchError || !sourceConfig) {
      console.error('Error fetching source configuration:', fetchError);
      return { success: false, error: 'Could not fetch source configuration' };
    }

    const createdConfigurations: string[] = [];
    const existingConfigurations: string[] = [];

    // Create new configurations for each target year
    for (const yearId of targetYearIds) {
      // Skip if it's the same year as the source
      if (yearId === sourceConfig.model_year_id) {
        console.log(`Skipping source year ${yearId}`);
        existingConfigurations.push(sourceConfig.id);
        continue;
      }

      // Check if a configuration already exists for this year with the same name
      const { data: existingConfig } = await supabase
        .from('model_configurations')
        .select('id, name')
        .eq('model_year_id', yearId)
        .eq('name', sourceConfig.name || 'Standard')
        .single();

      if (existingConfig) {
        console.log(`Configuration "${sourceConfig.name || 'Standard'}" already exists for year ${yearId}`);
        existingConfigurations.push(existingConfig.id);
        continue;
      }

      // Create new configuration (excluding id, created_at, updated_at)
      const newConfig = {
        model_year_id: yearId,
        name: sourceConfig.name,
        description: sourceConfig.description,
        engine_id: sourceConfig.engine_id,
        brake_system_id: sourceConfig.brake_system_id,
        frame_id: sourceConfig.frame_id,
        suspension_id: sourceConfig.suspension_id,
        wheel_id: sourceConfig.wheel_id,
        engine_override: sourceConfig.engine_override,
        brake_system_override: sourceConfig.brake_system_override,
        frame_override: sourceConfig.frame_override,
        suspension_override: sourceConfig.suspension_override,
        wheel_override: sourceConfig.wheel_override,
        seat_height_mm: sourceConfig.seat_height_mm,
        weight_kg: sourceConfig.weight_kg,
        wheelbase_mm: sourceConfig.wheelbase_mm,
        fuel_capacity_l: sourceConfig.fuel_capacity_l,
        ground_clearance_mm: sourceConfig.ground_clearance_mm,
        msrp_usd: sourceConfig.msrp_usd,
        price_premium_usd: sourceConfig.price_premium_usd,
        market_region: sourceConfig.market_region,
        trim_level: sourceConfig.trim_level,
        special_features: sourceConfig.special_features,
        optional_equipment: sourceConfig.optional_equipment,
        image_url: sourceConfig.image_url,
        notes: sourceConfig.notes,
        is_default: false // Don't copy default status
      };

      const { data: createdConfig, error: createError } = await supabase
        .from('model_configurations')
        .insert(newConfig)
        .select('id')
        .single();

      if (createError) {
        console.error(`Error creating configuration for year ${yearId}:`, createError);
        return { 
          success: false, 
          error: `Failed to create configuration: ${createError.message}`,
          createdConfigurations,
          existingConfigurations
        };
      }

      if (createdConfig) {
        createdConfigurations.push(createdConfig.id);
        console.log(`Created configuration ${createdConfig.id} for year ${yearId}`);
      }
    }

    return { 
      success: true, 
      createdConfigurations,
      existingConfigurations
    };
  } catch (error) {
    console.error('Unexpected error in assignTrimToYears:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

// Create a new trim configuration for selected years with validation
export const createTrimForYears = async (
  yearIds: string[],
  trimData: {
    name: string;
    description?: string;
    trim_level?: string;
    market_region?: string;
    notes?: string;
    msrp_usd?: number;
    seat_height_mm?: number;
    weight_kg?: number;
  }
): Promise<TrimAssignmentResult> => {
  try {
    console.log(`Creating new trim for years:`, yearIds, trimData);

    // Validate required fields
    if (!trimData.name || trimData.name.trim() === '') {
      return { success: false, error: 'Trim name is required' };
    }

    if (yearIds.length === 0) {
      return { success: false, error: 'At least one year must be selected' };
    }

    const createdConfigurations: string[] = [];
    const existingConfigurations: string[] = [];

    for (const yearId of yearIds) {
      // Check if a configuration already exists for this year with the same name
      const { data: existingConfig } = await supabase
        .from('model_configurations')
        .select('id, name')
        .eq('model_year_id', yearId)
        .eq('name', trimData.name.trim())
        .single();

      if (existingConfig) {
        console.log(`Configuration "${trimData.name}" already exists for year ${yearId}`);
        existingConfigurations.push(existingConfig.id);
        continue;
      }

      const newConfig = {
        model_year_id: yearId,
        name: trimData.name.trim(),
        description: trimData.description?.trim() || null,
        trim_level: trimData.trim_level?.trim() || null,
        market_region: trimData.market_region?.trim() || 'US',
        notes: trimData.notes?.trim() || null,
        msrp_usd: trimData.msrp_usd || null,
        seat_height_mm: trimData.seat_height_mm || null,
        weight_kg: trimData.weight_kg || null,
        is_default: false
      };

      const { data: createdConfig, error: createError } = await supabase
        .from('model_configurations')
        .insert(newConfig)
        .select('id')
        .single();

      if (createError) {
        console.error(`Error creating trim for year ${yearId}:`, createError);
        return { 
          success: false, 
          error: `Failed to create trim: ${createError.message}`,
          createdConfigurations,
          existingConfigurations
        };
      }

      if (createdConfig) {
        createdConfigurations.push(createdConfig.id);
        console.log(`Created trim configuration ${createdConfig.id} for year ${yearId}`);
      }
    }

    return { 
      success: true, 
      createdConfigurations,
      existingConfigurations
    };
  } catch (error) {
    console.error('Unexpected error in createTrimForYears:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

// Get trim assignments across years for a model
export const getTrimAssignments = async (modelId: string) => {
  try {
    const { data, error } = await supabase
      .from('model_configurations')
      .select(`
        *,
        model_years!inner(
          id,
          year,
          motorcycle_id
        )
      `)
      .eq('model_years.motorcycle_id', modelId)
      .order('model_years.year', { ascending: true });

    if (error) {
      console.error('Error fetching trim assignments:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getTrimAssignments:', error);
    throw error;
  }
};

// Delete a configuration with validation
export const deleteConfiguration = async (configurationId: string): Promise<TrimAssignmentResult> => {
  try {
    console.log(`Deleting configuration ${configurationId}`);

    // Check if configuration exists
    const { data: config, error: fetchError } = await supabase
      .from('model_configurations')
      .select('id, name, model_year_id')
      .eq('id', configurationId)
      .single();

    if (fetchError || !config) {
      return { success: false, error: 'Configuration not found' };
    }

    // Delete the configuration
    const { error: deleteError } = await supabase
      .from('model_configurations')
      .delete()
      .eq('id', configurationId);

    if (deleteError) {
      console.error('Error deleting configuration:', deleteError);
      return { success: false, error: deleteError.message };
    }

    console.log(`Successfully deleted configuration ${configurationId}`);
    return { success: true };
  } catch (error) {
    console.error('Unexpected error in deleteConfiguration:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

// Check for duplicate trim names within a model year
export const checkDuplicateTrimName = async (
  modelYearId: string, 
  trimName: string, 
  excludeConfigId?: string
): Promise<boolean> => {
  try {
    let query = supabase
      .from('model_configurations')
      .select('id')
      .eq('model_year_id', modelYearId)
      .eq('name', trimName.trim());

    if (excludeConfigId) {
      query = query.neq('id', excludeConfigId);
    }

    const { data, error } = await query.single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error checking duplicate trim name:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error in checkDuplicateTrimName:', error);
    return false;
  }
};
