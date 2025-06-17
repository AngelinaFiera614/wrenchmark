
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
