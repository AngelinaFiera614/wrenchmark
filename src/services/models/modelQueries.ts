
import { supabase } from "@/integrations/supabase/client";

// Use the same query pattern as the main motorcycles page for consistency
const MOTORCYCLE_MODEL_SELECT_QUERY = `
  id,
  brand_id,
  name,
  type,
  base_description,
  production_start_year,
  production_end_year,
  production_status,
  default_image_url,
  slug,
  engine_size,
  horsepower,
  torque_nm,
  weight_kg,
  seat_height_mm,
  wheelbase_mm,
  ground_clearance_mm,
  fuel_capacity_l,
  top_speed_kph,
  has_abs,
  difficulty_level,
  status,
  category,
  summary,
  created_at,
  updated_at,
  brands(
    id,
    name,
    slug
  )
`;

const DETAILED_MODEL_SELECT_QUERY = `
  *,
  brand:brand_id(id, name, country, logo_url),
  years:model_years(
    *,
    configurations:model_configurations(
      *,
      engine:engine_id(id, name, displacement_cc, power_hp, torque_nm, engine_type),
      brakes:brake_system_id(id, type, has_traction_control, brake_type_front, brake_type_rear),
      frame:frame_id(id, type, material),
      suspension:suspension_id(id, front_type, rear_type, adjustability, brand),
      wheels:wheel_id(id, type, front_size, rear_size),
      colors:colors(*)
    )
  )
`;

export const fetchAllMotorcycleModels = async () => {
  try {
    console.log("Fetching all motorcycle models from motorcycle_models table...");
    
    const { data, error } = await supabase
      .from('motorcycle_models')
      .select(MOTORCYCLE_MODEL_SELECT_QUERY)
      .order('name', { ascending: true })
      .order('production_start_year', { ascending: true });
      
    if (error) {
      console.error("Error fetching motorcycle models:", error);
      console.error("Error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }
    
    console.log(`Successfully fetched ${data?.length || 0} motorcycle models for admin`);
    return data || [];
  } catch (error) {
    console.error("Error in fetchAllMotorcycleModels:", error);
    throw error;
  }
};

export const fetchMotorcycleModelBySlug = async (slug: string) => {
  try {
    const { data, error } = await supabase
      .from('motorcycle_models')
      .select(DETAILED_MODEL_SELECT_QUERY)
      .eq('slug', slug)
      .single();
      
    if (error) {
      console.error("Error fetching motorcycle model:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in fetchMotorcycleModelBySlug:", error);
    return null;
  }
};

export const fetchModelsForComparison = async (slugs: string[]) => {
  if (!slugs.length) return [];
  
  try {
    const { data, error } = await supabase
      .from('motorcycle_models')
      .select(DETAILED_MODEL_SELECT_QUERY)
      .in('slug', slugs);
      
    if (error) {
      console.error("Error fetching models for comparison:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in fetchModelsForComparison:", error);
    return [];
  }
};
