
// Functions for fetching manuals
import { supabase } from "@/integrations/supabase/client";
import { ManualInfo, ManualWithMotorcycle } from "./types";

/**
 * Get all manuals with motorcycle information
 */
export const getManuals = async (): Promise<ManualWithMotorcycle[]> => {
  const { data, error } = await supabase
    .from('manuals')
    .select(`
      *,
      motorcycles:motorcycle_id (
        model_name,
        year,
        brand:brand_id (name)
      )
    `)
    .order('title');

  if (error) {
    console.error("Error fetching manuals:", error);
    throw error;
  }

  // Transform the response to get motorcycle name
  return (data || []).map(item => {
    const motorcycle = item.motorcycles;
    return {
      ...item,
      motorcycle_name: motorcycle 
        ? `${motorcycle.brand?.name} ${motorcycle.model_name} ${motorcycle.year || ''}` 
        : 'Unknown'
    };
  });
};

/**
 * Get manuals for a specific motorcycle
 */
export const getManualsByMotorcycleId = async (motorcycleId: string): Promise<any[]> => {
  const { data, error } = await supabase
    .from('manuals')
    .select('*')
    .eq('motorcycle_id', motorcycleId)
    .order('title');

  if (error) {
    console.error("Error fetching manuals for motorcycle:", error);
    throw error;
  }

  return data || [];
};

/**
 * Get a manual by ID with motorcycle information
 */
export const getManualById = async (id: string): Promise<ManualWithMotorcycle | null> => {
  const { data, error } = await supabase
    .from('manuals')
    .select(`
      *,
      motorcycles:motorcycle_id (
        model_name,
        year,
        brand:brand_id (name)
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // No match found
    }
    console.error("Error fetching manual:", error);
    throw error;
  }

  if (!data) return null;

  const motorcycle = data.motorcycles;
  return {
    ...data,
    motorcycle_name: motorcycle 
      ? `${motorcycle.brand?.name} ${motorcycle.model_name} ${motorcycle.year || ''}` 
      : 'Unknown'
  };
};
