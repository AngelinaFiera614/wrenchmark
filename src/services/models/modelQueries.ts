
import { supabase } from "@/integrations/supabase/client";

export const fetchAllMotorcycleModels = async () => {
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
      .order('name', { ascending: true });
      
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Error fetching motorcycle models:", error);
    throw error;
  }
};

export const fetchMotorcycleModelBySlug = async (slug: string) => {
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
      .eq('slug', slug)
      .maybeSingle();
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching motorcycle model by slug:", error);
    throw error;
  }
};

export const fetchModelsForComparison = async (slugs: string[]) => {
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
      .in('slug', slugs);
      
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Error fetching models for comparison:", error);
    throw error;
  }
};

export const deleteMotorcycleModelCascade = async (modelId: string) => {
  try {
    const { data, error } = await supabase
      .rpc('delete_motorcycle_model_cascade', {
        model_id_param: modelId
      });

    if (error) {
      throw error;
    }

    return data; // Returns boolean indicating success
  } catch (error) {
    console.error("Error deleting motorcycle model:", error);
    throw error;
  }
};

export const getMotorcycleModelRelations = async (modelId: string) => {
  try {
    const { data, error } = await supabase
      .rpc('get_motorcycle_model_relations', {
        model_id_param: modelId
      });

    if (error) {
      throw error;
    }

    return data; // Returns JSON with relation counts
  } catch (error) {
    console.error("Error getting motorcycle model relations:", error);
    throw error;
  }
};
