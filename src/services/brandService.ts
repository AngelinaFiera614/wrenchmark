
import { supabase } from "@/integrations/supabase/client";
import { Brand } from "@/types";

export type SupabaseBrand = {
  id: string;
  name: string;
  country: string;
  founded: number;
  logo_url: string;
  known_for: string[];
  slug: string;
  created_at: string;
  updated_at: string;
};

// Transform Supabase brand to our app's brand type
const transformBrand = (brand: SupabaseBrand): Brand => {
  return {
    id: brand.id,
    name: brand.name,
    country: brand.country,
    founded: brand.founded,
    logo_url: brand.logo_url,
    known_for: brand.known_for,
    slug: brand.slug,
    // Add compatibility aliases
    logo: brand.logo_url,
    knownFor: brand.known_for,
    description: `Founded in ${brand.founded} in ${brand.country}`
  };
};

// Get all brands
export const getAllBrands = async (): Promise<Brand[]> => {
  const { data, error } = await supabase
    .from('brands')
    .select('*');

  if (error) {
    console.error("Error fetching brands:", error);
    throw new Error(`Error fetching brands: ${error.message}`);
  }

  return (data as SupabaseBrand[]).map(transformBrand);
};

// Get brand by ID
export const getBrandById = async (id: string): Promise<Brand | null> => {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows found
      return null;
    }
    console.error("Error fetching brand:", error);
    throw new Error(`Error fetching brand: ${error.message}`);
  }

  return data ? transformBrand(data as SupabaseBrand) : null;
};

// Get brand by slug
export const getBrandBySlug = async (slug: string): Promise<Brand | null> => {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows found
      return null;
    }
    console.error("Error fetching brand by slug:", error);
    throw new Error(`Error fetching brand by slug: ${error.message}`);
  }

  return data ? transformBrand(data as SupabaseBrand) : null;
};

// Get motorcycles by brand ID
export const getMotorcyclesByBrandId = async (brandId: string): Promise<any[]> => {
  const { data, error } = await supabase
    .from('motorcycles')
    .select('*')
    .eq('brand_id', brandId);

  if (error) {
    console.error("Error fetching motorcycles by brand:", error);
    throw new Error(`Error fetching motorcycles by brand: ${error.message}`);
  }

  return data || [];
};
