
import { supabase } from "@/integrations/supabase/client";
import { Motorcycle } from "@/types";

export const getAllMotorcycles = async (): Promise<Motorcycle[]> => {
  try {
    const { data, error } = await supabase
      .from('motorcycles')
      .select(`
        *,
        brand:brand_id(name)
      `)
      .order('model_name', { ascending: true })
      .order('year', { ascending: true });
      
    if (error) {
      console.error("Error fetching motorcycles:", error);
      throw error;
    }
    
    return (data || []).map(motorcycle => ({
      ...motorcycle,
      make: motorcycle.brand?.name || "Unknown",
      model: motorcycle.model_name || "Unknown",
      engine_size: motorcycle.engine_cc || motorcycle.horsepower_hp || 0,
      horsepower: motorcycle.horsepower_hp || 0,
      engine_cc: motorcycle.engine_cc || motorcycle.horsepower_hp || 0,
      horsepower_hp: motorcycle.horsepower_hp || 0,
      abs: motorcycle.has_abs || false,
      style_tags: motorcycle.tags || [],
      smart_features: motorcycle.smart_features || [],
      // Ensure we have a slug for routing
      slug: motorcycle.slug || `${motorcycle.brand?.name || 'unknown'}-${motorcycle.model_name || 'unknown'}-${motorcycle.year || ''}`.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
    }));
  } catch (error) {
    console.error("Error in getAllMotorcycles:", error);
    return [];
  }
};

export const getMotorcycleBySlug = async (slug: string): Promise<Motorcycle | null> => {
  try {
    const { data, error } = await supabase
      .from('motorcycles')
      .select(`
        *,
        brand:brand_id(name)
      `)
      .eq('slug', slug)
      .maybeSingle();
      
    if (error) {
      console.error("Error fetching motorcycle by slug:", error);
      
      // If slug lookup fails, try finding by ID as fallback
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('motorcycles')
        .select(`
          *,
          brand:brand_id(name)
        `)
        .eq('id', slug)
        .maybeSingle();
        
      if (fallbackError) {
        console.error("Error in fallback motorcycle lookup:", fallbackError);
        return null;
      }
      
      if (fallbackData) {
        return {
          ...fallbackData,
          make: fallbackData.brand?.name || "Unknown",
          model: fallbackData.model_name || "Unknown",
          engine_size: fallbackData.engine_cc || fallbackData.horsepower_hp || 0,
          horsepower: fallbackData.horsepower_hp || 0,
          engine_cc: fallbackData.engine_cc || fallbackData.horsepower_hp || 0,
          horsepower_hp: fallbackData.horsepower_hp || 0,
          abs: fallbackData.has_abs || false,
          style_tags: fallbackData.tags || [],
          smart_features: fallbackData.smart_features || [],
          slug: fallbackData.slug || `${fallbackData.brand?.name || 'unknown'}-${fallbackData.model_name || 'unknown'}-${fallbackData.year || ''}`.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
        };
      }
      
      return null;
    }
    
    if (!data) {
      return null;
    }
    
    return {
      ...data,
      make: data.brand?.name || "Unknown",
      model: data.model_name || "Unknown", 
      engine_size: data.engine_cc || data.horsepower_hp || 0,
      horsepower: data.horsepower_hp || 0,
      engine_cc: data.engine_cc || data.horsepower_hp || 0,
      horsepower_hp: data.horsepower_hp || 0,
      abs: data.has_abs || false,
      style_tags: data.tags || [],
      smart_features: data.smart_features || [],
      slug: data.slug || `${data.brand?.name || 'unknown'}-${data.model_name || 'unknown'}-${data.year || ''}`.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
    };
  } catch (error) {
    console.error("Error in getMotorcycleBySlug:", error);
    return null;
  }
};

export const getMotorcyclesByIds = async (ids: string[]): Promise<Motorcycle[]> => {
  if (!ids.length) return [];
  
  try {
    const { data, error } = await supabase
      .from('motorcycles')
      .select(`
        *,
        brand:brand_id(name)
      `)
      .in('id', ids);
      
    if (error) {
      console.error("Error fetching motorcycles by IDs:", error);
      return [];
    }
    
    return (data || []).map(motorcycle => ({
      ...motorcycle,
      make: motorcycle.brand?.name || "Unknown",
      model: motorcycle.model_name || "Unknown",
      engine_size: motorcycle.engine_cc || motorcycle.horsepower_hp || 0,
      horsepower: motorcycle.horsepower_hp || 0,
      engine_cc: motorcycle.engine_cc || motorcycle.horsepower_hp || 0,
      horsepower_hp: motorcycle.horsepower_hp || 0,
      abs: motorcycle.has_abs || false,
      style_tags: motorcycle.tags || [],
      smart_features: motorcycle.smart_features || [],
      slug: motorcycle.slug || `${motorcycle.brand?.name || 'unknown'}-${motorcycle.model_name || 'unknown'}-${motorcycle.year || ''}`.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
    }));
  } catch (error) {
    console.error("Error in getMotorcyclesByIds:", error);
    return [];
  }
};

export const findMotorcycleByDetails = async (make: string, model: string, year: number): Promise<Motorcycle | null> => {
  try {
    const { data, error } = await supabase
      .from('motorcycles')
      .select(`
        *,
        brand:brand_id(name)
      `)
      .eq('model_name', model)
      .eq('year', year)
      .maybeSingle();
      
    if (error) {
      console.error("Error finding motorcycle by details:", error);
      return null;
    }
    
    if (!data) {
      return null;
    }
    
    return {
      ...data,
      make: data.brand?.name || "Unknown",
      model: data.model_name || "Unknown",
      engine_size: data.engine_cc || data.horsepower_hp || 0,
      horsepower: data.horsepower_hp || 0,
      engine_cc: data.engine_cc || data.horsepower_hp || 0,
      horsepower_hp: data.horsepower_hp || 0,
      abs: data.has_abs || false,
      style_tags: data.tags || [],
      smart_features: data.smart_features || [],
      slug: data.slug || `${data.brand?.name || 'unknown'}-${data.model_name || 'unknown'}-${data.year || ''}`.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
    };
  } catch (error) {
    console.error("Error in findMotorcycleByDetails:", error);
    return null;
  }
};

export const createPlaceholderMotorcycle = async (motorcycleData: {
  make: string;
  model: string;
  year: number;
}): Promise<Motorcycle> => {
  try {
    const slug = `${motorcycleData.make}-${motorcycleData.model}-${motorcycleData.year}`
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const { data, error } = await supabase
      .from('motorcycles')
      .insert([{
        model_name: motorcycleData.model,
        year: motorcycleData.year,
        slug: slug,
        is_placeholder: true,
        category: 'Standard',
        tags: [],
        difficulty_level: 3,
        horsepower_hp: 0,
        weight_kg: 0,
        seat_height_mm: 0,
        has_abs: false,
        top_speed_kph: 0,
        torque_nm: 0,
        wheelbase_mm: 0,
        fuel_capacity_l: 0,
        summary: `${motorcycleData.make} ${motorcycleData.model} ${motorcycleData.year} - Placeholder entry`,
        image_url: ''
      }])
      .select()
      .single();
      
    if (error) {
      console.error("Error creating placeholder motorcycle:", error);
      throw error;
    }
    
    return {
      ...data,
      make: motorcycleData.make,
      model: data.model_name || motorcycleData.model,
      engine_size: data.engine_cc || data.horsepower_hp || 0,
      horsepower: data.horsepower_hp || 0,
      engine_cc: data.engine_cc || data.horsepower_hp || 0,
      abs: data.has_abs || false,
      style_tags: data.tags || [],
      smart_features: data.smart_features || []
    };
  } catch (error) {
    console.error("Error in createPlaceholderMotorcycle:", error);
    throw error;
  }
};
