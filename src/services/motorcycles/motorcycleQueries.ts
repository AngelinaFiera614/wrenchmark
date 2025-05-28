
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
  created_at,
  updated_at,
  brands!motorcycle_models_brand_id_fkey(
    id,
    name,
    slug
  )
`;

export const fetchAllMotorcycles = async () => {
  const { data, error } = await supabase
    .from('motorcycle_models')
    .select(MOTORCYCLE_MODEL_SELECT_QUERY)
    .order('name', { ascending: true })
    .order('production_start_year', { ascending: true });
    
  if (error) {
    console.error("Error fetching motorcycle models:", error);
    throw error;
  }
  
  return data || [];
};

export const fetchMotorcycleBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('motorcycle_models')
    .select(MOTORCYCLE_MODEL_SELECT_QUERY)
    .eq('slug', slug)
    .maybeSingle();
    
  return { data, error };
};

export const fetchMotorcycleById = async (id: string) => {
  const { data, error } = await supabase
    .from('motorcycle_models')
    .select(MOTORCYCLE_MODEL_SELECT_QUERY)
    .eq('id', id)
    .maybeSingle();
    
  return { data, error };
};

export const fetchMotorcyclesByIds = async (ids: string[]) => {
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
