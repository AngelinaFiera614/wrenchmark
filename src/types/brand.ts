
export interface Brand {
  id: string;
  name: string;
  country: string;
  founded: number;
  logo_url: string;
  known_for: string[];
  slug?: string;
  
  // Base fields
  description?: string;
  founded_city?: string;
  headquarters?: string;
  status?: "active" | "defunct" | "revived";
  brand_type?: "mass" | "boutique" | "revived" | "oem";
  is_electric?: boolean;
  website_url?: string;
  categories?: string[];
  notes?: string;
  
  // New expanded fields
  brand_history?: string; // Rich text markdown for detailed history
  milestones?: BrandMilestone[]; // Timeline of key events
  manufacturing_facilities?: string[]; // Major manufacturing locations
  logo_history?: LogoHistoryItem[]; // Historical logos
  media_gallery?: MediaItem[]; // Additional brand images
  notable_models?: NotableModel[]; // Key models from this brand
  
  // Aliases for compatibility
  logo?: string;
  knownFor?: string[];
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
  years: string; // e.g., "1969-1982" or "1995-present"
  category: string;
  image_url?: string;
  description?: string;
}
