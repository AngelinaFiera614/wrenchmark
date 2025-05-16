
export type MotorcycleCategory = "Sport" | "Cruiser" | "Touring" | "Adventure" | "Naked" | "Dirt" | "Standard" | "Scooter";

export interface Motorcycle {
  id: string;
  make: string;
  brand_id?: string; // New field for Supabase foreign key
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
  fuel_capacity_l: number;
  smart_features: string[];
  summary: string;
  slug?: string; // New field for URLs
}

export interface Brand {
  id: string;
  name: string;
  country: string;
  founded: number;
  logo_url: string;
  known_for: string[];
  slug?: string; // New field for URLs
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
}
