
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
  created_at,
  updated_at,
  brands!motorcycle_models_brand_id_fkey(
    id,
    name,
    slug
  )
`;

export const fetchAllMotorcycles = async () => {
  try {
    const { data, error } = await supabase
      .from('motorcycle_models')
      .select(MOTORCYCLE_MODEL_SELECT_QUERY)
      .eq('is_draft', false) // Only fetch published motorcycles for public
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

export const fetchAllMotorcyclesForAdmin = async () => {
  try {
    const { data, error } = await supabase
      .from('motorcycle_models')
      .select(MOTORCYCLE_MODEL_SELECT_QUERY)
      .order('is_draft', { ascending: false }) // Show drafts first
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
    .select(MOTORCYCLE_MODEL_SELECT_QUERY)
    .eq('slug', slug)
    .eq('is_draft', false) // Only published motorcycles for public access
    .maybeSingle();
    
  return { data, error };
};

export const fetchMotorcycleBySlugForAdmin = async (slug: string) => {
  const { data, error } = await supabase
    .from('motorcycle_models')
    .select(MOTORCYCLE_MODEL_SELECT_QUERY)
    .eq('slug', slug)
    .maybeSingle(); // Admin can access both drafts and published
    
  return { data, error };
};

export const fetchMotorcycleById = async (id: string) => {
  const { data, error } = await supabase
    .from('motorcycle_models')
    .select(MOTORCYCLE_MODEL_SELECT_QUERY)
    .eq('id', id)
    .eq('is_draft', false) // Only published for public
    .maybeSingle();
    
  return { data, error };
};

export const fetchMotorcycleByIdForAdmin = async (id: string) => {
  const { data, error } = await supabase
    .from('motorcycle_models')
    .select(MOTORCYCLE_MODEL_SELECT_QUERY)
    .eq('id', id)
    .maybeSingle(); // Admin can access both drafts and published
    
  return { data, error };
};

export const fetchMotorcyclesByIds = async (ids: string[]) => {
  if (!ids.length) return { data: [], error: null };
  
  const { data, error } = await supabase
    .from('motorcycle_models')
    .select(MOTORCYCLE_MODEL_SELECT_QUERY)
    .in('id', ids)
    .eq('is_draft', false); // Only published for public
    
  return { data: data || [], error };
};

export const fetchMotorcyclesByIdsForAdmin = async (ids: string[]) => {
  if (!ids.length) return { data: [], error: null };
  
  const { data, error } = await supabase
    .from('motorcycle_models')
    .select(MOTORCYCLE_MODEL_SELECT_QUERY)
    .in('id', ids); // Admin can access both drafts and published
    
  return { data: data || [], error };
};

export const fetchMotorcycleByDetails = async (name: string, year: number) => {
  const { data, error } = await supabase
    .from('motorcycle_models')
    .select(MOTORCYCLE_MODEL_SELECT_QUERY)
    .eq('name', name)
    .eq('production_start_year', year)
    .eq('is_draft', false) // Only published for public
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
