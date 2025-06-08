
import { supabase } from "@/integrations/supabase/client";

export interface Engine {
  id: string;
  name: string;
  displacement_cc: number;
  power_hp?: number;
  torque_nm?: number;
  engine_type?: string;
  power_rpm?: number;
  torque_rpm?: number;
  valve_count?: number;
  cylinder_count?: number;
  cooling?: string;
  fuel_system?: string;
  stroke_type?: string;
  bore_mm?: number;
  stroke_mm?: number;
  compression_ratio?: string;
  valves_per_cylinder?: number;
  valve_train?: string;
  ignition?: string;
  starter?: string;
  engine_code?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export const fetchEngines = async (): Promise<Engine[]> => {
  const { data, error } = await supabase
    .from('engines')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
};

export const createEngine = async (engineData: Omit<Engine, 'id' | 'created_at' | 'updated_at'>): Promise<Engine> => {
  const { data, error } = await supabase
    .from('engines')
    .insert([engineData])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const updateEngine = async (id: string, engineData: Partial<Engine>): Promise<Engine> => {
  const { data, error } = await supabase
    .from('engines')
    .update(engineData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const deleteEngine = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('engines')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
};

export const fetchEngineById = async (id: string): Promise<Engine> => {
  const { data, error } = await supabase
    .from('engines')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return data;
};
