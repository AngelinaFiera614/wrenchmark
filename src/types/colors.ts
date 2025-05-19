
export interface ColorOption {
  id: string;
  model_year_id: string;   // Changed from configuration_id to match the database
  name: string;
  hex_code?: string;
  image_url?: string;
  is_limited: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ColorFormState {
  name: string;
  hex_code?: string;
  image_url?: string;
  is_limited: boolean;
}
