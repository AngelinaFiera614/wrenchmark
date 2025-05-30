
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
      name: `${wheel.front_size || ''} / ${wheel.rear_size || ''} ${wheel.type || 'Wheels'}`.trim(),
      type: wheel.type,
      front_size: wheel.front_size,
      rear_size: wheel.rear_size,
      front_tire_size: wheel.front_tire_size,
      rear_tire_size: wheel.rear_tire_size,
      rim_material: wheel.rim_material,
      spoke_count_front: wheel.spoke_count_front,
      spoke_count_rear: wheel.spoke_count_rear,
      notes: wheel.notes
    }));
  } catch (error) {
    console.error("Error in fetchWheels:", error);
    return [];
  }
};

// Create a new wheel
export const createWheels = async (wheelData: Omit<WheelOption, 'id' | 'name'>): Promise<WheelOption | null> => {
  try {
    const { data, error } = await supabase
      .from('wheels')
      .insert({
        type: wheelData.type,
        front_size: wheelData.front_size,
        rear_size: wheelData.rear_size,
        front_tire_size: wheelData.front_tire_size,
        rear_tire_size: wheelData.rear_tire_size,
        rim_material: wheelData.rim_material,
        spoke_count_front: wheelData.spoke_count_front,
        spoke_count_rear: wheelData.spoke_count_rear,
        notes: wheelData.notes
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error creating wheel:", error);
      return null;
    }
    
    return {
      id: data.id,
      name: `${data.front_size || ''} / ${data.rear_size || ''} ${data.type || 'Wheels'}`.trim(),
      type: data.type,
      front_size: data.front_size,
      rear_size: data.rear_size,
      front_tire_size: data.front_tire_size,
      rear_tire_size: data.rear_tire_size,
      rim_material: data.rim_material,
      spoke_count_front: data.spoke_count_front,
      spoke_count_rear: data.spoke_count_rear,
      notes: data.notes
    };
  } catch (error) {
    console.error("Error in createWheels:", error);
    return null;
  }
};
