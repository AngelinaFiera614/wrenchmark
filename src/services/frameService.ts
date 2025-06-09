
import { supabase } from "@/integrations/supabase/client";

export interface Frame {
  id: string;
  type: string;
  material?: string;
  construction_method?: string;
  rake_degrees?: number;
  trail_mm?: number;
  wheelbase_mm?: number;
  mounting_type?: string;
  notes?: string;
  name?: string; // Computed field for display purposes
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
    name: frame.type || `${frame.material || 'Frame'} ${frame.id.slice(0, 8)}`
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
    name: data.type || `${data.material || 'Frame'} ${data.id.slice(0, 8)}`
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
    name: data.type || `${data.material || 'Frame'} ${data.id.slice(0, 8)}`
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
    name: data.type || `${data.material || 'Frame'} ${data.id.slice(0, 8)}`
  };
};
