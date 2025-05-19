
import { supabase } from "@/integrations/supabase/client";
import { Accessory, AccessoryFormState, AccessoryCompatibility } from "@/types/accessories";

// Fetch all accessories
export const getAllAccessories = async (): Promise<Accessory[]> => {
  try {
    const { data, error } = await supabase
      .from('accessories')
      .select('*')
      .order('name');
      
    if (error) {
      console.error("Error fetching accessories:", error);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error("Error in getAllAccessories:", error);
    return [];
  }
};

// Fetch accessories by category
export const getAccessoriesByCategory = async (category: string): Promise<Accessory[]> => {
  try {
    const { data, error } = await supabase
      .from('accessories')
      .select('*')
      .eq('category', category)
      .order('name');
      
    if (error) {
      console.error("Error fetching accessories by category:", error);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error("Error in getAccessoriesByCategory:", error);
    return [];
  }
};

// Fetch compatible accessories for a configuration
export const getCompatibleAccessories = async (configurationId: string): Promise<Accessory[]> => {
  try {
    const { data, error } = await supabase
      .from('accessory_compatibility')
      .select(`
        accessory_id,
        accessories:accessory_id(*)
      `)
      .eq('configuration_id', configurationId);
      
    if (error) {
      console.error("Error fetching compatible accessories:", error);
      return [];
    }
    
    // Extract accessory data from nested structures
    return data.map(item => item.accessories);
  } catch (error) {
    console.error("Error in getCompatibleAccessories:", error);
    return [];
  }
};

// Create a new accessory
export const createAccessory = async (accessoryData: AccessoryFormState): Promise<Accessory | null> => {
  try {
    const { data, error } = await supabase
      .from('accessories')
      .insert({
        name: accessoryData.name,
        category: accessoryData.category,
        description: accessoryData.description,
        price_usd: accessoryData.price_usd,
        image_url: accessoryData.image_url,
        manufacturer: accessoryData.manufacturer
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error creating accessory:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in createAccessory:", error);
    return null;
  }
};

// Update an accessory
export const updateAccessory = async (accessoryId: string, accessoryData: Partial<AccessoryFormState>): Promise<Accessory | null> => {
  try {
    const { data, error } = await supabase
      .from('accessories')
      .update({
        name: accessoryData.name,
        category: accessoryData.category,
        description: accessoryData.description,
        price_usd: accessoryData.price_usd,
        image_url: accessoryData.image_url,
        manufacturer: accessoryData.manufacturer
      })
      .eq('id', accessoryId)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating accessory:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in updateAccessory:", error);
    return null;
  }
};

// Delete an accessory
export const deleteAccessory = async (accessoryId: string): Promise<boolean> => {
  try {
    // First delete all compatibility records
    const { error: compError } = await supabase
      .from('accessory_compatibility')
      .delete()
      .eq('accessory_id', accessoryId);
      
    if (compError) {
      console.error("Error deleting accessory compatibility records:", compError);
      return false;
    }
    
    // Then delete the accessory
    const { error } = await supabase
      .from('accessories')
      .delete()
      .eq('id', accessoryId);
      
    if (error) {
      console.error("Error deleting accessory:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in deleteAccessory:", error);
    return false;
  }
};

// Add accessory compatibility
export const addAccessoryCompatibility = async (accessoryId: string, configurationId: string, notes?: string): Promise<AccessoryCompatibility | null> => {
  try {
    const { data, error } = await supabase
      .from('accessory_compatibility')
      .insert({
        accessory_id: accessoryId,
        configuration_id: configurationId,
        notes: notes
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error adding accessory compatibility:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in addAccessoryCompatibility:", error);
    return null;
  }
};

// Remove accessory compatibility
export const removeAccessoryCompatibility = async (accessoryId: string, configurationId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('accessory_compatibility')
      .delete()
      .eq('accessory_id', accessoryId)
      .eq('configuration_id', configurationId);
      
    if (error) {
      console.error("Error removing accessory compatibility:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in removeAccessoryCompatibility:", error);
    return false;
  }
};
