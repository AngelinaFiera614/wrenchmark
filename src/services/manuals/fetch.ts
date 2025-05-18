
// Functions for fetching manuals
import { supabase } from "@/integrations/supabase/client";
import { ManualInfo, ManualWithMotorcycle, ManualTag } from "./types";
import { getTagsForManual } from "./tags";

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
  const manuals = (data || []).map(item => {
    const motorcycle = item.motorcycles;
    return {
      ...item,
      motorcycle_name: motorcycle 
        ? `${motorcycle.brand?.name} ${motorcycle.model_name} ${motorcycle.year || ''}` 
        : 'Unknown'
    };
  });

  // Fetch tags for each manual
  const manualsWithTags = await Promise.all(
    manuals.map(async (manual) => {
      try {
        const tagDetails = await getTagsForManual(manual.id);
        return {
          ...manual,
          tag_details: tagDetails
        };
      } catch (err) {
        console.error(`Error fetching tags for manual ${manual.id}:`, err);
        return manual;
      }
    })
  );

  return manualsWithTags;
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

  // Fetch tags for each manual
  const manualsWithTags = await Promise.all(
    (data || []).map(async (manual) => {
      try {
        const tagDetails = await getTagsForManual(manual.id);
        return {
          ...manual,
          tag_details: tagDetails
        };
      } catch (err) {
        console.error(`Error fetching tags for manual ${manual.id}:`, err);
        return manual;
      }
    })
  );

  return manualsWithTags || [];
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
  const manual = {
    ...data,
    motorcycle_name: motorcycle 
      ? `${motorcycle.brand?.name} ${motorcycle.model_name} ${motorcycle.year || ''}` 
      : 'Unknown'
  };

  // Fetch tags for this manual
  try {
    const tagDetails = await getTagsForManual(manual.id);
    return {
      ...manual,
      tag_details: tagDetails
    };
  } catch (err) {
    console.error(`Error fetching tags for manual ${manual.id}:`, err);
    return manual;
  }
};

/**
 * Search manuals by title, tags, or motorcycle details
 */
export const searchManuals = async (searchQuery: string): Promise<ManualWithMotorcycle[]> => {
  // First search directly in the manuals table
  const { data: manualResults, error: manualError } = await supabase
    .from('manuals')
    .select(`
      *,
      motorcycles:motorcycle_id (
        model_name,
        year,
        brand:brand_id (name)
      )
    `)
    .or(`title.ilike.%${searchQuery}%,manual_type.ilike.%${searchQuery}%`)
    .order('title');

  if (manualError) {
    console.error("Error searching manuals:", manualError);
    throw manualError;
  }

  // Transform the results
  const manuals = (manualResults || []).map(item => {
    const motorcycle = item.motorcycles;
    return {
      ...item,
      motorcycle_name: motorcycle 
        ? `${motorcycle.brand?.name} ${motorcycle.model_name} ${motorcycle.year || ''}` 
        : 'Unknown'
    };
  });

  // Fetch tags for each manual
  const manualsWithTags = await Promise.all(
    manuals.map(async (manual) => {
      try {
        const tagDetails = await getTagsForManual(manual.id);
        return {
          ...manual,
          tag_details: tagDetails
        };
      } catch (err) {
        console.error(`Error fetching tags for manual ${manual.id}:`, err);
        return manual;
      }
    })
  );

  return manualsWithTags;
};
