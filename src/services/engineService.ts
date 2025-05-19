
import { supabase } from "@/integrations/supabase/client";
import { EngineOption } from "@/types/components";

// Fetch all engines
export const fetchEngines = async (): Promise<EngineOption[]> => {
  try {
    const { data, error } = await supabase
      .from('engines')
      .select('*')
      .order('name');
      
    if (error) {
      console.error("Error fetching engines:", error);
      return [];
    }
    
    return data.map(engine => ({
      id: engine.id,
      name: engine.name,
      displacement_cc: engine.displacement_cc,
      power_hp: engine.power_hp,
      torque_nm: engine.torque_nm,
      engine_type: engine.engine_type
    }));
  } catch (error) {
    console.error("Error in fetchEngines:", error);
    return [];
  }
};

// Create a new engine
export const createEngine = async (engineData: Omit<EngineOption, 'id'>): Promise<EngineOption | null> => {
  try {
    const { data, error } = await supabase
      .from('engines')
      .insert({
        name: engineData.name,
        displacement_cc: engineData.displacement_cc,
        power_hp: engineData.power_hp,
        torque_nm: engineData.torque_nm,
        engine_type: engineData.engine_type
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error creating engine:", error);
      return null;
    }
    
    return {
      id: data.id,
      name: data.name,
      displacement_cc: data.displacement_cc,
      power_hp: data.power_hp,
      torque_nm: data.torque_nm,
      engine_type: data.engine_type
    };
  } catch (error) {
    console.error("Error in createEngine:", error);
    return null;
  }
};
