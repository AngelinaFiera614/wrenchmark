
export interface ColorOption {
  id: string;
  configuration_id: string;
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
