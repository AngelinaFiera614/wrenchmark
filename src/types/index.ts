
export type MotorcycleCategory = "Sport" | "Cruiser" | "Touring" | "Adventure" | "Naked" | "Dual-sport" | "Standard" | "Scooter" | "Off-road";

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
  ground_clearance_mm: number; // Added missing property
  fuel_capacity_l: number;
  smart_features: string[];
  summary: string;
  slug?: string;
  // Adding aliases for compatibility with existing code
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
  // Adding aliases for components that expect these properties
  logo?: string;
  knownFor?: string[];
  description?: string;
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
  styleTags?: string[]; // Add styleTags for compatibility
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
