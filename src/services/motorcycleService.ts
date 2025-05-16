
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
  return {
    id: motorcycle.id,
    make: motorcycle.brand.name,
    brand_id: motorcycle.brand_id,
    model: motorcycle.model_name,
    year: motorcycle.year,
    category: motorcycle.category,
    style_tags: motorcycle.tags,
    difficulty_level: motorcycle.difficulty_level,
    image_url: motorcycle.image_url,
    engine_size: parseInt(motorcycle.engine) || 0,
    horsepower: motorcycle.horsepower_hp,
    weight_kg: motorcycle.weight_kg,
    seat_height_mm: motorcycle.seat_height_mm,
    abs: motorcycle.has_abs,
    top_speed_kph: motorcycle.top_speed_kph,
    torque_nm: motorcycle.torque_nm, 
    wheelbase_mm: motorcycle.wheelbase_mm,
    fuel_capacity_l: motorcycle.fuel_capacity_l,
    smart_features: motorcycle.tags,
    summary: motorcycle.summary,
    slug: motorcycle.slug
  };
};

// Get all motorcycles
export const getAllMotorcycles = async (): Promise<Motorcycle[]> => {
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
};

// Get motorcycle by ID
export const getMotorcycleById = async (id: string): Promise<Motorcycle | null> => {
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
      return null;
    }
    console.error("Error fetching motorcycle:", error);
    throw new Error(`Error fetching motorcycle: ${error.message}`);
  }

  return data ? transformMotorcycle(data as SupabaseMotorcycle) : null;
};

// Get motorcycle by slug
export const getMotorcycleBySlug = async (slug: string): Promise<Motorcycle | null> => {
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
};
