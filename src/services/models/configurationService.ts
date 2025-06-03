
import { supabase } from "@/integrations/supabase/client";
import { Configuration } from "@/types/motorcycle";

export const getConfigurations = async (modelYearId: string): Promise<Configuration[]> => {
  try {
    const { data, error } = await supabase
      .from('model_configurations')
      .select(`
        *,
        engines(*),
        brake_systems(*),
        frames(*),
        suspensions(*),
        wheels(*)
      `)
      .eq('model_year_id', modelYearId)
      .order('name', { ascending: true });

    if (error) {
      console.error("Error fetching configurations:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error in getConfigurations:", error);
    throw error;
  }
};

export const deleteConfiguration = async (configId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('model_configurations')
      .delete()
      .eq('id', configId);

    if (error) {
      console.error("Error deleting configuration:", error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteConfiguration:", error);
    throw error;
  }
};

export const getAvailableTargetYears = async (motorcycleId: string) => {
  try {
    const { data, error } = await supabase
      .from('model_years')
      .select(`
        *,
        motorcycle_models!inner(name)
      `)
      .eq('motorcycle_id', motorcycleId)
      .order('year', { ascending: false });

    if (error) {
      console.error("Error fetching target years:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error in getAvailableTargetYears:", error);
    throw error;
  }
};

// Update configuration with component inheritance support
export const updateConfiguration = async (
  configId: string, 
  updates: Partial<Configuration>
): Promise<Configuration | null> => {
  try {
    const { data, error } = await supabase
      .from('model_configurations')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', configId)
      .select(`
        *,
        engines(*),
        brake_systems(*),
        frames(*),
        suspensions(*),
        wheels(*)
      `)
      .single();

    if (error) {
      console.error("Error updating configuration:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in updateConfiguration:", error);
    throw error;
  }
};

// Set component override for a configuration
export const setComponentOverride = async (
  configId: string,
  componentType: 'engine' | 'brake_system' | 'frame' | 'suspension' | 'wheel',
  componentId: string | null
): Promise<boolean> => {
  try {
    const overrideField = `${componentType}_override`;
    const componentField = `${componentType}_id`;
    
    const { error } = await supabase
      .from('model_configurations')
      .update({
        [overrideField]: componentId !== null,
        [componentField]: componentId,
        updated_at: new Date().toISOString()
      })
      .eq('id', configId);

    if (error) {
      console.error("Error setting component override:", error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error in setComponentOverride:", error);
    throw error;
  }
};
