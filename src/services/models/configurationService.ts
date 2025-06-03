
import { supabase } from "@/integrations/supabase/client";
import { Configuration } from "@/types/motorcycle";

// Fetch configurations for a specific model year
export const fetchConfigurations = async (modelYearId: string): Promise<Configuration[]> => {
  try {
    console.log("Fetching configurations for model year ID:", modelYearId);
    
    const { data, error } = await supabase
      .from('model_configurations')
      .select(`
        *,
        engine:engines(*),
        brake_systems:brake_systems(*),
        frame:frames(*),
        suspension:suspensions(*),
        wheels:wheels(*),
        color_variants:color_variants(*)
      `)
      .eq('model_year_id', modelYearId)
      .order('name', { ascending: true });
      
    if (error) {
      console.error("Error fetching configurations:", error);
      return [];
    }
    
    console.log("Fetched configurations:", data);
    return data || [];
  } catch (error) {
    console.error("Error in fetchConfigurations:", error);
    return [];
  }
};

// Create a new configuration
export const createConfiguration = async (configData: Omit<Configuration, 'id'>): Promise<Configuration | null> => {
  try {
    const { data, error } = await supabase
      .from('model_configurations')
      .insert(configData)
      .select()
      .single();
      
    if (error) {
      console.error("Error creating configuration:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in createConfiguration:", error);
    return null;
  }
};

// Update an existing configuration
export const updateConfiguration = async (id: string, configData: Partial<Configuration>): Promise<Configuration | null> => {
  try {
    const { data, error } = await supabase
      .from('model_configurations')
      .update(configData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating configuration:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in updateConfiguration:", error);
    return null;
  }
};

// Delete a configuration
export const deleteConfiguration = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('model_configurations')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error("Error deleting configuration:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in deleteConfiguration:", error);
    return false;
  }
};
