
import { supabase } from "@/integrations/supabase/client";

export interface Frame {
  id: string;
  type: string;
  name?: string; // Computed from type for display purposes
  material?: string;
  notes?: string;
  rake_degrees?: number;
  trail_mm?: number;
  construction_method?: string;
  created_at?: string;
  updated_at?: string;
}

export const fetchFrames = async (): Promise<Frame[]> => {
  const { data, error } = await supabase
    .from('frames')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  // Add computed name field for display
  return (data || []).map(frame => ({
    ...frame,
    name: frame.type || 'Unnamed Frame'
  }));
};

export const createFrame = async (frameData: Omit<Frame, 'id' | 'created_at' | 'updated_at' | 'name'>): Promise<Frame> => {
  const { data, error } = await supabase
    .from('frames')
    .insert([frameData])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    ...data,
    name: data.type || 'Unnamed Frame'
  };
};

export const updateFrame = async (id: string, frameData: Partial<Frame>): Promise<Frame> => {
  const { data, error } = await supabase
    .from('frames')
    .update(frameData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    ...data,
    name: data.type || 'Unnamed Frame'
  };
};

export const deleteFrame = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('frames')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
};

export const fetchFrameById = async (id: string): Promise<Frame> => {
  const { data, error } = await supabase
    .from('frames')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return {
    ...data,
    name: data.type || 'Unnamed Frame'
  };
};
