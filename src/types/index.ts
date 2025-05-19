
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
  // Compatibility aliases
  engine_cc?: number;
  horsepower_hp?: number;
}

export interface Brand {
  id: string;
  name: string;
  country: string;
  founded: number;
  logo_url: string;
  known_for: string[];
  slug?: string;
  
  // New fields
  description?: string;
  founded_city?: string;
  headquarters?: string;
  status?: "active" | "defunct" | "revived";
  brand_type?: "mass" | "boutique" | "revived" | "oem";
  is_electric?: boolean;
  website_url?: string;
  categories?: string[];
  notes?: string;
  
  // Aliases for compatibility
  logo?: string;
  knownFor?: string[];
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

export type ManualType = "owner" | "service" | "wiring";

export interface Manual {
  id: string;
  title: string;
  manual_type: ManualType;
  file_url: string;
  file_size_mb: number | null;
  motorcycle_id: string;
  year: number | null;
  downloads: number;
  created_at?: string;
  updated_at?: string;
}

export interface ManualUpload {
  title: string;
  manual_type: ManualType;
  motorcycle_id: string;
  year: number | null;
  file_size_mb: number | null;
}

export interface MotorcyclePlaceholder {
  make: string;
  model: string;
  year: number;
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

export interface Engine {
  id: string;
  name: string;
  displacement_cc: number;
  cooling: string;
  cylinder_count: number;
  valve_count: number;
  power_hp: number;
  torque_nm: number;
  engine_type: string;
}

export interface BrakeSystem {
  id: string;
  type: string;
  has_traction_control: boolean;
  brake_type_front: string;
  brake_type_rear: string;
  notes?: string;
}

export interface Frame {
  id: string;
  type: string;
  material: string;
  notes?: string;
}

export interface Suspension {
  id: string;
  front_type: string;
  rear_type: string;
  adjustability?: string;
  brand?: string;
}

export interface Wheel {
  id: string;
  type: string;
  front_size: string;
  rear_size: string;
  notes?: string;
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

export interface ColorOption {
  id: string;
  motorcycle_id: string;
  year_id: string;
  name: string;
  hex_code?: string;
  image_url?: string;
  is_limited: boolean;
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
