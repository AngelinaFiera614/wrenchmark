
import { supabase } from "@/integrations/supabase/client";
import { SuspensionOption } from "@/types/components";

// Fetch all suspensions
export const fetchSuspensions = async (): Promise<SuspensionOption[]> => {
  try {
    const { data, error } = await supabase
      .from('suspensions')
      .select('*')
      .order('front_type');
      
    if (error) {
      console.error("Error fetching suspensions:", error);
      return [];
    }
    
    return data.map(suspension => ({
      id: suspension.id,
      name: suspension.front_type || 'Unnamed Suspension',
      front_type: suspension.front_type,
      rear_type: suspension.rear_type,
      brand: suspension.brand,
      adjustability: suspension.adjustability
    }));
  } catch (error) {
    console.error("Error in fetchSuspensions:", error);
    return [];
  }
};

// Create a new suspension
export const createSuspension = async (suspensionData: Omit<SuspensionOption, 'id'>): Promise<SuspensionOption | null> => {
  try {
    const { data, error } = await supabase
      .from('suspensions')
      .insert({
        front_type: suspensionData.front_type,
        rear_type: suspensionData.rear_type,
        brand: suspensionData.brand,
        adjustability: suspensionData.adjustability
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error creating suspension:", error);
      return null;
    }
    
    return {
      id: data.id,
      name: suspensionData.front_type || 'Unnamed Suspension',
      front_type: data.front_type,
      rear_type: data.rear_type,
      brand: data.brand,
      adjustability: data.adjustability
    };
  } catch (error) {
    console.error("Error in createSuspension:", error);
    return null;
  }
};
