
import { supabase } from "@/integrations/supabase/client";

export interface Suspension {
  id: string;
  front_type?: string;
  rear_type?: string;
  brand?: string;
  adjustability?: string;
  front_travel_mm?: number;
  rear_travel_mm?: number;
  front_brand?: string;
  rear_brand?: string;
  created_at?: string;
  updated_at?: string;
}

export const fetchSuspensions = async (): Promise<Suspension[]> => {
  const { data, error } = await supabase
    .from('suspensions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
};

export const createSuspension = async (suspensionData: Omit<Suspension, 'id' | 'created_at' | 'updated_at'>): Promise<Suspension> => {
  const { data, error } = await supabase
    .from('suspensions')
    .insert([suspensionData])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const updateSuspension = async (id: string, suspensionData: Partial<Suspension>): Promise<Suspension> => {
  const { data, error } = await supabase
    .from('suspensions')
    .update(suspensionData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const deleteSuspension = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('suspensions')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
};

export const fetchSuspensionById = async (id: string): Promise<Suspension> => {
  const { data, error } = await supabase
    .from('suspensions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return data;
};
