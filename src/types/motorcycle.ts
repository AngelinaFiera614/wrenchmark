
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
  // Additional properties needed by components
  smart_features?: string[];
  style_tags?: string[];
  engine_cc?: number;
  displacement_cc?: number;
  engine_type?: string;
  cylinder_count?: number;
  horsepower_hp?: number;
  power_rpm?: number;
  brake_type?: string;
  weight_lbs?: number;
  seat_height_in?: number;
  wheelbase_in?: number;
  ground_clearance_in?: number;
  fuel_capacity_gal?: number;
  is_entry_level?: boolean;
  power_to_weight_ratio?: number;
  use_cases?: string[];
  wet_weight_kg?: number;
  _componentData?: any;
}

// Change MotorcycleCategory from interface to string union type
export type MotorcycleCategory = 
  | "Sport"
  | "Cruiser"
  | "Touring"
  | "Adventure"
  | "Naked"
  | "Standard"
  | "Scooter"
  | "Off-road"
  | "Dual-sport";

// Add MotorcycleFilters interface
export interface MotorcycleFilters {
  search: string;
  make: string;
  categories: MotorcycleCategory[];
  yearRange: [number, number];
  engineSizeRange: [number, number];
  difficultyLevel: number;
  weightRange: [number, number];
  seatHeightRange: [number, number];
  abs?: boolean;
  useCases?: string[];
  isEntryLevel?: boolean;
  powerToWeightRange?: [number, number];
}

// Brand related types
export interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  website_url?: string;
  country?: string;
  founded?: number;
  founded_city?: string;
  headquarters?: string;
  status?: string;
  categories?: string[];
  known_for?: string[];
  brand_history?: string;
  milestones?: BrandMilestone[];
  notable_models?: NotableModel[];
  manufacturing_facilities?: string[];
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BrandMilestone {
  id?: string;
  year: number;
  title: string;
  description: string;
  significance?: string;
  image_url?: string;
}

export interface LogoHistoryItem {
  id?: string;
  year_introduced: number;
  year_discontinued?: number;
  logo_url: string;
  description?: string;
  is_current?: boolean;
}

export interface MediaItem {
  id?: string;
  type: 'image' | 'video' | 'document';
  url: string;
  title?: string;
  description?: string;
  year_captured?: number;
  is_featured?: boolean;
}

export interface NotableModel {
  id?: string;
  name: string;
  year_introduced: number;
  year_discontinued?: number;
  description?: string;
  significance?: string;
  image_url?: string;
  is_current?: boolean;
}

// Manual related types
export type ManualType = 
  | "Owner's Manual"
  | "Service Manual"
  | "Parts Manual"
  | "Technical Bulletin"
  | "Wiring Diagram"
  | "Quick Reference"
  | "Installation Guide"
  | "Maintenance Guide";

export interface Manual {
  id: string;
  title: string;
  manual_type?: ManualType;
  file_url?: string;
  file_size_mb?: number;
  motorcycle_id?: string;
  model_id?: string;
  make?: string;
  model?: string;
  year?: number;
  downloads: number;
  created_at: string;
  updated_at: string;
}

export interface ManualUpload {
  file: File;
  title: string;
  manual_type: ManualType;
  motorcycle_id?: string;
  make?: string;
  model?: string;
  year?: number;
}

export interface MotorcyclePlaceholder {
  id: string;
  make: string;
  model: string;
  year: number;
}
