
import { supabase } from "@/integrations/supabase/client";
import { BrakeOption } from "@/types/components";

// Fetch all brake systems
export const fetchBrakeSystems = async (): Promise<BrakeOption[]> => {
  try {
    const { data, error } = await supabase
      .from('brake_systems')
      .select('*')
      .order('type');
      
    if (error) {
      console.error("Error fetching brake systems:", error);
      return [];
    }
    
    return data.map(brake => ({
      id: brake.id,
      name: brake.type || 'Unnamed Brake System',
      type: brake.type,
      has_traction_control: brake.has_traction_control,
      brake_type_front: brake.brake_type_front,
      brake_type_rear: brake.brake_type_rear
    }));
  } catch (error) {
    console.error("Error in fetchBrakeSystems:", error);
    return [];
  }
};

// Create a new brake system
export const createBrakeSystem = async (brakeData: Omit<BrakeOption, 'id'>): Promise<BrakeOption | null> => {
  try {
    const { data, error } = await supabase
      .from('brake_systems')
      .insert({
        type: brakeData.type,
        has_traction_control: brakeData.has_traction_control,
        brake_type_front: brakeData.brake_type_front,
        brake_type_rear: brakeData.brake_type_rear
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error creating brake system:", error);
      return null;
    }
    
    return {
      id: data.id,
      name: data.type,
      type: data.type,
      has_traction_control: data.has_traction_control,
      brake_type_front: data.brake_type_front,
      brake_type_rear: data.brake_type_rear
    };
  } catch (error) {
    console.error("Error in createBrakeSystem:", error);
    return null;
  }
};
