import { supabase } from "@/integrations/supabase/client";
import { Brand, Motorcycle, MotorcyclePlaceholder } from "@/types";

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

/**
 * Find a motorcycle by make, model, and year
 */
export const findMotorcycleByDetails = async (
  make: string,
  model: string,
  year: number
): Promise<Motorcycle | null> => {
  try {
    // First get the brand ID for the make
    const { data: brandData, error: brandError } = await supabase
      .from("brands")
      .select("id")
      .ilike("name", make)
      .single();

    if (brandError) {
      if (brandError.code === "PGRST116") {
        // No brand found with that name, will handle this later
        return null;
      }
      throw brandError;
    }

    const brandId = brandData.id;

    // Now search for the motorcycle with matching brand_id, model, and year
    const { data: motorcycleData, error: motorcycleError } = await supabase
      .from("motorcycles")
      .select(`
        id, 
        brand_id,
        model_name,
        year, 
        category,
        image_url,
        summary,
        difficulty_level,
        horsepower_hp,
        weight_kg,
        seat_height_mm,
        has_abs,
        engine,
        brands:brand_id (
          name,
          country
        )
      `)
      .eq("brand_id", brandId)
      .ilike("model_name", model)
      .eq("year", year)
      .single();

    if (motorcycleError) {
      if (motorcycleError.code === "PGRST116") {
        // No motorcycle found
        return null;
      }
      throw motorcycleError;
    }

    // Convert the database structure to the Motorcycle interface
    return {
      id: motorcycleData.id,
      make: motorcycleData.brands.name,
      model: motorcycleData.model_name,
      brand_id: motorcycleData.brand_id,
      year: motorcycleData.year,
      category: motorcycleData.category || "Unknown",
      image_url: motorcycleData.image_url || "/placeholder.svg",
      style_tags: [],
      difficulty_level: motorcycleData.difficulty_level || 3,
      engine_size: 0, // Default value
      horsepower: motorcycleData.horsepower_hp || 0,
      weight_kg: motorcycleData.weight_kg || 0,
      seat_height_mm: motorcycleData.seat_height_mm || 0,
      abs: !!motorcycleData.has_abs,
      top_speed_kph: 0, // Default value
      torque_nm: 0, // Default value
      wheelbase_mm: 0, // Default value
      ground_clearance_mm: 0, // Default value
      fuel_capacity_l: 0, // Default value
      smart_features: [],
      summary: motorcycleData.summary || `${motorcycleData.year} ${motorcycleData.brands.name} ${motorcycleData.model_name}`
    };
  } catch (error) {
    console.error("Error finding motorcycle by details:", error);
    return null; // Return null instead of throwing, as this is often a valid case
  }
};

/**
 * Create a placeholder motorcycle
 */
export const createPlaceholderMotorcycle = async (
  placeholderData: MotorcyclePlaceholder
): Promise<Motorcycle> => {
  try {
    // 1. Check if the brand exists or create it
    let brandId: string;
    
    // Try to find existing brand
    const { data: existingBrand, error: brandError } = await supabase
      .from("brands")
      .select("id")
      .ilike("name", placeholderData.make)
      .single();
      
    if (brandError) {
      if (brandError.code === "PGRST116") {
        // Brand doesn't exist, create it
        const { data: newBrand, error: newBrandError } = await supabase
          .from("brands")
          .insert({
            name: placeholderData.make,
            country: "Unknown",
            slug: placeholderData.make.toLowerCase().replace(/\s+/g, '-'),
            known_for: []
          })
          .select("id")
          .single();
          
        if (newBrandError) throw newBrandError;
        brandId = newBrand.id;
      } else {
        throw brandError;
      }
    } else {
      brandId = existingBrand.id;
    }
    
    // 2. Create the placeholder motorcycle
    const motorcycleSlug = `${placeholderData.make}-${placeholderData.model}-${placeholderData.year}`
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
      
    const { data: newMotorcycle, error: motorcycleError } = await supabase
      .from("motorcycles")
      .insert({
        brand_id: brandId,
        model_name: placeholderData.model,
        year: placeholderData.year,
        category: "Unknown",
        slug: motorcycleSlug,
        summary: `${placeholderData.year} ${placeholderData.make} ${placeholderData.model}`,
        image_url: "/placeholder.svg",
        is_placeholder: true,
        difficulty_level: 3,
        has_abs: false,
        weight_kg: 0,
        horsepower_hp: 0,
        seat_height_mm: 0
      })
      .select(`
        id, 
        brand_id,
        model_name,
        year, 
        category,
        image_url,
        summary,
        difficulty_level,
        horsepower_hp,
        weight_kg,
        seat_height_mm,
        has_abs,
        brands:brand_id (
          name,
          country
        )
      `)
      .single();
      
    if (motorcycleError) throw motorcycleError;
    
    // 3. Return the new motorcycle in the expected format
    return {
      id: newMotorcycle.id,
      make: placeholderData.make,
      model: newMotorcycle.model_name,
      brand_id: newMotorcycle.brand_id,
      year: newMotorcycle.year,
      category: newMotorcycle.category || "Unknown",
      image_url: newMotorcycle.image_url || "/placeholder.svg",
      style_tags: [],
      difficulty_level: newMotorcycle.difficulty_level || 3,
      engine_size: 0,
      horsepower: newMotorcycle.horsepower_hp || 0,
      weight_kg: newMotorcycle.weight_kg || 0,
      seat_height_mm: newMotorcycle.seat_height_mm || 0,
      abs: !!newMotorcycle.has_abs,
      top_speed_kph: 0,
      torque_nm: 0,
      wheelbase_mm: 0,
      ground_clearance_mm: 0,
      fuel_capacity_l: 0,
      smart_features: [],
      summary: newMotorcycle.summary || `${newMotorcycle.year} ${placeholderData.make} ${newMotorcycle.model_name}`,
      is_placeholder: true
    };
  } catch (error) {
    console.error("Error creating placeholder motorcycle:", error);
    throw error;
  }
};
