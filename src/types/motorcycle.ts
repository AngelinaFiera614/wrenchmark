
export interface Configuration {
  id: string;
  name?: string;
  model_year_id: string;
  engine_id?: string;
  brake_system_id?: string;
  frame_id?: string;
  suspension_id?: string;
  wheel_id?: string;
  trim_level?: string;
  description?: string;
  is_default?: boolean;
  created_at?: string;
  updated_at?: string;
  msrp_usd?: number;
  price_premium_usd?: number;
  color_id?: string;
  image_url?: string;
  market_region?: string;
  special_features?: string[];
  optional_equipment?: string[];
  notes?: string;
  weight_kg?: number;
  seat_height_mm?: number;
  wheelbase_mm?: number;
  fuel_capacity_l?: number;
  ground_clearance_mm?: number;
  engine_override?: boolean;
  brake_system_override?: boolean;
  frame_override?: boolean;
  suspension_override?: boolean;
  wheel_override?: boolean;
  // Related component data
  engine?: any;
  brakes?: any;
  frame?: any;
  suspension?: any;
  wheels?: any;
  model_year?: ModelYear;
}

export interface ModelYear {
  id: string;
  year: number;
  motorcycle_id: string;
  msrp_usd?: number;
  is_available?: boolean;
  marketing_tagline?: string;
  changes?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
  configurations?: Configuration[];
}

export interface MotorcycleModel {
  id: string;
  name: string;
  slug: string;
  brand_id: string;
  type: string;
  production_start_year?: number;
  production_end_year?: number;
  production_status?: string;
  is_draft: boolean;
  created_at?: string;
  updated_at?: string;
  brands?: { name: string };
  brand?: { name: string }; // For backward compatibility
  years?: ModelYear[];
  default_image_url?: string;
  base_description?: string;
  summary?: string;
  category?: string;
  status?: string;
  engine_size?: number;
  horsepower?: number;
  torque_nm?: number;
  top_speed_kph?: number;
  has_abs?: boolean;
  weight_kg?: number;
  seat_height_mm?: number;
  wheelbase_mm?: number;
  ground_clearance_mm?: number;
  fuel_capacity_l?: number;
  difficulty_level?: number;
  // Legacy properties for backward compatibility
  model?: string;
  year?: number;
  image_url?: string;
  abs?: boolean;
  make?: string;
}

// Legacy Motorcycle interface for backward compatibility
export interface Motorcycle {
  id: string;
  name: string;
  slug: string;
  brand_id: string;
  type: string;
  production_start_year?: number;
  production_end_year?: number;
  production_status?: string;
  is_draft: boolean;
  created_at?: string;
  updated_at?: string;
  brands?: { name: string };
  brand?: { name: string };
  years?: ModelYear[];
  default_image_url?: string;
  base_description?: string;
  summary?: string;
  category?: string;
  status?: string;
  engine_size?: number;
  horsepower?: number;
  torque_nm?: number;
  top_speed_kph?: number;
  has_abs?: boolean;
  weight_kg?: number;
  seat_height_mm?: number;
  wheelbase_mm?: number;
  ground_clearance_mm?: number;
  fuel_capacity_l?: number;
  difficulty_level?: number;
  // Legacy properties for backward compatibility
  model?: string;
  year?: number;
  image_url?: string;
  abs?: boolean;
  make?: string;
}

export interface MotorcycleCategory {
  id: string;
  name: string;
  description?: string;
  slug: string;
  created_at?: string;
  updated_at?: string;
}
