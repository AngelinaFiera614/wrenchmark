
import { supabase } from "@/integrations/supabase/client";

export const MOTORCYCLE_SELECT_QUERY = `
  *,
  brands!motorcycle_models_brand_id_fkey(*),
  years:model_years(
    *,
    configurations:model_configurations(
      *,
      engines(*),
      brake_systems(*),
      frames(*),
      suspensions(*),
      wheels(*)
    )
  )
`;

export const queryMotorcycleBySlug = async (slug: string) => {
  console.log("=== queryMotorcycleBySlug ===");
  console.log("Fetching motorcycle with slug:", slug);

  const { data, error } = await supabase
    .from('motorcycle_models')
    .select(MOTORCYCLE_SELECT_QUERY)
    .eq('slug', slug)
    .eq('is_draft', false)
    .single();

  if (error) {
    console.error("Error fetching motorcycle by slug:", error);
    throw error;
  }

  console.log("Raw motorcycle data for slug:", data);
  return data;
};

export const queryAllMotorcycles = async () => {
  console.log("=== queryAllMotorcycles ===");
  
  const { data, error } = await supabase
    .from('motorcycle_models')
    .select(MOTORCYCLE_SELECT_QUERY)
    .eq('is_draft', false)
    .order('name');

  if (error) {
    console.error("Error fetching all motorcycles:", error);
    throw error;
  }

  console.log("Raw motorcycles data count:", data?.length || 0);
  return data || [];
};

export const queryMotorcycleByDetails = async (make: string, model: string, year: number) => {
  const { data, error } = await supabase
    .from('motorcycle_models')
    .select(MOTORCYCLE_SELECT_QUERY)
    .ilike('name', `%${model}%`)
    .eq('brands.name', make)
    .gte('production_start_year', year - 2)
    .lte('production_end_year', year + 2)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
};
