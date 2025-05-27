
import { Motorcycle } from "@/types";

export const transformMotorcycleData = (motorcycle: any): Motorcycle => {
  return {
    ...motorcycle,
    make: motorcycle.brand?.name || "Unknown",
    model: motorcycle.model_name || "Unknown",
    engine_size: motorcycle.engine_cc || motorcycle.horsepower_hp || 0,
    horsepower: motorcycle.horsepower_hp || 0,
    engine_cc: motorcycle.engine_cc || motorcycle.horsepower_hp || 0,
    horsepower_hp: motorcycle.horsepower_hp || 0,
    abs: motorcycle.has_abs || false, // Fixed: properly map has_abs to abs
    style_tags: motorcycle.tags || [],
    smart_features: motorcycle.smart_features || [],
    // Ensure we have a slug for routing
    slug: motorcycle.slug || generateSlugFromMotorcycle(motorcycle)
  };
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
    category: 'Standard',
    tags: [],
    difficulty_level: 3,
    horsepower_hp: 0,
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
