
import { supabase } from "@/integrations/supabase/client";
import { FrameOption } from "@/types/components";

// Fetch all frames
export const fetchFrames = async (): Promise<FrameOption[]> => {
  try {
    const { data, error } = await supabase
      .from('frames')
      .select('*')
      .order('type');
      
    if (error) {
      console.error("Error fetching frames:", error);
      return [];
    }
    
    return data.map(frame => ({
      id: frame.id,
      name: frame.type,
      type: frame.type,
      material: frame.material,
      notes: frame.notes,
      rake_degrees: frame.rake_degrees,
      trail_mm: frame.trail_mm,
      construction_method: frame.construction_method
    }));
  } catch (error) {
    console.error("Error in fetchFrames:", error);
    return [];
  }
};

// Create a new frame
export const createFrame = async (frameData: Omit<FrameOption, 'id' | 'name'>): Promise<FrameOption | null> => {
  try {
    const { data, error } = await supabase
      .from('frames')
      .insert({
        type: frameData.type,
        material: frameData.material,
        construction_method: frameData.construction_method,
        rake_degrees: frameData.rake_degrees,
        trail_mm: frameData.trail_mm,
        notes: frameData.notes
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error creating frame:", error);
      return null;
    }
    
    return {
      id: data.id,
      name: data.type,
      type: data.type,
      material: data.material,
      notes: data.notes,
      rake_degrees: data.rake_degrees,
      trail_mm: data.trail_mm,
      construction_method: data.construction_method
    };
  } catch (error) {
    console.error("Error in createFrame:", error);
    return null;
  }
};

// Update an existing frame
export const updateFrame = async (id: string, frameData: Omit<FrameOption, 'id' | 'name'>): Promise<FrameOption | null> => {
  try {
    const { data, error } = await supabase
      .from('frames')
      .update({
        type: frameData.type,
        material: frameData.material,
        construction_method: frameData.construction_method,
        rake_degrees: frameData.rake_degrees,
        trail_mm: frameData.trail_mm,
        notes: frameData.notes
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating frame:", error);
      return null;
    }
    
    return {
      id: data.id,
      name: data.type,
      type: data.type,
      material: data.material,
      notes: data.notes,
      rake_degrees: data.rake_degrees,
      trail_mm: data.trail_mm,
      construction_method: data.construction_method
    };
  } catch (error) {
    console.error("Error in updateFrame:", error);
    return null;
  }
};

// Delete a frame
export const deleteFrame = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('frames')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error("Error deleting frame:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in deleteFrame:", error);
    return false;
  }
};
