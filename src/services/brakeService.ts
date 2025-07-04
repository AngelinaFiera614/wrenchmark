
import { supabase } from "@/integrations/supabase/client";

export interface BrakeSystem {
  id: string;
  type: string;
  front_type?: string;
  rear_type?: string;
  front_disc_size_mm?: string;
  rear_disc_size_mm?: string;
  caliper_type?: string;
  brake_brand?: string;
  has_traction_control?: boolean;
  has_abs?: boolean;
  notes?: string;
  name?: string; // Computed field for display purposes
  created_at?: string;
  updated_at?: string;
}

export const fetchBrakes = async (): Promise<BrakeSystem[]> => {
  console.log("fetchBrakes called");
  
  const { data, error } = await supabase
    .from('brake_systems')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching brakes:", error);
    throw error;
  }

  console.log("Fetched brakes:", data);

  // Add computed name field for display
  return (data || []).map(brake => ({
    ...brake,
    name: brake.type || `${brake.brake_brand || 'Brake'} System ${brake.id.slice(0, 8)}`
  }));
};

export const createBrake = async (brakeData: Omit<BrakeSystem, 'id' | 'created_at' | 'updated_at' | 'name'>): Promise<BrakeSystem> => {
  console.log("createBrake called with data:", brakeData);
  
  // Validate required fields
  if (!brakeData.type || brakeData.type.trim() === '') {
    throw new Error("Brake system type is required");
  }

  // Clean up the data - convert empty strings to null for optional fields
  const cleanData = {
    type: brakeData.type.trim(),
    brake_brand: brakeData.brake_brand && brakeData.brake_brand.trim() !== '' ? brakeData.brake_brand.trim() : null,
    front_type: brakeData.front_type && brakeData.front_type.trim() !== '' ? brakeData.front_type.trim() : null,
    rear_type: brakeData.rear_type && brakeData.rear_type.trim() !== '' ? brakeData.rear_type.trim() : null,
    front_disc_size_mm: brakeData.front_disc_size_mm && brakeData.front_disc_size_mm.trim() !== '' ? brakeData.front_disc_size_mm.trim() : null,
    rear_disc_size_mm: brakeData.rear_disc_size_mm && brakeData.rear_disc_size_mm.trim() !== '' ? brakeData.rear_disc_size_mm.trim() : null,
    caliper_type: brakeData.caliper_type && brakeData.caliper_type.trim() !== '' ? brakeData.caliper_type.trim() : null,
    has_traction_control: Boolean(brakeData.has_traction_control),
    has_abs: Boolean(brakeData.has_abs),
    notes: brakeData.notes && brakeData.notes.trim() !== '' ? brakeData.notes.trim() : null,
    is_draft: false // Default to published
  };

  console.log("Cleaned brake data for insertion:", cleanData);

  const { data, error } = await supabase
    .from('brake_systems')
    .insert([cleanData])
    .select()
    .single();

  if (error) {
    console.error("Error creating brake:", error);
    throw new Error(`Failed to create brake system: ${error.message}`);
  }

  console.log("Successfully created brake:", data);

  return {
    ...data,
    name: data.type || `${data.brake_brand || 'Brake'} System ${data.id.slice(0, 8)}`
  };
};

export const updateBrake = async (id: string, brakeData: Partial<BrakeSystem>): Promise<BrakeSystem> => {
  console.log("updateBrake called with id:", id, "data:", brakeData);

  const { data, error } = await supabase
    .from('brake_systems')
    .update(brakeData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error("Error updating brake:", error);
    throw error;
  }

  return {
    ...data,
    name: data.type || `${data.brake_brand || 'Brake'} System ${data.id.slice(0, 8)}`
  };
};

export const deleteBrake = async (id: string): Promise<void> => {
  console.log("deleteBrake called with id:", id);

  const { error } = await supabase
    .from('brake_systems')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting brake:", error);
    throw error;
  }

  console.log("Successfully deleted brake with id:", id);
};

export const fetchBrakeById = async (id: string): Promise<BrakeSystem> => {
  console.log("fetchBrakeById called with id:", id);

  const { data, error } = await supabase
    .from('brake_systems')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error("Error fetching brake by id:", error);
    throw error;
  }

  return {
    ...data,
    name: data.type || `${data.brake_brand || 'Brake'} System ${data.id.slice(0, 8)}`
  };
};
