
import { supabase } from "@/integrations/supabase/client";

interface TrimAssignmentResult {
  success: boolean;
  error?: string;
  createdConfigurations?: string[];
}

// Copy a trim configuration to multiple years
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

    // Create new configurations for each target year
    for (const yearId of targetYearIds) {
      // Check if a configuration already exists for this year with the same name
      const { data: existingConfig } = await supabase
        .from('model_configurations')
        .select('id')
        .eq('model_year_id', yearId)
        .eq('name', sourceConfig.name || 'Standard')
        .single();

      if (existingConfig) {
        console.log(`Configuration already exists for year ${yearId}, skipping`);
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
        return { success: false, error: `Failed to create configuration: ${createError.message}` };
      }

      if (createdConfig) {
        createdConfigurations.push(createdConfig.id);
        console.log(`Created configuration ${createdConfig.id} for year ${yearId}`);
      }
    }

    return { 
      success: true, 
      createdConfigurations 
    };
  } catch (error) {
    console.error('Unexpected error in assignTrimToYears:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

// Create a new trim configuration for selected years
export const createTrimForYears = async (
  yearIds: string[],
  trimData: {
    name: string;
    description?: string;
    trim_level?: string;
    market_region?: string;
    notes?: string;
  }
): Promise<TrimAssignmentResult> => {
  try {
    console.log(`Creating new trim for years:`, yearIds, trimData);

    const createdConfigurations: string[] = [];

    for (const yearId of yearIds) {
      // Check if a configuration already exists for this year with the same name
      const { data: existingConfig } = await supabase
        .from('model_configurations')
        .select('id')
        .eq('model_year_id', yearId)
        .eq('name', trimData.name)
        .single();

      if (existingConfig) {
        console.log(`Configuration "${trimData.name}" already exists for year ${yearId}, skipping`);
        continue;
      }

      const newConfig = {
        model_year_id: yearId,
        name: trimData.name,
        description: trimData.description,
        trim_level: trimData.trim_level,
        market_region: trimData.market_region,
        notes: trimData.notes,
        is_default: false
      };

      const { data: createdConfig, error: createError } = await supabase
        .from('model_configurations')
        .insert(newConfig)
        .select('id')
        .single();

      if (createError) {
        console.error(`Error creating trim for year ${yearId}:`, createError);
        return { success: false, error: `Failed to create trim: ${createError.message}` };
      }

      if (createdConfig) {
        createdConfigurations.push(createdConfig.id);
        console.log(`Created trim configuration ${createdConfig.id} for year ${yearId}`);
      }
    }

    return { 
      success: true, 
      createdConfigurations 
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
