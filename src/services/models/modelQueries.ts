
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
  is_draft,
  created_at,
  updated_at,
  brands!motorcycle_models_brand_id_fkey(
    id,
    name,
    slug
  )
`;

const DETAILED_MODEL_SELECT_QUERY = `
  *,
  brands!motorcycle_models_brand_id_fkey(
    id,
    name,
    slug,
    logo_url,
    country
  ),
  motorcycle_model_tags!motorcycle_model_tags_motorcycle_id_fkey(
    motorcycle_tags!motorcycle_model_tags_tag_id_fkey(
      id,
      name,
      category,
      description,
      color_hex,
      icon
    )
  )
`;

export const fetchAllMotorcycleModels = async () => {
  try {
    console.log("Fetching all motorcycle models from motorcycle_models table...");
    
    const { data, error } = await supabase
      .from('motorcycle_models')
      .select(MOTORCYCLE_MODEL_SELECT_QUERY)
      .order('is_draft', { ascending: false })
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
    console.log("Sample admin motorcycle data:", data?.[0]);
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
      .maybeSingle();
      
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
