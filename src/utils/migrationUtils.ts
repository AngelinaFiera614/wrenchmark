
import { supabase } from "@/integrations/supabase/client";
import { Motorcycle } from "@/types";

export const createEngineFromMotorcycle = async (
  motorcycle: Motorcycle
): Promise<string | null> => {
  try {
    const engineName = motorcycle.engine || `${motorcycle.engine_size || 0}cc Engine`;
    const displacement = motorcycle.engine_size || 0;
    const power = motorcycle.horsepower || 0;
    const torque = motorcycle.torque_nm || 0;
    
    let engineType = "";
    if (motorcycle.engine) {
      if (motorcycle.engine.includes("V-Twin")) engineType = "V-Twin";
      else if (motorcycle.engine.includes("Twin")) engineType = "Parallel Twin";
      else if (motorcycle.engine.includes("Single")) engineType = "Single";
      else if (motorcycle.engine.includes("V4")) engineType = "V4";
      else if (motorcycle.engine.includes("Inline-4")) engineType = "Inline-4";
      else if (motorcycle.engine.includes("Inline 4")) engineType = "Inline-4";
      else if (motorcycle.engine.includes("Triple")) engineType = "Inline-3";
    }
    
    const { data, error } = await supabase
      .from('engines')
      .insert({
        name: engineName,
        displacement_cc: displacement,
        power_hp: power,
        torque_nm: torque,
        engine_type: engineType,
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error creating engine:", error);
      return null;
    }
    
    return data.id;
  } catch (error) {
    console.error("Error in createEngineFromMotorcycle:", error);
    return null;
  }
};

export const createBrakeSystemFromMotorcycle = async (
  motorcycle: Motorcycle
): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('brake_systems')
      .insert({
        type: motorcycle.abs ? "ABS Brakes" : "Standard Brakes",
        has_traction_control: false,
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error creating brake system:", error);
      return null;
    }
    
    return data.id;
  } catch (error) {
    console.error("Error in createBrakeSystemFromMotorcycle:", error);
    return null;
  }
};

export const migrateMotorcycle = async (
  motorcycle: Motorcycle
): Promise<boolean> => {
  try {
    // Use the database function instead of manual migration
    const { data, error } = await supabase.rpc('migrate_legacy_motorcycle', {
      legacy_id: motorcycle.id
    });

    if (error) {
      console.error("Error migrating motorcycle:", error);
      return false;
    }
    
    return data === true;
  } catch (error) {
    console.error("Error in migrateMotorcycle:", error);
    return false;
  }
};
