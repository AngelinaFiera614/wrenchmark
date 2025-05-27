
import { supabase } from "@/integrations/supabase/client";

const MOTORCYCLE_SELECT_QUERY = `
  *,
  brand:brand_id(name)
`;

export const fetchAllMotorcycles = async () => {
  const { data, error } = await supabase
    .from('motorcycles')
    .select(MOTORCYCLE_SELECT_QUERY)
    .order('model_name', { ascending: true })
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
    .eq('model_name', model)
    .eq('year', year)
    .maybeSingle();
    
  return { data, error };
};

export const insertPlaceholderMotorcycle = async (motorcycleInsertData: any) => {
  const { data, error } = await supabase
    .from('motorcycles')
    .insert([motorcycleInsertData])
    .select()
    .single();
    
  return { data, error };
};
