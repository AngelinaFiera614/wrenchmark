
export interface Brand {
  id: string;
  name: string;
  country: string;
  founded: number;
  logo_url: string;
  known_for: string[];
  slug?: string;
  
  // New fields
  description?: string;
  founded_city?: string;
  headquarters?: string;
  status?: "active" | "defunct" | "revived";
  brand_type?: "mass" | "boutique" | "revived" | "oem";
  is_electric?: boolean;
  website_url?: string;
  categories?: string[];
  notes?: string;
  
  // Aliases for compatibility
  logo?: string;
  knownFor?: string[];
}
