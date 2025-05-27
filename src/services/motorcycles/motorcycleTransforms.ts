
import { Motorcycle } from "@/types";

// Unit conversion utilities
const kgToLbs = (kg: number) => Math.round(kg * 2.20462);
const mmToInches = (mm: number) => Math.round((mm / 25.4) * 10) / 10;
const litersToGallons = (liters: number) => Math.round((liters * 0.264172) * 10) / 10;
const kphToMph = (kph: number) => Math.round(kph * 0.621371);

export const transformMotorcycleData = (motorcycle: any): Motorcycle => {
  const transformed = {
    ...motorcycle,
    make: motorcycle.brand?.name || "Unknown",
    model: motorcycle.model_name || "Unknown",
    // Map standardized columns
    engine_size: motorcycle.engine_size || 0,
    horsepower: motorcycle.horsepower || 0,
    // Legacy compatibility aliases
    engine_cc: motorcycle.engine_size,
    displacement_cc: motorcycle.engine_size,
    horsepower_hp: motorcycle.horsepower,
    abs: motorcycle.has_abs || false,
    style_tags: motorcycle.tags || [],
    smart_features: motorcycle.smart_features || [],
    slug: motorcycle.slug || generateSlugFromMotorcycle(motorcycle),
    // Calculate US units on the fly
    weight_lbs: motorcycle.weight_kg ? kgToLbs(motorcycle.weight_kg) : undefined,
    seat_height_in: motorcycle.seat_height_mm ? mmToInches(motorcycle.seat_height_mm) : undefined,
    wheelbase_in: motorcycle.wheelbase_mm ? mmToInches(motorcycle.wheelbase_mm) : undefined,
    ground_clearance_in: motorcycle.ground_clearance_mm ? mmToInches(motorcycle.ground_clearance_mm) : undefined,
    fuel_capacity_gal: motorcycle.fuel_capacity_l ? litersToGallons(motorcycle.fuel_capacity_l) : undefined,
    top_speed_mph: motorcycle.top_speed_kph ? kphToMph(motorcycle.top_speed_kph) : undefined,
  };

  return transformed;
};

export const generateSlugFromMotorcycle = (motorcycle: any): string => {
  return `${motorcycle.brand?.name || 'unknown'}-${motorcycle.model_name || 'unknown'}-${motorcycle.year || ''}`
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

export const createPlaceholderMotorcycleData = (motorcycleData: {
  make: string;
  model: string;
  year: number;
}): any => {
  const slug = `${motorcycleData.make}-${motorcycleData.model}-${motorcycleData.year}`
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return {
    model_name: motorcycleData.model,
    year: motorcycleData.year,
    slug: slug,
    is_placeholder: true,
    migration_status: 'migrated',
    category: 'Standard',
    difficulty_level: 3,
    horsepower: 0,
    engine_size: 0,
    weight_kg: 0,
    seat_height_mm: 0,
    has_abs: false,
    top_speed_kph: 0,
    torque_nm: 0,
    wheelbase_mm: 0,
    fuel_capacity_l: 0,
    summary: `${motorcycleData.make} ${motorcycleData.model} ${motorcycleData.year} - Placeholder entry`,
    image_url: ''
  };
};
