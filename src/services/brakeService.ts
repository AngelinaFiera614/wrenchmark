
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
  const { data, error } = await supabase
    .from('brake_systems')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  // Add computed name field for display
  return (data || []).map(brake => ({
    ...brake,
    name: brake.type || `${brake.brake_brand || 'Brake'} System ${brake.id.slice(0, 8)}`
  }));
};

export const createBrake = async (brakeData: Omit<BrakeSystem, 'id' | 'created_at' | 'updated_at' | 'name'>): Promise<BrakeSystem> => {
  const { data, error } = await supabase
    .from('brake_systems')
    .insert([brakeData])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    ...data,
    name: data.type || `${data.brake_brand || 'Brake'} System ${data.id.slice(0, 8)}`
  };
};

export const updateBrake = async (id: string, brakeData: Partial<BrakeSystem>): Promise<BrakeSystem> => {
  const { data, error } = await supabase
    .from('brake_systems')
    .update(brakeData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    ...data,
    name: data.type || `${data.brake_brand || 'Brake'} System ${data.id.slice(0, 8)}`
  };
};

export const deleteBrake = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('brake_systems')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
};

export const fetchBrakeById = async (id: string): Promise<BrakeSystem> => {
  const { data, error } = await supabase
    .from('brake_systems')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return {
    ...data,
    name: data.type || `${data.brake_brand || 'Brake'} System ${data.id.slice(0, 8)}`
  };
};
