
import { Motorcycle } from "@/types";

export const transformMotorcycleData = (rawData: any): Motorcycle => {
  return {
    id: rawData.id,
    make: rawData.make || rawData.brand?.name || "",
    brand_id: rawData.brand_id,
    model: rawData.model || rawData.name,
    year: rawData.year || rawData.production_start_year || new Date().getFullYear(),
    category: rawData.category || rawData.type || "Standard",
    style_tags: [],
    difficulty_level: rawData.difficulty_level || 1,
    image_url: rawData.image_url || rawData.default_image_url || "",
    engine_size: rawData.engine_size || rawData.displacement_cc || 0,
    horsepower: rawData.horsepower || rawData.power_hp || 0,
    weight_kg: rawData.weight_kg || 0,
    seat_height_mm: rawData.seat_height_mm || 0,
    abs: rawData.has_abs || false,
    top_speed_kph: rawData.top_speed_kph || 0,
    torque_nm: rawData.torque_nm || 0,
    wheelbase_mm: rawData.wheelbase_mm || 0,
    ground_clearance_mm: rawData.ground_clearance_mm || 0,
    fuel_capacity_l: rawData.fuel_capacity_l || 0,
    smart_features: [],
    summary: rawData.summary || rawData.base_description || "",
    slug: rawData.slug,
    created_at: rawData.created_at,
    is_placeholder: rawData.is_placeholder || false,
    migration_status: rawData.migration_status || "migrated",
    status: rawData.status || rawData.production_status,
    engine: rawData.engine || `${rawData.engine_size || 0}cc`,
    
    // Compatibility aliases
    engine_cc: rawData.engine_size || rawData.displacement_cc,
    displacement_cc: rawData.engine_size || rawData.displacement_cc,
    horsepower_hp: rawData.horsepower || rawData.power_hp,
  };
};

export const createPlaceholderMotorcycleData = (motorcycleData: {
  make: string;
  model: string;
  year: number;
}) => {
  return {
    name: motorcycleData.model,
    type: "Standard",
    production_start_year: motorcycleData.year,
    production_status: "active",
    slug: `${motorcycleData.make.toLowerCase()}-${motorcycleData.model.toLowerCase()}-${motorcycleData.year}`.replace(/\s+/g, '-'),
    brand_id: null, // This should be set based on the make
    base_description: `${motorcycleData.make} ${motorcycleData.model} ${motorcycleData.year}`,
    is_placeholder: true,
  };
};
