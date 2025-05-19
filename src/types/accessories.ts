
export interface Accessory {
  id: string;
  name: string;
  category: AccessoryCategory;
  description?: string;
  price_usd?: number;
  image_url?: string;
  manufacturer?: string;
  created_at?: string;
  updated_at?: string;
}

export type AccessoryCategory = 
  | "Luggage" 
  | "Protection" 
  | "Performance" 
  | "Comfort" 
  | "Electronics"
  | "Appearance";

export interface AccessoryCompatibility {
  id: string;
  accessory_id: string;
  configuration_id: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AccessoryFormState {
  name: string;
  category: AccessoryCategory;
  description?: string;
  price_usd?: number;
  image_url?: string;
  manufacturer?: string;
}
