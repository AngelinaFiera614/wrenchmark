
import { supabase } from "@/integrations/supabase/client";
import { ColorOption, ColorFormState } from "@/types/colors";

// Fetch all colors for a configuration
export const getColorsForConfiguration = async (configurationId: string): Promise<ColorOption[]> => {
  try {
    const { data, error } = await supabase
      .from('color_options')
      .select('*')
      .eq('model_year_id', configurationId)
      .order('name');
      
    if (error) {
      console.error("Error fetching colors:", error);
      return [];
    }
    
    return data as unknown as ColorOption[];
  } catch (error) {
    console.error("Error in getColorsForConfiguration:", error);
    return [];
  }
};

// Create a new color option
export const createColor = async (configurationId: string, colorData: ColorFormState): Promise<ColorOption | null> => {
  try {
    const { data, error } = await supabase
      .from('color_options')
      .insert({
        model_year_id: configurationId,
        name: colorData.name,
        hex_code: colorData.hex_code,
        image_url: colorData.image_url,
        is_limited: colorData.is_limited
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error creating color option:", error);
      return null;
    }
    
    return data as unknown as ColorOption;
  } catch (error) {
    console.error("Error in createColor:", error);
    return null;
  }
};

// Update a color option
export const updateColor = async (colorId: string, colorData: Partial<ColorFormState>): Promise<ColorOption | null> => {
  try {
    const { data, error } = await supabase
      .from('color_options')
      .update({
        name: colorData.name,
        hex_code: colorData.hex_code,
        image_url: colorData.image_url,
        is_limited: colorData.is_limited
      })
      .eq('id', colorId)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating color option:", error);
      return null;
    }
    
    return data as unknown as ColorOption;
  } catch (error) {
    console.error("Error in updateColor:", error);
    return null;
  }
};

// Delete a color option
export const deleteColor = async (colorId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('color_options')
      .delete()
      .eq('id', colorId);
      
    if (error) {
      console.error("Error deleting color option:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in deleteColor:", error);
    return false;
  }
};
