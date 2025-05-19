
import { supabase } from "@/integrations/supabase/client";
import { WheelOption } from "@/types/components";

// Fetch all wheels
export const fetchWheels = async (): Promise<WheelOption[]> => {
  try {
    const { data, error } = await supabase
      .from('wheels')
      .select('*')
      .order('type');
      
    if (error) {
      console.error("Error fetching wheels:", error);
      return [];
    }
    
    return data.map(wheel => ({
      id: wheel.id,
      name: wheel.type || `${wheel.front_size}/${wheel.rear_size}` || 'Unnamed Wheels',
      type: wheel.type,
      front_size: wheel.front_size,
      rear_size: wheel.rear_size
    }));
  } catch (error) {
    console.error("Error in fetchWheels:", error);
    return [];
  }
};

// Create new wheels
export const createWheels = async (wheelData: Omit<WheelOption, 'id'>): Promise<WheelOption | null> => {
  try {
    const { data, error } = await supabase
      .from('wheels')
      .insert({
        type: wheelData.type,
        front_size: wheelData.front_size,
        rear_size: wheelData.rear_size
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error creating wheels:", error);
      return null;
    }
    
    return {
      id: data.id,
      name: wheelData.type || `${wheelData.front_size}/${wheelData.rear_size}` || 'Unnamed Wheels',
      type: data.type,
      front_size: data.front_size,
      rear_size: data.rear_size
    };
  } catch (error) {
    console.error("Error in createWheels:", error);
    return null;
  }
};
