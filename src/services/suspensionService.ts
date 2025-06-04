
import { supabase } from "@/integrations/supabase/client";

export interface Suspension {
  id: string;
  name?: string; // Computed for display purposes
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

  // Add computed name field for display
  return (data || []).map(suspension => ({
    ...suspension,
    name: suspension.brand || 
          `${suspension.front_type || 'Unknown'} / ${suspension.rear_type || 'Unknown'}` ||
          'Unnamed Suspension'
  }));
};

export const createSuspension = async (suspensionData: Omit<Suspension, 'id' | 'created_at' | 'updated_at' | 'name'>): Promise<Suspension> => {
  const { data, error } = await supabase
    .from('suspensions')
    .insert([suspensionData])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    ...data,
    name: data.brand || 
          `${data.front_type || 'Unknown'} / ${data.rear_type || 'Unknown'}` ||
          'Unnamed Suspension'
  };
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

  return {
    ...data,
    name: data.brand || 
          `${data.front_type || 'Unknown'} / ${data.rear_type || 'Unknown'}` ||
          'Unnamed Suspension'
  };
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

  return {
    ...data,
    name: data.brand || 
          `${data.front_type || 'Unknown'} / ${data.rear_type || 'Unknown'}` ||
          'Unnamed Suspension'
  };
};
