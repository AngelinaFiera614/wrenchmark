
import { supabase } from "@/integrations/supabase/client";

export interface BrakeSystem {
  id: string;
  type: string;
  has_traction_control?: boolean;
  brake_type_front?: string;
  brake_type_rear?: string;
  front_disc_size_mm?: number;
  rear_disc_size_mm?: number;
  brake_brand?: string;
  caliper_type?: string;
  notes?: string;
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

  return data || [];
};

export const createBrake = async (brakeData: Omit<BrakeSystem, 'id' | 'created_at' | 'updated_at'>): Promise<BrakeSystem> => {
  const { data, error } = await supabase
    .from('brake_systems')
    .insert([brakeData])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
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

  return data;
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

  return data;
};
