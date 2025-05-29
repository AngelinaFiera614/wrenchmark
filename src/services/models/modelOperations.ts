
import { supabase } from "@/integrations/supabase/client";
import { ModelYear, Configuration } from "@/types/motorcycle";

export const createModelYear = async (
  modelId: string, 
  year: number,
  changes?: string,
  image_url?: string,
  msrp_usd?: number
): Promise<ModelYear | null> => {
  try {
    const { data, error } = await supabase
      .from('model_years')
      .insert({
        motorcycle_id: modelId,
        year,
        changes,
        image_url,
        msrp_usd
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error creating model year:", error);
      return null;
    }
    
    return data as ModelYear;
  } catch (error) {
    console.error("Error in createModelYear:", error);
    return null;
  }
};

export const createConfiguration = async (
  modelYearId: string,
  name: string,
  engineId: string,
  brakeSystemId: string,
  frameId: string,
  suspensionId: string,
  wheelId: string,
  details: {
    seat_height_mm?: number,
    weight_kg?: number,
    wheelbase_mm?: number,
    fuel_capacity_l?: number,
    ground_clearance_mm?: number,
    image_url?: string,
    is_default?: boolean
  }
): Promise<Configuration | null> => {
  try {
    const { data, error } = await supabase
      .from('model_configurations')
      .insert({
        model_year_id: modelYearId,
        name,
        engine_id: engineId,
        brake_system_id: brakeSystemId,
        frame_id: frameId,
        suspension_id: suspensionId,
        wheel_id: wheelId,
        seat_height_mm: details.seat_height_mm,
        weight_kg: details.weight_kg,
        wheelbase_mm: details.wheelbase_mm,
        fuel_capacity_l: details.fuel_capacity_l,
        ground_clearance_mm: details.ground_clearance_mm,
        image_url: details.image_url,
        is_default: details.is_default || false
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error creating configuration:", error);
      return null;
    }
    
    return data as Configuration;
  } catch (error) {
    console.error("Error in createConfiguration:", error);
    return null;
  }
};
