
import { supabase } from "@/integrations/supabase/client";
import { Configuration } from "@/types/motorcycle";

export const createConfiguration = async (configData: Partial<Configuration>): Promise<Configuration | null> => {
  try {
    console.log("Creating configuration with data:", configData);
    
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
