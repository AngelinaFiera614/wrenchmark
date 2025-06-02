
import { supabase } from "@/integrations/supabase/client";
import { Configuration } from "@/types/motorcycle";

// Optimized configuration fetching with better data structure
export const fetchConfigurationsOptimized = async (modelYearId: string): Promise<Configuration[]> => {
  try {
    console.log("Fetching optimized configurations for model year:", modelYearId);
    
    const { data, error } = await supabase
      .from('model_configurations')
      .select(`
        *,
        engines:engine_id (
          id,
          name,
          displacement_cc,
          power_hp,
          torque_nm,
          engine_type
        ),
        brake_systems:brake_system_id (
          id,
          type,
          brake_type_front,
          brake_type_rear,
          has_traction_control
        ),
        frames:frame_id (
          id,
          type,
          material,
          construction_method
        ),
        suspensions:suspension_id (
          id,
          front_type,
          rear_type,
          brand,
          adjustability
        ),
        wheels:wheel_id (
          id,
          type,
          front_size,
          rear_size,
          rim_material
        ),
        color_variants:color_id (
          id,
          name,
          color_code,
          hex_code
        ),
        model_year:model_year_id (
          id,
          year,
          motorcycle_id,
          changes,
          msrp_usd
        )
      `)
      .eq('model_year_id', modelYearId)
      .order('is_default', { ascending: false })
      .order('name', { ascending: true });
      
    if (error) {
      console.error("Error fetching optimized configurations:", error);
      return [];
    }
    
    console.log("Fetched optimized configurations:", data?.length || 0);
    return data || [];
  } catch (error) {
    console.error("Error in fetchConfigurationsOptimized:", error);
    return [];
  }
};

// Batch create configurations for better performance
export const batchCreateConfigurations = async (
  modelYearId: string,
  configurationsData: Partial<Configuration>[]
): Promise<Configuration[]> => {
  try {
    console.log("Batch creating configurations for model year:", modelYearId);
    
    const configsWithDefaults = configurationsData.map((config, index) => ({
      model_year_id: modelYearId,
      name: config.name || `Configuration ${index + 1}`,
      is_default: index === 0, // First one is default
      ...config
    }));

    const { data, error } = await supabase
      .from('model_configurations')
      .insert(configsWithDefaults)
      .select(`
        *,
        engines:engine_id (id, name, displacement_cc, power_hp),
        brake_systems:brake_system_id (id, type),
        frames:frame_id (id, type, material),
        suspensions:suspension_id (id, front_type, rear_type, brand),
        wheels:wheel_id (id, type, front_size, rear_size)
      `);

    if (error) {
      console.error("Error batch creating configurations:", error);
      throw error;
    }

    console.log("Batch created configurations:", data?.length || 0);
    return data || [];
  } catch (error) {
    console.error("Error in batchCreateConfigurations:", error);
    throw error;
  }
};

// Optimized configuration update
export const updateConfigurationOptimized = async (
  configId: string,
  updates: Partial<Configuration>
): Promise<Configuration | null> => {
  try {
    console.log("Updating configuration:", configId);
    
    const { data, error } = await supabase
      .from('model_configurations')
      .update(updates)
      .eq('id', configId)
      .select(`
        *,
        engines:engine_id (id, name, displacement_cc, power_hp),
        brake_systems:brake_system_id (id, type),
        frames:frame_id (id, type, material),
        suspensions:suspension_id (id, front_type, rear_type, brand),
        wheels:wheel_id (id, type, front_size, rear_size)
      `)
      .single();

    if (error) {
      console.error("Error updating configuration:", error);
      return null;
    }

    console.log("Updated configuration:", data?.id);
    return data;
  } catch (error) {
    console.error("Error in updateConfigurationOptimized:", error);
    return null;
  }
};

// Get configuration statistics for analytics
export const getConfigurationStats = async (modelYearId: string) => {
  try {
    const { data, error } = await supabase
      .from('model_configurations')
      .select('id, name, trim_level, price_premium_usd, special_features')
      .eq('model_year_id', modelYearId);

    if (error) {
      console.error("Error fetching configuration stats:", error);
      return null;
    }

    const stats = {
      total: data?.length || 0,
      withPremium: data?.filter(c => c.price_premium_usd && c.price_premium_usd > 0).length || 0,
      withSpecialFeatures: data?.filter(c => c.special_features && c.special_features.length > 0).length || 0,
      trimLevels: [...new Set(data?.map(c => c.trim_level).filter(Boolean))].length
    };

    return stats;
  } catch (error) {
    console.error("Error in getConfigurationStats:", error);
    return null;
  }
};
