
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
      .order('make', { ascending: true })
      .order('model', { ascending: true });
      
    if (error) {
      console.error("Error fetching motorcycles:", error);
      throw error;
    }
    
    return (data || []).map(motorcycle => ({
      ...motorcycle,
      make: motorcycle.brand?.name || motorcycle.make || "Unknown",
      model: motorcycle.model_name || motorcycle.model || "Unknown",
      engine_size: motorcycle.engine_cc || motorcycle.engine_size || 0,
      horsepower: motorcycle.horsepower_hp || motorcycle.horsepower || 0,
      engine_cc: motorcycle.engine_cc || motorcycle.engine_size || 0,
      horsepower_hp: motorcycle.horsepower_hp || motorcycle.horsepower || 0,
      // Ensure we have a slug for routing
      slug: motorcycle.slug || `${motorcycle.make || 'unknown'}-${motorcycle.model_name || motorcycle.model || 'unknown'}-${motorcycle.year || ''}`.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').trim('-')
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
          make: fallbackData.brand?.name || fallbackData.make || "Unknown",
          model: fallbackData.model_name || fallbackData.model || "Unknown",
          engine_size: fallbackData.engine_cc || fallbackData.engine_size || 0,
          horsepower: fallbackData.horsepower_hp || fallbackData.horsepower || 0,
          engine_cc: fallbackData.engine_cc || fallbackData.engine_size || 0,
          horsepower_hp: fallbackData.horsepower_hp || fallbackData.horsepower || 0,
          slug: fallbackData.slug || `${fallbackData.make || 'unknown'}-${fallbackData.model_name || fallbackData.model || 'unknown'}-${fallbackData.year || ''}`.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').trim('-')
        };
      }
      
      return null;
    }
    
    if (!data) {
      return null;
    }
    
    return {
      ...data,
      make: data.brand?.name || data.make || "Unknown",
      model: data.model_name || data.model || "Unknown", 
      engine_size: data.engine_cc || data.engine_size || 0,
      horsepower: data.horsepower_hp || data.horsepower || 0,
      engine_cc: data.engine_cc || data.engine_size || 0,
      horsepower_hp: data.horsepower_hp || data.horsepower || 0,
      slug: data.slug || `${data.make || 'unknown'}-${data.model_name || data.model || 'unknown'}-${data.year || ''}`.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').trim('-')
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
      make: motorcycle.brand?.name || motorcycle.make || "Unknown",
      model: motorcycle.model_name || motorcycle.model || "Unknown",
      engine_size: motorcycle.engine_cc || motorcycle.engine_size || 0,
      horsepower: motorcycle.horsepower_hp || motorcycle.horsepower || 0,
      engine_cc: motorcycle.engine_cc || motorcycle.engine_size || 0,
      horsepower_hp: motorcycle.horsepower_hp || motorcycle.horsepower || 0,
      slug: motorcycle.slug || `${motorcycle.make || 'unknown'}-${motorcycle.model_name || motorcycle.model || 'unknown'}-${motorcycle.year || ''}`.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').trim('-')
    }));
  } catch (error) {
    console.error("Error in getMotorcyclesByIds:", error);
    return [];
  }
};
