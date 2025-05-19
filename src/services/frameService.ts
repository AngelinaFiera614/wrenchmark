
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
      name: frame.type || 'Unnamed Frame',
      type: frame.type,
      material: frame.material,
      notes: frame.notes
    }));
  } catch (error) {
    console.error("Error in fetchFrames:", error);
    return [];
  }
};

// Create a new frame
export const createFrame = async (frameData: Omit<FrameOption, 'id'>): Promise<FrameOption | null> => {
  try {
    const { data, error } = await supabase
      .from('frames')
      .insert({
        type: frameData.type,
        material: frameData.material,
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
      notes: data.notes
    };
  } catch (error) {
    console.error("Error in createFrame:", error);
    return null;
  }
};
