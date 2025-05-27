
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
  
  // Compatibility aliases
  engine_cc?: number;
  displacement_cc?: number;
  horsepower_hp?: number;
  
  // US Standard fields
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
}

// New schema types for the normalized database
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
  configurations?: Configuration[];
  engine_id?: string;
  abs_id?: string;
  frame_id?: string;
  suspension_id?: string;
  wheel_id?: string;
}

export interface Configuration {
  id: string;
  model_year_id: string;
  name: string;
  engine_id: string;
  brake_system_id: string;
  frame_id: string;
  suspension_id: string;
  wheel_id: string;
  color_id?: string;
  seat_height_mm?: number;
  weight_kg?: number;
  wheelbase_mm?: number;
  fuel_capacity_l?: number;
  ground_clearance_mm?: number;
  image_url?: string;
  is_default: boolean;
  trim_level?: string;
  colors?: any[];
  engine?: any;
  brakes?: any;
  frame?: any;
  suspension?: any;
  wheels?: any;
  accessories?: any[];
}

// Add types for model comparison
export interface ModelComparison {
  models: (MotorcycleModel & {
    selectedYear: ModelYear;
    selectedConfig: Configuration;
  })[];
}
