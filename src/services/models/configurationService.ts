
import { supabase } from "@/integrations/supabase/client";
import { Configuration } from "@/types/motorcycle";

export const createConfiguration = async (configData: Partial<Configuration>): Promise<Configuration | null> => {
  try {
    console.log("Creating configuration with data:", configData);
    
    // Ensure required fields are present
    if (!configData.model_year_id) {
      throw new Error("Model year ID is required");
    }
    
    if (!configData.name || configData.name.trim() === '') {
      throw new Error("Configuration name is required");
    }
    
    const { data, error } = await supabase
      .from('model_configurations')
      .insert([configData])
      .select('*')
      .single();
      
    if (error) {
      console.error("Error creating configuration:", error);
      throw new Error(`Failed to create configuration: ${error.message}`);
    }
    
    console.log("Configuration created successfully:", data);
    return data;
  } catch (error) {
    console.error("Error in createConfiguration:", error);
    throw error;
  }
};

export const updateConfiguration = async (configId: string, updateData: Partial<Configuration>): Promise<Configuration | null> => {
  try {
    console.log("Updating configuration:", configId, "with data:", updateData);
    
    const { data, error } = await supabase
      .from('model_configurations')
      .update(updateData)
      .eq('id', configId)
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

export const deleteConfiguration = async (configId: string): Promise<boolean> => {
  try {
    console.log("Deleting configuration:", configId);
    
    const { error } = await supabase
      .from('model_configurations')
      .delete()
      .eq('id', configId);
      
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

export const fetchConfigurations = async (modelYearId: string): Promise<Configuration[]> => {
  try {
    console.log("Fetching configurations for model year:", modelYearId);
    
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
      .eq('model_year_id', modelYearId)
      .order('name');
      
    if (error) {
      console.error("Error fetching configurations:", error);
      throw new Error(`Failed to fetch configurations: ${error.message}`);
    }
    
    console.log("Configurations fetched successfully:", data);
    return data || [];
  } catch (error) {
    console.error("Error in fetchConfigurations:", error);
    throw error;
  }
};

export const getAvailableTargetYears = async (motorcycleId: string) => {
  try {
    console.log("Fetching available target years for motorcycle:", motorcycleId);
    
    const { data, error } = await supabase
      .from('model_years')
      .select('id, year')
      .eq('motorcycle_id', motorcycleId)
      .order('year', { ascending: false });
      
    if (error) {
      console.error("Error fetching target years:", error);
      throw new Error(`Failed to fetch target years: ${error.message}`);
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getAvailableTargetYears:", error);
    throw error;
  }
};
