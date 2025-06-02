
import { supabase } from "@/integrations/supabase/client";
import { Motorcycle } from "@/types";

export const getMotorcycleBySlug = async (slug: string): Promise<Motorcycle | null> => {
  console.log("=== getMotorcycleBySlug DEBUG ===");
  console.log("Fetching motorcycle with slug:", slug);
  
  try {
    const { data, error } = await supabase
      .from('motorcycle_models')
      .select(`
        *,
        brand:brands(*),
        years:model_years(
          *,
          configurations:model_configurations(
            *,
            engines(*),
            brake_systems(*),
            frames(*),
            suspensions(*),
            wheels(*)
          )
        )
      `)
      .eq('slug', slug)
      .eq('is_draft', false)
      .single();
    
    if (error) {
      console.error("Error fetching motorcycle:", error);
      throw error;
    }
    
    if (!data) {
      console.log("No motorcycle found with slug:", slug);
      return null;
    }
    
    console.log("Raw motorcycle data:", data);
    
    // Transform the data to match our Motorcycle interface
    const motorcycle: Motorcycle = {
      id: data.id,
      make: data.brand?.name || 'Unknown',
      model: data.name,
      year: data.years?.[0]?.year || new Date().getFullYear(),
      slug: data.slug,
      brand_id: data.brand_id,
      type: data.type,
      category: data.category,
      engine_size: data.engine_size,
      horsepower: data.horsepower,
      weight_kg: data.weight_kg,
      seat_height_mm: data.seat_height_mm,
      top_speed_kph: data.top_speed_kph,
      fuel_capacity_l: data.fuel_capacity_l,
      wheelbase_mm: data.wheelbase_mm,
      ground_clearance_mm: data.ground_clearance_mm,
      torque_nm: data.torque_nm,
      has_abs: data.has_abs,
      default_image_url: data.default_image_url,
      summary: data.summary,
      base_description: data.base_description,
      production_start_year: data.production_start_year,
      production_end_year: data.production_end_year,
      difficulty_level: data.difficulty_level,
      is_entry_level: data.is_entry_level,
      // Add the raw data for configurations
      years: data.years || [],
      configurations: data.years?.[0]?.configurations || []
    };
    
    console.log("Final motorcycle object:", motorcycle);
    console.log("=== END getMotorcycleBySlug DEBUG ===");
    
    return motorcycle;
  } catch (error) {
    console.error("Error in getMotorcycleBySlug:", error);
    throw error;
  }
};

export const getAllMotorcycles = async (): Promise<Motorcycle[]> => {
  try {
    const { data, error } = await supabase
      .from('motorcycle_models')
      .select(`
        *,
        brand:brands(*)
      `)
      .eq('is_draft', false)
      .order('name');
      
    if (error) {
      console.error("Error fetching motorcycles:", error);
      throw error;
    }
    
    return data.map(item => ({
      id: item.id,
      make: item.brand?.name || 'Unknown',
      model: item.name,
      year: item.production_start_year || new Date().getFullYear(),
      slug: item.slug,
      brand_id: item.brand_id,
      type: item.type,
      category: item.category,
      engine_size: item.engine_size,
      horsepower: item.horsepower,
      weight_kg: item.weight_kg,
      seat_height_mm: item.seat_height_mm,
      top_speed_kph: item.top_speed_kph,
      fuel_capacity_l: item.fuel_capacity_l,
      wheelbase_mm: item.wheelbase_mm,
      ground_clearance_mm: item.ground_clearance_mm,
      torque_nm: item.torque_nm,
      has_abs: item.has_abs,
      default_image_url: item.default_image_url,
      summary: item.summary,
      base_description: item.base_description,
      production_start_year: item.production_start_year,
      production_end_year: item.production_end_year,
      difficulty_level: item.difficulty_level,
      is_entry_level: item.is_entry_level
    }));
  } catch (error) {
    console.error("Error in getAllMotorcycles:", error);
    throw error;
  }
};

export const findMotorcycleByDetails = async (make: string, model: string, year: number): Promise<Motorcycle | null> => {
  try {
    const { data, error } = await supabase
      .from('motorcycle_models')
      .select(`
        *,
        brand:brands(*)
      `)
      .ilike('name', `%${model}%`)
      .eq('brand.name', make)
      .gte('production_start_year', year - 2)
      .lte('production_end_year', year + 2)
      .single();
      
    if (error || !data) {
      return null;
    }
    
    return {
      id: data.id,
      make: data.brand?.name || make,
      model: data.name,
      year,
      slug: data.slug,
      brand_id: data.brand_id,
      type: data.type,
      category: data.category,
      engine_size: data.engine_size,
      horsepower: data.horsepower,
      weight_kg: data.weight_kg,
      seat_height_mm: data.seat_height_mm,
      top_speed_kph: data.top_speed_kph,
      fuel_capacity_l: data.fuel_capacity_l,
      wheelbase_mm: data.wheelbase_mm,
      ground_clearance_mm: data.ground_clearance_mm,
      torque_nm: data.torque_nm,
      has_abs: data.has_abs,
      default_image_url: data.default_image_url,
      summary: data.summary,
      base_description: data.base_description,
      production_start_year: data.production_start_year,
      production_end_year: data.production_end_year,
      difficulty_level: data.difficulty_level,
      is_entry_level: data.is_entry_level
    };
  } catch (error) {
    console.error("Error in findMotorcycleByDetails:", error);
    return null;
  }
};

export const createPlaceholderMotorcycle = async (params: {
  make: string;
  model: string;
  year: number;
}): Promise<Motorcycle> => {
  try {
    // First, find or create the brand
    let brand;
    const { data: existingBrand } = await supabase
      .from('brands')
      .select('*')
      .ilike('name', params.make)
      .single();
      
    if (existingBrand) {
      brand = existingBrand;
    } else {
      const { data: newBrand, error: brandError } = await supabase
        .from('brands')
        .insert({
          name: params.make,
          slug: params.make.toLowerCase().replace(/\s+/g, '-'),
          status: 'active'
        })
        .select()
        .single();
        
      if (brandError) throw brandError;
      brand = newBrand;
    }
    
    // Create the motorcycle model
    const { data: motorcycle, error } = await supabase
      .from('motorcycle_models')
      .insert({
        name: params.model,
        slug: `${params.make}-${params.model}`.toLowerCase().replace(/\s+/g, '-'),
        brand_id: brand.id,
        type: 'unknown',
        production_start_year: params.year,
        production_end_year: params.year,
        is_draft: true
      })
      .select()
      .single();
      
    if (error) throw error;
    
    return {
      id: motorcycle.id,
      make: params.make,
      model: params.model,
      year: params.year,
      slug: motorcycle.slug,
      brand_id: motorcycle.brand_id,
      type: motorcycle.type,
      category: motorcycle.category,
      engine_size: motorcycle.engine_size,
      horsepower: motorcycle.horsepower,
      weight_kg: motorcycle.weight_kg,
      seat_height_mm: motorcycle.seat_height_mm,
      top_speed_kph: motorcycle.top_speed_kph,
      fuel_capacity_l: motorcycle.fuel_capacity_l,
      wheelbase_mm: motorcycle.wheelbase_mm,
      ground_clearance_mm: motorcycle.ground_clearance_mm,
      torque_nm: motorcycle.torque_nm,
      has_abs: motorcycle.has_abs,
      default_image_url: motorcycle.default_image_url,
      summary: motorcycle.summary,
      base_description: motorcycle.base_description,
      production_start_year: motorcycle.production_start_year,
      production_end_year: motorcycle.production_end_year,
      difficulty_level: motorcycle.difficulty_level,
      is_entry_level: motorcycle.is_entry_level
    };
  } catch (error) {
    console.error("Error in createPlaceholderMotorcycle:", error);
    throw error;
  }
};

export const publishMotorcycle = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('motorcycle_models')
      .update({ is_draft: false })
      .eq('id', id);
      
    return !error;
  } catch (error) {
    console.error("Error publishing motorcycle:", error);
    return false;
  }
};

export const unpublishMotorcycle = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('motorcycle_models')
      .update({ is_draft: true })
      .eq('id', id);
      
    return !error;
  } catch (error) {
    console.error("Error unpublishing motorcycle:", error);
    return false;
  }
};
