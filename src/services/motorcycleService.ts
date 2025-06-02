
import { supabase } from "@/integrations/supabase/client";
import { Motorcycle } from "@/types";
import { 
  queryMotorcycleBySlug, 
  queryAllMotorcycles, 
  queryMotorcycleByDetails 
} from "./motorcycles/motorcycleQueries";
import { 
  transformMotorcycleData, 
  createPlaceholderMotorcycleData 
} from "./motorcycles/motorcycleTransforms";

export const getMotorcycleBySlug = async (slug: string): Promise<Motorcycle | null> => {
  console.log("=== getMotorcycleBySlug ===");
  console.log("Fetching motorcycle with slug:", slug);
  
  try {
    const data = await queryMotorcycleBySlug(slug);
    
    if (!data) {
      console.log("No motorcycle found with slug:", slug);
      return null;
    }
    
    const motorcycle = transformMotorcycleData(data);
    console.log("Successfully transformed motorcycle:", motorcycle.make, motorcycle.model);
    
    return motorcycle;
  } catch (error) {
    console.error("Error in getMotorcycleBySlug:", error);
    throw error;
  }
};

export const getAllMotorcycles = async (): Promise<Motorcycle[]> => {
  console.log("=== getAllMotorcycles ===");
  
  try {
    const data = await queryAllMotorcycles();
    
    const transformedMotorcycles = data.map(item => transformMotorcycleData(item));
    
    console.log("=== getAllMotorcycles SUMMARY ===");
    console.log("Total motorcycles processed:", transformedMotorcycles.length);
    console.log("Motorcycles with engine data:", transformedMotorcycles.filter(m => m.engine_size > 0).length);
    console.log("Motorcycles with horsepower data:", transformedMotorcycles.filter(m => m.horsepower > 0).length);
    console.log("Motorcycles with weight data:", transformedMotorcycles.filter(m => m.weight_kg > 0).length);
    
    return transformedMotorcycles;
  } catch (error) {
    console.error("Error in getAllMotorcycles:", error);
    throw error;
  }
};

export const findMotorcycleByDetails = async (make: string, model: string, year: number): Promise<Motorcycle | null> => {
  try {
    const data = await queryMotorcycleByDetails(make, model, year);
    
    if (!data) {
      return null;
    }
    
    return transformMotorcycleData(data);
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
    const motorcycleData = createPlaceholderMotorcycleData({
      ...params,
      isDraft: true
    });
    
    const { data: motorcycle, error } = await supabase
      .from('motorcycle_models')
      .insert({
        ...motorcycleData,
        brand_id: brand.id
      })
      .select()
      .single();
      
    if (error) throw error;
    
    // Create a model year for this placeholder
    const { data: modelYear, error: yearError } = await supabase
      .from('model_years')
      .insert({
        motorcycle_id: motorcycle.id,
        year: params.year,
        changes: 'Placeholder model year',
        is_available: true
      })
      .select()
      .single();
      
    if (yearError) throw yearError;
    
    // Create a basic configuration
    const { data: config, error: configError } = await supabase
      .from('model_configurations')
      .insert({
        model_year_id: modelYear.id,
        name: 'Standard',
        is_default: true
      })
      .select()
      .single();
      
    if (configError) throw configError;
    
    return {
      id: motorcycle.id,
      make: params.make,
      model: params.model,
      year: params.year,
      category: motorcycle.category || 'Standard',
      style_tags: [],
      difficulty_level: motorcycle.difficulty_level || 1,
      image_url: motorcycle.default_image_url || '',
      engine_size: motorcycle.engine_size || 0,
      horsepower: motorcycle.horsepower || 0,
      weight_kg: motorcycle.weight_kg || 0,
      wet_weight_kg: motorcycle.wet_weight_kg,
      seat_height_mm: motorcycle.seat_height_mm || 0,
      abs: motorcycle.has_abs || false,
      top_speed_kph: motorcycle.top_speed_kph || 0,
      torque_nm: motorcycle.torque_nm || 0,
      wheelbase_mm: motorcycle.wheelbase_mm || 0,
      ground_clearance_mm: motorcycle.ground_clearance_mm || 0,
      fuel_capacity_l: motorcycle.fuel_capacity_l || 0,
      smart_features: [],
      summary: motorcycle.summary || motorcycle.base_description || '',
      slug: motorcycle.slug,
      created_at: motorcycle.created_at,
      is_placeholder: true,
      brand_id: motorcycle.brand_id,
      is_draft: motorcycle.is_draft,
      
      // Enhanced technical fields
      transmission: motorcycle.transmission,
      drive_type: motorcycle.drive_type,
      cooling_system: motorcycle.cooling_system,
      power_to_weight_ratio: motorcycle.power_to_weight_ratio,
      is_entry_level: motorcycle.is_entry_level,
      recommended_license_level: motorcycle.recommended_license_level,
      use_cases: motorcycle.use_cases || []
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
