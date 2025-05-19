
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
  production_status: 'active' | 'discontinued' | 'revived' | 'concept' | 'limited';
  default_image_url: string;
  slug: string;
}

export interface ModelYear {
  id: string;
  motorcycle_id: string;
  year: number;
  changes?: string;
  engine_id?: string;
  abs_id?: string;
  frame_id?: string;
  suspension_id?: string;
  wheel_id?: string;
}

export interface Configuration {
  id: string;
  model_year_id: string;
  engine_id: string;
  abs_id: string;
  frame_id: string;
  suspension_id: string;
  wheel_id: string;
  color_id?: string;
  name?: string;
  is_default: boolean;
}

export interface ColorOption {
  id: string;
  motorcycle_id: string;
  year_id: string;
  name: string;
  hex_code?: string;
  image_url?: string;
  is_limited: boolean;
}
