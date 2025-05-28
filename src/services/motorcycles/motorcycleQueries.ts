
import { supabase } from "@/integrations/supabase/client";

const MOTORCYCLE_SELECT_QUERY = `
  id,
  brand_id,
  make,
  model,
  year,
  category,
  summary,
  slug,
  image_url,
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
  created_at,
  updated_at,
  is_placeholder,
  migration_status
`;

export const fetchAllMotorcycles = async () => {
  const { data, error } = await supabase
    .from('motorcycles')
    .select(MOTORCYCLE_SELECT_QUERY)
    .order('model', { ascending: true })
    .order('year', { ascending: true });
    
  if (error) {
    console.error("Error fetching motorcycles:", error);
    throw error;
  }
  
  return data || [];
};

export const fetchMotorcycleBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('motorcycles')
    .select(MOTORCYCLE_SELECT_QUERY)
    .eq('slug', slug)
    .maybeSingle();
    
  return { data, error };
};

export const fetchMotorcycleById = async (id: string) => {
  const { data, error } = await supabase
    .from('motorcycles')
    .select(MOTORCYCLE_SELECT_QUERY)
    .eq('id', id)
    .maybeSingle();
    
  return { data, error };
};

export const fetchMotorcyclesByIds = async (ids: string[]) => {
  if (!ids.length) return { data: [], error: null };
  
  const { data, error } = await supabase
    .from('motorcycles')
    .select(MOTORCYCLE_SELECT_QUERY)
    .in('id', ids);
    
  return { data: data || [], error };
};

export const fetchMotorcycleByDetails = async (model: string, year: number) => {
  const { data, error } = await supabase
    .from('motorcycles')
    .select(MOTORCYCLE_SELECT_QUERY)
    .eq('model', model)
    .eq('year', year)
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
