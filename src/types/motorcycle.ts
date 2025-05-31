export type MotorcycleCategory = 
  | "Sport" 
  | "Cruiser" 
  | "Touring" 
  | "Adventure" 
  | "Naked" 
  | "Dual-sport" 
  | "Standard" 
  | "Scooter" 
  | "Off-road";

export type ProductionStatus = 
  | "active" 
  | "revived" 
  | "discontinued" 
  | "concept" 
  | "limited";

export interface Motorcycle {
  id: string;
  make: string;
  brand_id?: string; 
  model: string;
  year: number;
  category: string;
  style_tags: string[];
  difficulty_level: number;
  image_url: string;
  engine_size: number;
  horsepower: number;
  weight_kg: number;
  wet_weight_kg?: number;
  seat_height_mm: number;
  abs: boolean;
  top_speed_kph: number;
  torque_nm: number;
  wheelbase_mm: number;
  ground_clearance_mm: number;
  fuel_capacity_l: number;
  smart_features: string[];
  summary: string;
  slug?: string;
  created_at?: string;
  is_placeholder?: boolean;
  migration_status?: string;
  status?: string;
  engine?: string;
  is_draft?: boolean;
  
  // New enhanced technical fields
  transmission?: string;
  drive_type?: string;
  cooling_system?: string;
  power_to_weight_ratio?: number;
  is_entry_level?: boolean;
  recommended_license_level?: string;
  use_cases?: string[];
  
  // Compatibility aliases for legacy code
  engine_cc?: number;
  displacement_cc?: number;
  horsepower_hp?: number;
  
  // Enhanced engine information
  power_rpm?: number;
  torque_rpm?: number;
  engine_type?: string;
  cylinder_count?: number;
  
  // Enhanced brake system information
  brake_type?: string;
  has_abs?: boolean;
  
  // US Standard fields (calculated in app, not stored)
  weight_lbs?: number;
  seat_height_in?: number;
  wheelbase_in?: number;
  ground_clearance_in?: number;
  fuel_capacity_gal?: number;
  top_speed_mph?: number;
}

export interface MotorcycleFilters {
  searchTerm: string;
  categories: MotorcycleCategory[];
  make: string;
  yearRange: [number, number];
  engineSizeRange: [number, number];
  difficultyLevel: number;
  weightRange: [number, number];
  seatHeightRange: [number, number];
  abs: boolean | null;
  styleTags?: string[];
  useCases?: string[];
  skillLevel?: string[];
  transmission?: string[];
  driveType?: string[];
  powerToWeightRange?: [number, number];
  isEntryLevel?: boolean | null;
  coolingSystem?: string[];
  licenseLevelFilter?: string[];
  priceRange?: [number, number];
  hasSmartFeatures?: boolean | null;
  fuelCapacityRange?: [number, number];
  topSpeedRange?: [number, number];
  torqueRange?: [number, number];
  advancedSearch?: {
    engineType?: string[];
    cylinderCount?: number[];
    brakeType?: string[];
    frameType?: string[];
    suspensionType?: string[];
  };
}

export interface MotorcycleFilterUpdates {
  searchTerm?: string;
  categories?: MotorcycleCategory[];
  make?: string;
  yearRange?: [number, number];
  engineSizeRange?: [number, number];
  difficultyLevel?: number;
  weightRange?: [number, number];
  seatHeightRange?: [number, number];
  abs?: boolean | null;
  styleTags?: string[];
  useCases?: string[];
  skillLevel?: string[];
  transmission?: string[];
  driveType?: string[];
  powerToWeightRange?: [number, number];
  isEntryLevel?: boolean | null;
  coolingSystem?: string[];
  licenseLevelFilter?: string[];
  priceRange?: [number, number];
  hasSmartFeatures?: boolean | null;
  fuelCapacityRange?: [number, number];
  topSpeedRange?: [number, number];
  torqueRange?: [number, number];
  advancedSearch?: {
    engineType?: string[];
    cylinderCount?: number[];
    brakeType?: string[];
    frameType?: string[];
    suspensionType?: string[];
  };
}

export interface MotorcycleModel {
  id: string;
  brand_id: string;
  name: string;
  type: string;
  base_description: string;
  production_start_year: number;
  production_end_year?: number;
  production_status: string;
  default_image_url: string;
  slug: string;
  ignore_autofill?: boolean;
  brand?: any;
  years?: ModelYear[];
}

export interface ModelYear {
  id: string;
  motorcycle_id: string;
  year: number;
  changes?: string;
  image_url?: string;
  msrp_usd?: number;
  marketing_tagline?: string;
  is_available?: boolean;
  configurations?: Configuration[];
  engine_id?: string;
  abs_id?: string;
  frame_id?: string;
  suspension_id?: string;
  wheel_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Configuration {
  id: string;
  model_year_id: string;
  name?: string;
  engine_id?: string;
  brake_system_id?: string;
  frame_id?: string;
  suspension_id?: string;
  wheel_id?: string;
  seat_height_mm?: number;
  weight_kg?: number;
  wheelbase_mm?: number;
  fuel_capacity_l?: number;
  ground_clearance_mm?: number;
  is_default?: boolean;
  trim_level?: string;
  market_region?: string;
  price_premium_usd?: number;
  image_url?: string;
  color_id?: string;
  optional_equipment?: string[];
  special_features?: string[];
  created_at?: string;
  updated_at?: string;
  
  // Related components
  engine?: any;
  brakes?: any;
  frame?: any;
  suspension?: any;
  wheels?: any;
  colors?: any[];
}

export interface ModelComparison {
  models: (MotorcycleModel & {
    selectedYear: ModelYear;
    selectedConfig: Configuration;
  })[];
}

// New interfaces for motorcycle tags
export interface MotorcycleTag {
  id: string;
  name: string;
  category: string;
  description?: string;
  color_hex: string;
  icon?: string;
  created_at: string;
  updated_at: string;
}

export interface MotorcycleModelTag {
  motorcycle_id: string;
  tag_id: string;
  motorcycle_tags: MotorcycleTag;
}
