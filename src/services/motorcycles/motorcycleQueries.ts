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
      ),
      color_variants:color_id(
        id,
        name,
        color_code,
        hex_code,
        description
      )
    )
  )
`;

export const queryMotorcycleBySlug = async (slug: string) => {
  console.log("=== queryMotorcycleBySlug ===");
  console.log("Fetching motorcycle with slug:", slug);

  const { data, error } = await supabase
    .from('motorcycle_models')
    .select(MOTORCYCLE_SELECT_QUERY)
    .eq('slug', slug)
    .eq('is_draft', false)
    .single();

  if (error) {
    console.error("Error fetching motorcycle by slug:", error);
    throw error;
  }

  console.log("Raw motorcycle data for slug:", data);
  console.log("Years data:", data?.years);
  console.log("Configurations data:", data?.years?.[0]?.configurations);
  console.log("Engine data:", data?.years?.[0]?.configurations?.[0]?.engines);
  
  return data;
};

export const queryAllMotorcycles = async () => {
  console.log("=== queryAllMotorcycles ===");
  
  const { data, error } = await supabase
    .from('motorcycle_models')
    .select(MOTORCYCLE_SELECT_QUERY)
    .eq('is_draft', false)
    .order('name');

  if (error) {
    console.error("Error fetching all motorcycles:", error);
    throw error;
  }

  console.log("Raw motorcycles data count:", data?.length || 0);
  return data || [];
};

export const queryMotorcycleByDetails = async (make: string, model: string, year: number) => {
  const { data, error } = await supabase
    .from('motorcycle_models')
    .select(MOTORCYCLE_SELECT_QUERY)
    .ilike('name', `%${model}%`)
    .eq('brands.name', make)
    .gte('production_start_year', year - 2)
    .lte('production_end_year', year + 2)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
};
