
export interface ColorOption {
  id: string;
  model_year_id: string;
  name: string;
  hex_code?: string;
  image_url?: string;
  is_limited: boolean;
  popularity_score?: number;
  availability_status?: 'available' | 'discontinued' | 'limited' | 'special_order';
  production_years?: string;
  color_family?: string;
  finish_type?: 'solid' | 'metallic' | 'pearl' | 'matte' | 'satin' | 'gloss';
  msrp_premium_usd?: number;
  special_edition_name?: string;
  color_description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ColorFormState {
  name: string;
  hex_code?: string;
  image_url?: string;
  is_limited: boolean;
  model_year_id: string;
  popularity_score?: number;
  availability_status?: string;
  color_family?: string;
  finish_type?: string;
  msrp_premium_usd?: number;
  special_edition_name?: string;
  color_description?: string;
}

export interface ColorPopularityTracking {
  id: string;
  color_option_id: string;
  year: number;
  popularity_rank?: number;
  selection_percentage?: number;
  created_at: string;
  updated_at: string;
}
