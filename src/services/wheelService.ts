
import { supabase } from "@/integrations/supabase/client";

export interface Wheel {
  id: string;
  type?: string;
  front_size?: string;
  rear_size?: string;
  front_tire_size?: string;
  rear_tire_size?: string;
  rim_material?: string;
  tubeless?: boolean;
  notes?: string;
  name?: string; // Computed field for display purposes
  created_at?: string;
  updated_at?: string;
}

export const fetchWheels = async (): Promise<Wheel[]> => {
  const { data, error } = await supabase
    .from('wheels')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  // Add computed name field for display
  return (data || []).map(wheel => ({
    ...wheel,
    name: wheel.type || `${wheel.front_size || 'F'} / ${wheel.rear_size || 'R'} Wheels`
  }));
};

export const createWheel = async (wheelData: Omit<Wheel, 'id' | 'created_at' | 'updated_at' | 'name'>): Promise<Wheel> => {
  const { data, error } = await supabase
    .from('wheels')
    .insert([wheelData])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    ...data,
    name: data.type || `${data.front_size || 'F'} / ${data.rear_size || 'R'} Wheels`
  };
};

export const updateWheel = async (id: string, wheelData: Partial<Wheel>): Promise<Wheel> => {
  const { data, error } = await supabase
    .from('wheels')
    .update(wheelData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    ...data,
    name: data.type || `${data.front_size || 'F'} / ${data.rear_size || 'R'} Wheels`
  };
};

export const deleteWheel = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('wheels')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
};

export const fetchWheelById = async (id: string): Promise<Wheel> => {
  const { data, error } = await supabase
    .from('wheels')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return {
    ...data,
    name: data.type || `${data.front_size || 'F'} / ${data.rear_size || 'R'} Wheels`
  };
};
