
import { supabase } from '@/integrations/supabase/client';

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  founded?: number;
  country: string;
  logo_url?: string;
  website_url?: string;
  known_for?: string[];
  knownFor?: string[];
  logo?: string;
  created_at: string;
  updated_at: string;
}

export async function fetchAllBrands(): Promise<Brand[]> {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching brands:', error);
    throw error;
  }

  // Ensure country field is always present
  return (data || []).map(brand => ({
    ...brand,
    country: brand.country || 'Unknown'
  }));
}

// Alias for backward compatibility
export const getAllBrands = fetchAllBrands;

export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // No brand found
    }
    console.error('Error fetching brand by slug:', error);
    throw error;
  }

  return data ? {
    ...data,
    country: data.country || 'Unknown'
  } : null;
}

export async function createBrand(brand: Partial<Brand>): Promise<Brand> {
  const { data, error } = await supabase
    .from('brands')
    .insert(brand)
    .select()
    .single();

  if (error) {
    console.error('Error creating brand:', error);
    throw error;
  }

  return {
    ...data,
    country: data.country || 'Unknown'
  };
}

export async function updateBrand(id: string, updates: Partial<Brand>): Promise<Brand> {
  const { data, error } = await supabase
    .from('brands')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating brand:', error);
    throw error;
  }

  return {
    ...data,
    country: data.country || 'Unknown'
  };
}

export async function deleteBrand(id: string): Promise<{ success: boolean; error?: string }> {
  // First check for dependencies
  const dependencies = await checkBrandDependencies(id);
  
  if (dependencies.hasModels) {
    return {
      success: false,
      error: `Cannot delete brand: ${dependencies.modelCount} motorcycle models depend on this brand`
    };
  }

  const { error } = await supabase
    .from('brands')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting brand:', error);
    return {
      success: false,
      error: error.message
    };
  }

  return { success: true };
}

export async function checkBrandDependencies(brandId: string): Promise<{
  hasModels: boolean;
  modelCount: number;
  models: string[];
}> {
  const { data: models, error } = await supabase
    .from('motorcycle_models')
    .select('id, name')
    .eq('brand_id', brandId);

  if (error) {
    console.error('Error checking brand dependencies:', error);
    return { hasModels: false, modelCount: 0, models: [] };
  }

  return {
    hasModels: (models?.length || 0) > 0,
    modelCount: models?.length || 0,
    models: models?.map(m => m.name) || []
  };
}

export async function searchBrands(query: string): Promise<Brand[]> {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .ilike('name', `%${query}%`)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error searching brands:', error);
    throw error;
  }

  return (data || []).map(brand => ({
    ...brand,
    country: brand.country || 'Unknown'
  }));
}

export function createMilestonesField(): Array<{ year: number; description: string }> {
  return [{ year: new Date().getFullYear(), description: '' }];
}
