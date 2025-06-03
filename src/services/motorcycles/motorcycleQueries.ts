
import { supabase } from "@/integrations/supabase/client";

// Simplified query that focuses on essential data and handles missing components gracefully
export const MOTORCYCLE_SELECT_QUERY = `
  *,
  brands!motorcycle_models_brand_id_fkey(
    id,
    name,
    slug
  ),
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
        fuel_system
      ),
      brake_systems:brake_system_id(
        id,
        type,
        brake_type_front,
        brake_type_rear,
        has_traction_control
      ),
      frames:frame_id(
        id,
        type,
        material
      ),
      suspensions:suspension_id(
        id,
        front_type,
        rear_type,
        brand
      ),
      wheels:wheel_id(
        id,
        type,
        front_size,
        rear_size,
        rim_material
      )
    ),
    color_options(
      id,
      name,
      hex_code
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
      .maybeSingle();

    if (error) {
      console.error("Database error fetching motorcycle by slug:", error);
      throw new Error(`Failed to fetch motorcycle: ${error.message}`);
    }

    if (!data) {
      console.log("No motorcycle found with slug:", slug);
      return null;
    }

    console.log("Successfully fetched motorcycle data for slug:", slug);
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
      throw new Error(`Failed to fetch motorcycles: ${error.message}`);
    }

    console.log("Successfully fetched motorcycles, count:", data?.length || 0);
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
      .maybeSingle();

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
