
import { supabase } from "@/integrations/supabase/client";

export const MOTORCYCLE_SELECT_QUERY = `
  *,
  brands!motorcycle_models_brand_id_fkey(*),
  years:model_years(
    *,
    configurations:model_configurations(
      *,
      engines:engine_id(
        id,
        name,
        displacement_cc,
        power_hp,
        torque_nm,
        engine_type,
        power_rpm,
        torque_rpm,
        cylinder_count,
        cooling,
        fuel_system,
        compression_ratio,
        bore_mm,
        stroke_mm,
        valves_per_cylinder,
        valve_count
      ),
      brake_systems:brake_system_id(
        id,
        type,
        brake_type_front,
        brake_type_rear,
        has_traction_control,
        front_disc_size_mm,
        rear_disc_size_mm,
        brake_brand,
        caliper_type
      ),
      frames:frame_id(
        id,
        type,
        material,
        construction_method,
        rake_degrees,
        trail_mm
      ),
      suspensions:suspension_id(
        id,
        front_type,
        rear_type,
        brand,
        adjustability,
        front_brand,
        rear_brand,
        front_travel_mm,
        rear_travel_mm
      ),
      wheels:wheel_id(
        id,
        type,
        front_size,
        rear_size,
        rim_material,
        front_tire_size,
        rear_tire_size,
        spoke_count_front,
        spoke_count_rear
      )
    ),
    color_options(
      id,
      name,
      hex_code,
      image_url,
      is_limited
    )
  )
`;

export const queryMotorcycleBySlug = async (slug: string) => {
  console.log("=== queryMotorcycleBySlug ===");
  console.log("Fetching motorcycle with slug:", slug);

  try {
    const { data, error } = await supabase
      .from('motorcycle_models')
      .select(MOTORCYCLE_SELECT_QUERY)
      .eq('slug', slug)
      .eq('is_draft', false)
      .single();

    if (error) {
      console.error("Database error fetching motorcycle by slug:", error);
      console.error("Error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw new Error(`Failed to fetch motorcycle: ${error.message}`);
    }

    if (!data) {
      console.log("No motorcycle found with slug:", slug);
      return null;
    }

    console.log("Raw motorcycle data for slug:", data);
    console.log("Years data:", data?.years);
    console.log("Configurations data:", data?.years?.[0]?.configurations);
    console.log("Engine data:", data?.years?.[0]?.configurations?.[0]?.engines);
    
    return data;
  } catch (error) {
    console.error("Error in queryMotorcycleBySlug:", error);
    throw error;
  }
};

export const queryAllMotorcycles = async () => {
  console.log("=== queryAllMotorcycles ===");
  
  try {
    const { data, error } = await supabase
      .from('motorcycle_models')
      .select(MOTORCYCLE_SELECT_QUERY)
      .eq('is_draft', false)
      .order('name');

    if (error) {
      console.error("Database error fetching all motorcycles:", error);
      console.error("Error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw new Error(`Failed to fetch motorcycles: ${error.message}`);
    }

    console.log("Raw motorcycles data count:", data?.length || 0);
    return data || [];
  } catch (error) {
    console.error("Error in queryAllMotorcycles:", error);
    throw error;
  }
};

export const queryMotorcycleByDetails = async (make: string, model: string, year: number) => {
  try {
    const { data, error } = await supabase
      .from('motorcycle_models')
      .select(MOTORCYCLE_SELECT_QUERY)
      .ilike('name', `%${model}%`)
      .eq('brands.name', make)
      .gte('production_start_year', year - 2)
      .lte('production_end_year', year + 2)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error("Database error in queryMotorcycleByDetails:", error);
      throw new Error(`Failed to fetch motorcycle by details: ${error.message}`);
    }

    return data || null;
  } catch (error) {
    console.error("Error in queryMotorcycleByDetails:", error);
    return null;
  }
};
