
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
  horsepower_hp?: number;
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
  production_status: string; // Changed from union type to string to match what the database returns
  default_image_url: string;
  slug: string;
  brand?: any; // Will be populated with brand data in queries
  years?: ModelYear[]; // Will be populated with year data in queries
}

export interface ModelYear {
  id: string;
  motorcycle_id: string;
  year: number;
  changes?: string;
  image_url?: string;
  msrp_usd?: number;
  configurations?: Configuration[]; // Will be populated with configuration data in queries
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
  colors?: any[]; // Will be populated with color data in queries
  engine?: any; // Will be populated with engine data in queries
  brakes?: any; // Will be populated with brake data in queries
  frame?: any; // Will be populated with frame data in queries
  suspension?: any; // Will be populated with suspension data in queries
  wheels?: any; // Will be populated with wheel data in queries
  accessories?: any[]; // Will be populated with compatible accessories in queries
}

// Add types for model comparison
export interface ModelComparison {
  models: (MotorcycleModel & {
    selectedYear: ModelYear;
    selectedConfig: Configuration;
  })[];
}
