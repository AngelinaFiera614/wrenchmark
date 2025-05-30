
import { supabase } from "@/integrations/supabase/client";
import { BrakeOption } from "@/types/components";

// Fetch all brake systems
export const fetchBrakes = async (): Promise<BrakeOption[]> => {
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
      name: brake.type,
      type: brake.type,
      has_traction_control: brake.has_traction_control,
      brake_type_front: brake.brake_type_front,
      brake_type_rear: brake.brake_type_rear,
      front_disc_size_mm: brake.front_disc_size_mm,
      rear_disc_size_mm: brake.rear_disc_size_mm,
      brake_brand: brake.brake_brand,
      caliper_type: brake.caliper_type
    }));
  } catch (error) {
    console.error("Error in fetchBrakes:", error);
    return [];
  }
};

// Create a new brake system
export const createBrake = async (brakeData: Omit<BrakeOption, 'id' | 'name'>): Promise<BrakeOption | null> => {
  try {
    const { data, error } = await supabase
      .from('brake_systems')
      .insert({
        type: brakeData.type,
        has_traction_control: brakeData.has_traction_control,
        brake_type_front: brakeData.brake_type_front,
        brake_type_rear: brakeData.brake_type_rear,
        front_disc_size_mm: brakeData.front_disc_size_mm,
        rear_disc_size_mm: brakeData.rear_disc_size_mm,
        brake_brand: brakeData.brake_brand,
        caliper_type: brakeData.caliper_type
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
      brake_type_rear: data.brake_type_rear,
      front_disc_size_mm: data.front_disc_size_mm,
      rear_disc_size_mm: data.rear_disc_size_mm,
      brake_brand: data.brake_brand,
      caliper_type: data.caliper_type
    };
  } catch (error) {
    console.error("Error in createBrake:", error);
    return null;
  }
};

// Update an existing brake system
export const updateBrake = async (id: string, brakeData: Omit<BrakeOption, 'id' | 'name'>): Promise<BrakeOption | null> => {
  try {
    const { data, error } = await supabase
      .from('brake_systems')
      .update({
        type: brakeData.type,
        has_traction_control: brakeData.has_traction_control,
        brake_type_front: brakeData.brake_type_front,
        brake_type_rear: brakeData.brake_type_rear,
        front_disc_size_mm: brakeData.front_disc_size_mm,
        rear_disc_size_mm: brakeData.rear_disc_size_mm,
        brake_brand: brakeData.brake_brand,
        caliper_type: brakeData.caliper_type
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating brake system:", error);
      return null;
    }
    
    return {
      id: data.id,
      name: data.type,
      type: data.type,
      has_traction_control: data.has_traction_control,
      brake_type_front: data.brake_type_front,
      brake_type_rear: data.brake_type_rear,
      front_disc_size_mm: data.front_disc_size_mm,
      rear_disc_size_mm: data.rear_disc_size_mm,
      brake_brand: data.brake_brand,
      caliper_type: data.caliper_type
    };
  } catch (error) {
    console.error("Error in updateBrake:", error);
    return null;
  }
};

// Delete a brake system
export const deleteBrake = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('brake_systems')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error("Error deleting brake system:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in deleteBrake:", error);
    return false;
  }
};
