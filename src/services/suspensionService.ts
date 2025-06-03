
import { supabase } from "@/integrations/supabase/client";
import { SuspensionOption } from "@/types/components";

// Fetch all suspensions
export const fetchSuspensions = async (): Promise<SuspensionOption[]> => {
  try {
    const { data, error } = await supabase
      .from('suspensions')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching suspensions:", error);
      return [];
    }
    
    return data.map(suspension => ({
      id: suspension.id,
      name: `${suspension.front_type || 'Unknown'} / ${suspension.rear_type || 'Unknown'}`,
      front_type: suspension.front_type,
      rear_type: suspension.rear_type,
      brand: suspension.brand,
      adjustability: suspension.adjustability,
      front_travel_mm: suspension.front_travel_mm,
      rear_travel_mm: suspension.rear_travel_mm,
      front_brand: suspension.front_brand,
      rear_brand: suspension.rear_brand
    }));
  } catch (error) {
    console.error("Error in fetchSuspensions:", error);
    return [];
  }
};

// Create a new suspension
export const createSuspension = async (suspensionData: Omit<SuspensionOption, 'id' | 'name'>): Promise<SuspensionOption | null> => {
  try {
    const { data, error } = await supabase
      .from('suspensions')
      .insert({
        front_type: suspensionData.front_type,
        rear_type: suspensionData.rear_type,
        brand: suspensionData.brand,
        adjustability: suspensionData.adjustability,
        front_travel_mm: suspensionData.front_travel_mm,
        rear_travel_mm: suspensionData.rear_travel_mm,
        front_brand: suspensionData.front_brand,
        rear_brand: suspensionData.rear_brand
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error creating suspension:", error);
      return null;
    }
    
    return {
      id: data.id,
      name: `${data.front_type || 'Unknown'} / ${data.rear_type || 'Unknown'}`,
      front_type: data.front_type,
      rear_type: data.rear_type,
      brand: data.brand,
      adjustability: data.adjustability,
      front_travel_mm: data.front_travel_mm,
      rear_travel_mm: data.rear_travel_mm,
      front_brand: data.front_brand,
      rear_brand: data.rear_brand
    };
  } catch (error) {
    console.error("Error in createSuspension:", error);
    return null;
  }
};

// Update an existing suspension
export const updateSuspension = async (id: string, suspensionData: Omit<SuspensionOption, 'id' | 'name'>): Promise<SuspensionOption | null> => {
  try {
    const { data, error } = await supabase
      .from('suspensions')
      .update({
        front_type: suspensionData.front_type,
        rear_type: suspensionData.rear_type,
        brand: suspensionData.brand,
        adjustability: suspensionData.adjustability,
        front_travel_mm: suspensionData.front_travel_mm,
        rear_travel_mm: suspensionData.rear_travel_mm,
        front_brand: suspensionData.front_brand,
        rear_brand: suspensionData.rear_brand
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating suspension:", error);
      return null;
    }
    
    return {
      id: data.id,
      name: `${data.front_type || 'Unknown'} / ${data.rear_type || 'Unknown'}`,
      front_type: data.front_type,
      rear_type: data.rear_type,
      brand: data.brand,
      adjustability: data.adjustability,
      front_travel_mm: data.front_travel_mm,
      rear_travel_mm: data.rear_travel_mm,
      front_brand: data.front_brand,
      rear_brand: data.rear_brand
    };
  } catch (error) {
    console.error("Error in updateSuspension:", error);
    return null;
  }
};

// Delete a suspension
export const deleteSuspension = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('suspensions')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error("Error deleting suspension:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in deleteSuspension:", error);
    return false;
  }
};
