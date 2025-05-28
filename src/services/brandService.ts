import { supabase } from "@/integrations/supabase/client";
import { Brand, BrandMilestone, LogoHistoryItem, MediaItem, NotableModel } from "@/types";

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
  description?: string;
  founded_city?: string;
  headquarters?: string;
  status?: "active" | "defunct" | "revived";
  brand_type?: "mass" | "boutique" | "revived" | "oem";
  is_electric?: boolean;
  website_url?: string;
  categories?: string[];
  notes?: string;
  brand_history?: string;
  milestones?: BrandMilestone[];
  manufacturing_facilities?: string[];
  logo_history?: LogoHistoryItem[];
  media_gallery?: MediaItem[];
  notable_models?: NotableModel[];
};

// Helper function to parse milestone data from various formats
const parseMilestones = (milestones: any): BrandMilestone[] => {
  if (!milestones) return [];
  
  // If it's already a proper array of objects, return it
  if (Array.isArray(milestones) && milestones.length > 0 && typeof milestones[0] === 'object' && milestones[0].year) {
    return milestones;
  }
  
  // If it's a string array or malformed data, convert it
  if (Array.isArray(milestones)) {
    return milestones.map((item, index) => ({
      year: 1950 + (index * 10), // Default years
      description: typeof item === 'string' ? item : item.description || 'Historical event',
      importance: 'medium' as const
    }));
  }
  
  return [];
};

// Helper function to parse notable models data from various formats
const parseNotableModels = (notableModels: any): NotableModel[] => {
  if (!notableModels) return [];
  
  // If it's already a proper array of objects, return it
  if (Array.isArray(notableModels) && notableModels.length > 0 && typeof notableModels[0] === 'object' && notableModels[0].name) {
    return notableModels;
  }
  
  // If it's a string array or malformed data, convert it
  if (Array.isArray(notableModels)) {
    return notableModels.map((item) => ({
      name: typeof item === 'string' ? item : item.name || 'Classic Model',
      years: '1970-present',
      category: 'Heritage',
      description: typeof item === 'string' ? `Classic ${item} model` : item.description || 'Iconic motorcycle'
    }));
  }
  
  return [];
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
    description: brand.description,
    founded_city: brand.founded_city,
    headquarters: brand.headquarters,
    status: brand.status,
    brand_type: brand.brand_type,
    is_electric: brand.is_electric,
    website_url: brand.website_url,
    categories: brand.categories,
    notes: brand.notes,
    brand_history: brand.brand_history,
    milestones: parseMilestones(brand.milestones),
    manufacturing_facilities: brand.manufacturing_facilities,
    logo_history: brand.logo_history,
    media_gallery: brand.media_gallery,
    notable_models: parseNotableModels(brand.notable_models),
    // Add compatibility aliases
    logo: brand.logo_url,
    knownFor: brand.known_for
  };
};

// Get all brands
export const getAllBrands = async (): Promise<Brand[]> => {
  try {
    const { data, error } = await supabase
      .from('brands')
      .select('*');

    if (error) {
      console.error("Error fetching brands:", error);
      throw new Error(`Error fetching brands: ${error.message}`);
    }

    return (data as SupabaseBrand[]).map(transformBrand);
  } catch (error) {
    console.error("Error in getAllBrands:", error);
    return [];
  }
};

// Get brand by ID
export const getBrandById = async (id: string): Promise<Brand | null> => {
  try {
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
  } catch (error) {
    console.error("Error in getBrandById:", error);
    return null;
  }
};

// Get brand by slug
export const getBrandBySlug = async (slug: string): Promise<Brand | null> => {
  try {
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
  } catch (error) {
    console.error("Error in getBrandBySlug:", error);
    return null;
  }
};

// Get motorcycles by brand ID
export const getMotorcyclesByBrandId = async (brandId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('motorcycles')
      .select('*')
      .eq('brand_id', brandId);

    if (error) {
      console.error("Error fetching motorcycles by brand:", error);
      throw new Error(`Error fetching motorcycles by brand: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error("Error in getMotorcyclesByBrandId:", error);
    return [];
  }
};

// Create new form fields for the enhanced brand data
export const createMilestonesField = () => {
  return [
    { year: 0, description: "", importance: "medium" as const }
  ];
};

export const createLogoHistoryItem = () => {
  return { year: 0, url: "", description: "" };
};

export const createMediaItem = () => {
  return { url: "", type: "image" as const, caption: "" };
};

export const createNotableModel = () => {
  return { name: "", years: "", category: "", image_url: "", description: "" };
};
