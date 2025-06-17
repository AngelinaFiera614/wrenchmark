import { supabase } from "@/integrations/supabase/client";
import { MotorcycleModel } from "@/types";

export const fetchMotorcycleModels = async (): Promise<MotorcycleModel[]> => {
  try {
    const { data, error } = await supabase
      .from('motorcycle_models')
      .select(`
        *,
        brands!motorcycle_models_brand_id_fkey(
          id,
          name,
          slug
        )
      `)
      .eq('is_draft', false)
      .order('name');

    if (error) throw error;

    if (!data) return [];

    return data.map(model => ({
      id: model.id,
      brand_id: model.brand_id,
      name: model.name,
      type: model.type,
      base_description: model.base_description,
      production_start_year: model.production_start_year,
      production_end_year: model.production_end_year,
      production_status: model.production_status,
      default_image_url: model.default_image_url,
      slug: model.slug,
      is_draft: model.is_draft,
      ignore_autofill: model.ignore_autofill || false,
      created_at: model.created_at,
      updated_at: model.updated_at,
      // Properly handle brand relationship
      brands: Array.isArray(model.brands) && model.brands.length > 0 
        ? { name: model.brands[0].name }
        : { name: "Unknown Brand" },
      brand: Array.isArray(model.brands) && model.brands.length > 0
        ? { name: model.brands[0].name }
        : { name: "Unknown Brand" },
      // Other optional fields
      summary: model.summary,
      category: model.category,
      status: model.status,
      engine_size: model.engine_size,
      horsepower: model.horsepower,
      torque_nm: model.torque_nm,
      top_speed_kph: model.top_speed_kph,
      has_abs: model.has_abs,
      weight_kg: model.weight_kg,
      seat_height_mm: model.seat_height_mm,
      wheelbase_mm: model.wheelbase_mm,
      ground_clearance_mm: model.ground_clearance_mm,
      fuel_capacity_l: model.fuel_capacity_l,
      difficulty_level: model.difficulty_level
    })) as MotorcycleModel[];
  } catch (error) {
    console.error('Error fetching motorcycle models:', error);
    return [];
  }
};

// Add alias for backward compatibility
export const fetchAllMotorcycleModels = fetchMotorcycleModels;

export const fetchMotorcycleModelById = async (id: string): Promise<MotorcycleModel | null> => {
  try {
    const { data, error } = await supabase
      .from('motorcycle_models')
      .select(`
        *,
        brands!motorcycle_models_brand_id_fkey(
          id,
          name,
          slug
        ),
        model_years(
          *
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      brand_id: data.brand_id,
      name: data.name,
      type: data.type,
      base_description: data.base_description,
      production_start_year: data.production_start_year,
      production_end_year: data.production_end_year,
      production_status: data.production_status,
      default_image_url: data.default_image_url,
      slug: data.slug,
      is_draft: data.is_draft,
      ignore_autofill: data.ignore_autofill || false,
      created_at: data.created_at,
      updated_at: data.updated_at,
      // Properly handle brand relationship
      brands: Array.isArray(data.brands) && data.brands.length > 0 
        ? { name: data.brands[0].name }
        : { name: "Unknown Brand" },
      brand: Array.isArray(data.brands) && data.brands.length > 0
        ? { name: data.brands[0].name }
        : { name: "Unknown Brand" },
      years: data.model_years || [],
      // Other optional fields
      summary: data.summary,
      category: data.category,
      status: data.status,
      engine_size: data.engine_size,
      horsepower: data.horsepower,
      torque_nm: data.torque_nm,
      top_speed_kph: data.top_speed_kph,
      has_abs: data.has_abs,
      weight_kg: data.weight_kg,
      seat_height_mm: data.seat_height_mm,
      wheelbase_mm: data.wheelbase_mm,
      ground_clearance_mm: data.ground_clearance_mm,
      fuel_capacity_l: data.fuel_capacity_l,
      difficulty_level: data.difficulty_level
    } as MotorcycleModel;
  } catch (error) {
    console.error('Error fetching motorcycle model by ID:', error);
    return null;
  }
};

export const fetchMotorcycleModelBySlug = async (slug: string): Promise<MotorcycleModel | null> => {
  try {
    const { data, error } = await supabase
      .from('motorcycle_models')
      .select(`
        *,
        brands!motorcycle_models_brand_id_fkey(
          id,
          name,
          slug
        ),
        model_years(
          *
        )
      `)
      .eq('slug', slug)
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      brand_id: data.brand_id,
      name: data.name,
      type: data.type,
      base_description: data.base_description,
      production_start_year: data.production_start_year,
      production_end_year: data.production_end_year,
      production_status: data.production_status,
      default_image_url: data.default_image_url,
      slug: data.slug,
      is_draft: data.is_draft,
      ignore_autofill: data.ignore_autofill || false,
      created_at: data.created_at,
      updated_at: data.updated_at,
      brands: Array.isArray(data.brands) && data.brands.length > 0 
        ? { name: data.brands[0].name }
        : { name: "Unknown Brand" },
      brand: Array.isArray(data.brands) && data.brands.length > 0
        ? { name: data.brands[0].name }
        : { name: "Unknown Brand" },
      years: data.model_years || [],
      summary: data.summary,
      category: data.category,
      status: data.status,
      engine_size: data.engine_size,
      horsepower: data.horsepower,
      torque_nm: data.torque_nm,
      top_speed_kph: data.top_speed_kph,
      has_abs: data.has_abs,
      weight_kg: data.weight_kg,
      seat_height_mm: data.seat_height_mm,
      wheelbase_mm: data.wheelbase_mm,
      ground_clearance_mm: data.ground_clearance_mm,
      fuel_capacity_l: data.fuel_capacity_l,
      difficulty_level: data.difficulty_level
    } as MotorcycleModel;
  } catch (error) {
    console.error('Error fetching motorcycle model by slug:', error);
    return null;
  }
};

export const searchMotorcycleModels = async (query: string): Promise<MotorcycleModel[]> => {
  try {
    const { data, error } = await supabase
      .from('motorcycle_models')
      .select(`
        *,
        brands!motorcycle_models_brand_id_fkey(
          id,
          name,
          slug
        )
      `)
      .or(`name.ilike.%${query}%,base_description.ilike.%${query}%`)
      .eq('is_draft', false)
      .order('name')
      .limit(20);

    if (error) throw error;
    if (!data) return [];

    return data.map(model => ({
      id: model.id,
      brand_id: model.brand_id,
      name: model.name,
      type: model.type,
      base_description: model.base_description,
      production_start_year: model.production_start_year,
      production_end_year: model.production_end_year,
      production_status: model.production_status,
      default_image_url: model.default_image_url,
      slug: model.slug,
      is_draft: model.is_draft,
      ignore_autofill: model.ignore_autofill || false,
      created_at: model.created_at,
      updated_at: model.updated_at,
      brands: Array.isArray(model.brands) && model.brands.length > 0 
        ? { name: model.brands[0].name }
        : { name: "Unknown Brand" },
      brand: Array.isArray(model.brands) && model.brands.length > 0
        ? { name: model.brands[0].name }
        : { name: "Unknown Brand" },
      summary: model.summary,
      category: model.category,
      status: model.status,
      engine_size: model.engine_size,
      horsepower: model.horsepower,
      torque_nm: model.torque_nm,
      top_speed_kph: model.top_speed_kph,
      has_abs: model.has_abs,
      weight_kg: model.weight_kg,
      seat_height_mm: model.seat_height_mm,
      wheelbase_mm: model.wheelbase_mm,
      ground_clearance_mm: model.ground_clearance_mm,
      fuel_capacity_l: model.fuel_capacity_l,
      difficulty_level: model.difficulty_level
    })) as MotorcycleModel[];
  } catch (error) {
    console.error('Error searching motorcycle models:', error);
    return [];
  }
};

export const deleteMotorcycleModelCascade = async (modelId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('delete_motorcycle_model_cascade', {
      model_id_param: modelId
    });

    if (error) {
      console.error('Error deleting motorcycle model:', error);
      return false;
    }

    return data === true;
  } catch (error) {
    console.error('Error in deleteMotorcycleModelCascade:', error);
    return false;
  }
};

export const getMotorcycleModelRelations = async (modelId: string) => {
  try {
    const { data, error } = await supabase.rpc('get_motorcycle_model_relations', {
      model_id_param: modelId
    });

    if (error) {
      console.error('Error getting motorcycle model relations:', error);
      return {};
    }

    return data || {};
  } catch (error) {
    console.error('Error in getMotorcycleModelRelations:', error);
    return {};
  }
};

export const fetchModelsForComparison = async (): Promise<MotorcycleModel[]> => {
  return fetchMotorcycleModels();
};
