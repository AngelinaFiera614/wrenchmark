
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
  
  // Extended brand properties
  founded_city?: string;
  headquarters?: string;
  status?: "active" | "defunct" | "revived";
  brand_type?: "mass" | "boutique" | "revived" | "oem";
  is_electric?: boolean;
  categories?: string[];
  notes?: string;
  brand_history?: string;
  milestones?: BrandMilestone[];
  manufacturing_facilities?: string[];
  logo_history?: LogoHistoryItem[];
  media_gallery?: MediaItem[];
  notable_models?: NotableModel[];
}

export interface BrandMilestone {
  year: number;
  description: string;
  importance?: "low" | "medium" | "high";
}

export interface LogoHistoryItem {
  year: number;
  url: string;
  description?: string;
}

export interface MediaItem {
  url: string;
  type: "image" | "video";
  caption?: string;
  year?: number;
}

export interface NotableModel {
  name: string;
  years: string;
  category: string;
  image_url?: string;
  description?: string;
}

export interface BrandFormData {
  name: string;
  slug: string;
  description?: string;
  founded?: number;
  country: string;
  logo_url?: string;
  website_url?: string;
  known_for?: string[];
}
