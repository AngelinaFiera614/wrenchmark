
import { supabase } from "@/integrations/supabase/client";

const MOTORCYCLE_MODEL_SELECT_QUERY = `
  id,
  brand_id,
  name,
  type,
  base_description,
  production_start_year,
  production_end_year,
  production_status,
  default_image_url,
  slug,
  engine_size,
  horsepower,
  torque_nm,
  weight_kg,
  wet_weight_kg,
  seat_height_mm,
  wheelbase_mm,
  ground_clearance_mm,
  fuel_capacity_l,
  top_speed_kph,
  has_abs,
  difficulty_level,
  status,
  category,
  summary,
  is_draft,
  transmission,
  drive_type,
  cooling_system,
  power_to_weight_ratio,
  is_entry_level,
  recommended_license_level,
  use_cases,
  created_at,
  updated_at,
  brands!motorcycle_models_brand_id_fkey(
    id,
    name,
    slug
  )
`;

const DETAILED_MOTORCYCLE_MODEL_SELECT_QUERY = `
  *,
  brands!motorcycle_models_brand_id_fkey(
    id,
    name,
    slug,
    logo_url,
    country
  ),
  motorcycle_model_tags!motorcycle_model_tags_motorcycle_id_fkey(
    motorcycle_tags!motorcycle_model_tags_tag_id_fkey(
      id,
      name,
      category,
      description,
      color_hex,
      icon
    )
  )
`;

export const fetchAllMotorcycles = async () => {
  try {
    console.log("Fetching all published motorcycles...");
    
    const { data, error } = await supabase
      .from('motorcycle_models')
      .select(MOTORCYCLE_MODEL_SELECT_QUERY)
      .eq('is_draft', false)
      .order('name', { ascending: true })
      .order('production_start_year', { ascending: true });
      
    if (error) {
      console.error("Error fetching motorcycles:", error);
      throw error;
    }
    
    console.log("Successfully fetched motorcycles:", data?.length || 0, "records");
    return data || [];
  } catch (error) {
    console.error("Failed to fetch motorcycles:", error);
    throw error;
  }
};

export const fetchAllMotorcyclesForAdmin = async () => {
  try {
    const { data, error } = await supabase
      .from('motorcycle_models')
      .select(MOTORCYCLE_MODEL_SELECT_QUERY)
      .order('is_draft', { ascending: false })
      .order('name', { ascending: true })
      .order('production_start_year', { ascending: true });
      
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    throw error;
  }
};

export const fetchMotorcycleBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('motorcycle_models')
    .select(DETAILED_MOTORCYCLE_MODEL_SELECT_QUERY)
    .eq('slug', slug)
    .eq('is_draft', false)
    .maybeSingle();
    
  return { data, error };
};

export const fetchMotorcycleBySlugForAdmin = async (slug: string) => {
  const { data, error } = await supabase
    .from('motorcycle_models')
    .select(DETAILED_MOTORCYCLE_MODEL_SELECT_QUERY)
    .eq('slug', slug)
    .maybeSingle();
    
  return { data, error };
};

export const fetchMotorcycleById = async (id: string) => {
  const { data, error } = await supabase
    .from('motorcycle_models')
    .select(DETAILED_MOTORCYCLE_MODEL_SELECT_QUERY)
    .eq('id', id)
    .eq('is_draft', false)
    .maybeSingle();
    
  return { data, error };
};

export const fetchMotorcycleByIdForAdmin = async (id: string) => {
  const { data, error } = await supabase
    .from('motorcycle_models')
    .select(DETAILED_MOTORCYCLE_MODEL_SELECT_QUERY)
    .eq('id', id)
    .maybeSingle();
    
  return { data, error };
};

export const fetchMotorcyclesByIds = async (ids: string[]) => {
  if (!ids.length) return { data: [], error: null };
  
  const { data, error } = await supabase
    .from('motorcycle_models')
    .select(MOTORCYCLE_MODEL_SELECT_QUERY)
    .in('id', ids)
    .eq('is_draft', false);
    
  return { data: data || [], error };
};

export const fetchMotorcyclesByIdsForAdmin = async (ids: string[]) => {
  if (!ids.length) return { data: [], error: null };
  
  const { data, error } = await supabase
    .from('motorcycle_models')
    .select(MOTORCYCLE_MODEL_SELECT_QUERY)
    .in('id', ids);
    
  return { data: data || [], error };
};

export const fetchMotorcycleByDetails = async (name: string, year: number) => {
  const { data, error } = await supabase
    .from('motorcycle_models')
    .select(MOTORCYCLE_MODEL_SELECT_QUERY)
    .eq('name', name)
    .eq('production_start_year', year)
    .eq('is_draft', false)
    .maybeSingle();
    
  return { data, error };
};

export const insertPlaceholderMotorcycle = async (motorcycleInsertData: any) => {
  const { data, error } = await supabase
    .from('motorcycle_models')
    .insert([motorcycleInsertData])
    .select()
    .single();
    
  return { data, error };
};

export const updateMotorcycleDraftStatus = async (id: string, isDraft: boolean) => {
  const { data, error } = await supabase
    .from('motorcycle_models')
    .update({ is_draft: isDraft })
    .eq('id', id)
    .select()
    .single();
    
  return { data, error };
};

// New functions for motorcycle tags
export const fetchMotorcycleTags = async () => {
  const { data, error } = await supabase
    .from('motorcycle_tags')
    .select('*')
    .order('category', { ascending: true })
    .order('name', { ascending: true });
    
  return { data: data || [], error };
};

export const fetchMotorcycleTagsByCategory = async (category: string) => {
  const { data, error } = await supabase
    .from('motorcycle_tags')
    .select('*')
    .eq('category', category)
    .order('name', { ascending: true });
    
  return { data: data || [], error };
};

export const addTagToMotorcycle = async (motorcycleId: string, tagId: string) => {
  const { data, error } = await supabase
    .from('motorcycle_model_tags')
    .insert({ motorcycle_id: motorcycleId, tag_id: tagId });
    
  return { data, error };
};

export const removeTagFromMotorcycle = async (motorcycleId: string, tagId: string) => {
  const { data, error } = await supabase
    .from('motorcycle_model_tags')
    .delete()
    .eq('motorcycle_id', motorcycleId)
    .eq('tag_id', tagId);
    
  return { data, error };
};

// Utility function to publish sample motorcycles for testing
export const publishSampleMotorcycles = async (count: number = 5) => {
  try {
    console.log(`Publishing ${count} sample motorcycles...`);
    
    // Get draft motorcycles
    const { data: draftMotorcycles, error: fetchError } = await supabase
      .from('motorcycle_models')
      .select('id, name')
      .eq('is_draft', true)
      .limit(count);
      
    if (fetchError) {
      throw fetchError;
    }
    
    if (!draftMotorcycles || draftMotorcycles.length === 0) {
      console.log("No draft motorcycles found to publish");
      return { published: 0 };
    }
    
    // Update them to published status
    const { data, error } = await supabase
      .from('motorcycle_models')
      .update({ is_draft: false })
      .in('id', draftMotorcycles.map(m => m.id))
      .select('id, name');
      
    if (error) {
      throw error;
    }
    
    console.log(`Successfully published ${data?.length || 0} motorcycles:`, data?.map(m => m.name));
    return { published: data?.length || 0, motorcycles: data };
  } catch (error) {
    console.error("Failed to publish sample motorcycles:", error);
    throw error;
  }
};
