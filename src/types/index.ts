
// Primary motorcycle type
export interface Motorcycle {
  id: string;
  make: string;
  model: string;
  year: number;
  engine_cc: number;
  horsepower_hp: number;
  torque_nm: number;
  top_speed_kph: number;
  category: MotorcycleCategory;
  style_tags: string[];
  difficulty_level: number;
  weight_kg: number;
  seat_height_mm: number;
  wheelbase_mm: number;
  ground_clearance_mm: number;
  fuel_capacity_l: number;
  abs: boolean;
  smart_features: string[];
  image_url: string;
  summary: string;
  created_at: string;
}

// Category enum
export type MotorcycleCategory = 
  | 'Sport'
  | 'Cruiser'
  | 'Touring'
  | 'Adventure'
  | 'Naked'
  | 'Dual-sport'
  | 'Standard'
  | 'Scooter'
  | 'Off-road';

// Filter type
export interface MotorcycleFilters {
  categories: MotorcycleCategory[];
  make: string;
  yearRange: [number, number];
  engineSizeRange: [number, number];
  difficultyLevel: number;
  weightRange: [number, number];
  seatHeightRange: [number, number];
  styleTags: string[];
  abs: boolean | null;
  searchTerm: string;
}

// For future user-related features
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface SavedMotorcycle {
  userId: string;
  motorcycleId: string;
  saved_at: string;
  notes?: string;
}

export interface MaintenanceLog {
  id: string;
  motorcycle_id: string;
  date: string;
  action: string;
  notes: string;
}
