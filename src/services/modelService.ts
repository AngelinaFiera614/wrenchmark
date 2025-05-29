import { supabase } from "@/integrations/supabase/client";
import { MotorcycleModel, ModelYear, Configuration } from "@/types/motorcycle";

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

// Fetch all motorcycle models
export const getAllMotorcycleModels = async (): Promise<MotorcycleModel[]> => {
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
    return (data || []) as unknown as MotorcycleModel[];
  } catch (error) {
    console.error("Error in getAllMotorcycleModels:", error);
    throw error;
  }
};

// Get a specific motorcycle model by slug with years and configurations
export const getMotorcycleModelBySlug = async (slug: string): Promise<MotorcycleModel | null> => {
  try {
    const { data, error } = await supabase
      .from('motorcycle_models')
      .select(`
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
      `)
      .eq('slug', slug)
      .single();
      
    if (error) {
      console.error("Error fetching motorcycle model:", error);
      return null;
    }
    
    // Use a more specific type assertion to ensure compatibility
    return data as unknown as MotorcycleModel;
  } catch (error) {
    console.error("Error in getMotorcycleModelBySlug:", error);
    return null;
  }
};

// Create a new model year
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

// Create a new configuration for a model year
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

// Fetch models for comparison (could be multiple)
export const getModelsForComparison = async (slugs: string[]): Promise<MotorcycleModel[]> => {
  if (!slugs.length) return [];
  
  try {
    const { data, error } = await supabase
      .from('motorcycle_models')
      .select(`
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
            wheels:wheel_id(id, type, front_size, rear_size)
          )
        )
      `)
      .in('slug', slugs);
      
    if (error) {
      console.error("Error fetching models for comparison:", error);
      return [];
    }
    
    // Use a more specific type assertion to ensure compatibility
    return (data || []) as unknown as MotorcycleModel[];
  } catch (error) {
    console.error("Error in getModelsForComparison:", error);
    return [];
  }
};
