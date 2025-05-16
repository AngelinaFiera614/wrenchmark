
import { supabase } from "@/integrations/supabase/client";
import { Motorcycle } from "@/types";

export type SupabaseMotorcycle = {
  id: string;
  brand_id: string;
  model_name: string;
  year: number;
  image_url: string;
  engine: string;
  horsepower_hp: number;
  torque_nm: number;
  top_speed_kph: number;
  seat_height_mm: number;
  weight_kg: number;
  wheelbase_mm: number;
  fuel_capacity_l: number;
  has_abs: boolean;
  tags: string[];
  summary: string;
  slug: string;
  difficulty_level: number;
  category: string;
  created_at: string;
  updated_at: string;
  brand: {
    id: string;
    name: string;
    country: string;
    logo_url: string;
    known_for: string[];
    slug: string;
  };
};

// Transform Supabase motorcycle to our app's motorcycle type
const transformMotorcycle = (motorcycle: SupabaseMotorcycle): Motorcycle => {
  // Extract engine size as a number from the engine text
  let engineSize = 0;
  if (motorcycle.engine) {
    // Check for common patterns like "649cc", "1254 cc", etc.
    const engineMatch = motorcycle.engine.match(/(\d+)\s*cc/i);
    if (engineMatch && engineMatch[1]) {
      engineSize = parseInt(engineMatch[1], 10);
    } else {
      // If no cc pattern, just try to extract the first number
      const numberMatch = motorcycle.engine.match(/(\d+)/);
      if (numberMatch && numberMatch[1]) {
        engineSize = parseInt(numberMatch[1], 10);
      }
    }
  }

  // Calculate ground clearance based on motorcycle category if not available
  let groundClearance = 150; // default value
  if (motorcycle.category) {
    switch(motorcycle.category.toLowerCase()) {
      case 'adventure':
      case 'dual-sport':
      case 'off-road':
        groundClearance = 220;
        break;
      case 'cruiser':
        groundClearance = 135;
        break;
      case 'sport':
        groundClearance = 130;
        break;
      case 'touring':
        groundClearance = 140;
        break;
      default:
        groundClearance = 150;
    }
  }

  return {
    id: motorcycle.id,
    make: motorcycle.brand?.name || "Unknown",
    brand_id: motorcycle.brand_id,
    model: motorcycle.model_name,
    year: motorcycle.year || 2023,
    category: motorcycle.category || "Standard",
    style_tags: motorcycle.tags || [],
    difficulty_level: motorcycle.difficulty_level || 1,
    image_url: motorcycle.image_url || "https://images.unsplash.com/photo-1558981285-6f0c94958bb6?q=80&w=1000",
    engine_size: engineSize,
    horsepower: motorcycle.horsepower_hp || 0,
    weight_kg: motorcycle.weight_kg || 0,
    seat_height_mm: motorcycle.seat_height_mm || 800,
    abs: motorcycle.has_abs || false,
    top_speed_kph: motorcycle.top_speed_kph || 0,
    torque_nm: motorcycle.torque_nm || 0, 
    wheelbase_mm: motorcycle.wheelbase_mm || 0,
    ground_clearance_mm: groundClearance,
    fuel_capacity_l: motorcycle.fuel_capacity_l || 0,
    smart_features: motorcycle.tags || [],
    summary: motorcycle.summary || `${motorcycle.model_name} ${motorcycle.year}`,
    slug: motorcycle.slug,
    // Add compatibility aliases
    engine_cc: engineSize,
    horsepower_hp: motorcycle.horsepower_hp || 0
  };
};

// Get all motorcycles
export const getAllMotorcycles = async (): Promise<Motorcycle[]> => {
  try {
    const { data, error } = await supabase
      .from('motorcycles')
      .select(`
        *,
        brand:brand_id (
          id, name, country, logo_url, known_for, slug
        )
      `);

    if (error) {
      console.error("Error fetching motorcycles:", error);
      throw new Error(`Error fetching motorcycles: ${error.message}`);
    }

    return (data as SupabaseMotorcycle[]).map(transformMotorcycle);
  } catch (error) {
    console.error("Error in getAllMotorcycles:", error);
    return [];
  }
};

// Get motorcycle by ID
export const getMotorcycleById = async (id: string): Promise<Motorcycle | null> => {
  try {
    console.log("Fetching motorcycle by ID:", id);
    const { data, error } = await supabase
      .from('motorcycles')
      .select(`
        *,
        brand:brand_id (
          id, name, country, logo_url, known_for, slug
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found
        console.log("No motorcycle found with ID:", id);
        return null;
      }
      console.error("Error fetching motorcycle:", error);
      throw new Error(`Error fetching motorcycle: ${error.message}`);
    }

    if (!data) {
      console.log("No data returned for motorcycle with ID:", id);
      return null;
    }

    console.log("Motorcycle data fetched:", data);
    return transformMotorcycle(data as SupabaseMotorcycle);
  } catch (error) {
    console.error("Error in getMotorcycleById:", error);
    return null;
  }
};

// Get motorcycle by slug
export const getMotorcycleBySlug = async (slug: string): Promise<Motorcycle | null> => {
  try {
    const { data, error } = await supabase
      .from('motorcycles')
      .select(`
        *,
        brand:brand_id (
          id, name, country, logo_url, known_for, slug
        )
      `)
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found
        return null;
      }
      console.error("Error fetching motorcycle by slug:", error);
      throw new Error(`Error fetching motorcycle by slug: ${error.message}`);
    }

    return data ? transformMotorcycle(data as SupabaseMotorcycle) : null;
  } catch (error) {
    console.error("Error in getMotorcycleBySlug:", error);
    return null;
  }
};
