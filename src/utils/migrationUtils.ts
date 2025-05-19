
import { supabase } from "@/integrations/supabase/client";
import { Motorcycle } from "@/types";

// Helper function to create an engine from motorcycle data
export const createEngineFromMotorcycle = async (
  motorcycle: Motorcycle
): Promise<string | null> => {
  try {
    // Extract engine information
    const engineName = motorcycle.engine || `${motorcycle.engine_cc || motorcycle.engine_size}cc Engine`;
    const displacement = motorcycle.engine_cc || motorcycle.engine_size || 0;
    const power = motorcycle.horsepower_hp || motorcycle.horsepower || 0;
    const torque = motorcycle.torque_nm || 0;
    
    // Extract engine type if available (simple parsing logic)
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
    
    // Insert the engine into the database
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

// Helper function to create brake system from motorcycle data
export const createBrakeSystemFromMotorcycle = async (
  motorcycle: Motorcycle
): Promise<string | null> => {
  try {
    // Create a brake system based on ABS status
    const { data, error } = await supabase
      .from('brake_systems')
      .insert({
        type: motorcycle.abs ? "ABS Brakes" : "Standard Brakes",
        has_traction_control: false, // Default value as we don't have this info
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

// Helper function to create a motorcycle model from the old schema
export const migrateMotorcycle = async (
  motorcycle: Motorcycle
): Promise<boolean> => {
  try {
    // 1. Create or find the motorcycle_model entry
    const { data: modelData, error: modelError } = await supabase
      .from('motorcycle_models')
      .insert({
        brand_id: motorcycle.brand_id,
        name: motorcycle.model,
        type: motorcycle.category || "Standard",
        base_description: motorcycle.summary,
        production_start_year: motorcycle.year,
        production_status: motorcycle.status || "active",
        default_image_url: motorcycle.image_url,
        slug: motorcycle.slug,
      })
      .select()
      .single();
    
    if (modelError) {
      console.error("Error creating motorcycle model:", modelError);
      return false;
    }
    
    // 2. Create the model_year entry
    const { data: yearData, error: yearError } = await supabase
      .from('model_years')
      .insert({
        motorcycle_id: modelData.id,
        year: motorcycle.year,
      })
      .select()
      .single();
    
    if (yearError) {
      console.error("Error creating model year:", yearError);
      return false;
    }
    
    // 3. Create component entries
    const engineId = await createEngineFromMotorcycle(motorcycle);
    const brakeSystemId = await createBrakeSystemFromMotorcycle(motorcycle);
    
    // 4. Create the model configuration
    const { data: configData, error: configError } = await supabase
      .from('model_configurations')
      .insert({
        model_year_id: yearData.id,
        engine_id: engineId,
        brake_system_id: brakeSystemId,
        seat_height_mm: motorcycle.seat_height_mm,
        weight_kg: motorcycle.weight_kg,
        wheelbase_mm: motorcycle.wheelbase_mm,
        fuel_capacity_l: motorcycle.fuel_capacity_l,
        ground_clearance_mm: motorcycle.ground_clearance_mm,
        image_url: motorcycle.image_url,
        is_default: true,
        name: "Standard",
      })
      .select()
      .single();
    
    if (configError) {
      console.error("Error creating model configuration:", configError);
      return false;
    }
    
    // 5. Update the migration status in the original motorcycle entry
    const { error: updateError } = await supabase
      .from('motorcycles')
      .update({ migration_status: "migrated" })
      .eq('id', motorcycle.id);
    
    if (updateError) {
      console.error("Error updating motorcycle migration status:", updateError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in migrateMotorcycle:", error);
    return false;
  }
};
