
import { Motorcycle } from "@/types";

// Transform raw database data to Motorcycle interface
export const transformMotorcycleData = (rawData: any): Motorcycle => {
  return {
    id: rawData.id,
    name: rawData.name || `${rawData.make} ${rawData.model}`,
    slug: rawData.slug || `${rawData.make}-${rawData.model}`.toLowerCase().replace(/\s+/g, '-'),
    brand_id: rawData.brand_id,
    type: rawData.type || rawData.category || 'Standard',
    is_draft: rawData.is_draft ?? false,
    make: rawData.make,
    model: rawData.model || rawData.name,
    year: rawData.year,
    category: rawData.category || rawData.type,
    style_tags: rawData.style_tags || [],
    difficulty_level: rawData.difficulty_level || 1,
    image_url: rawData.image_url || rawData.default_image_url || '',
    engine_size: rawData.engine_size || rawData.displacement_cc || 0,
    horsepower: rawData.horsepower || rawData.power_hp || 0,
    weight_kg: rawData.weight_kg || 0,
    seat_height_mm: rawData.seat_height_mm || 0,
    abs: rawData.abs || rawData.has_abs || false,
    top_speed_kph: rawData.top_speed_kph || 0,
    torque_nm: rawData.torque_nm || 0,
    wheelbase_mm: rawData.wheelbase_mm || 0,
    ground_clearance_mm: rawData.ground_clearance_mm || 0,
    fuel_capacity_l: rawData.fuel_capacity_l || 0,
    smart_features: rawData.smart_features || [],
    summary: rawData.summary || rawData.description || rawData.base_description || '',
    created_at: rawData.created_at,
    updated_at: rawData.updated_at,
    is_placeholder: rawData.is_placeholder || false,
    migration_status: rawData.migration_status || 'none'
  };
};

// Transform with brand information
export const transformMotorcycleWithBrand = (rawData: any): Motorcycle => {
  const baseTransform = transformMotorcycleData(rawData);
  
  // Handle brand relationship
  if (rawData.brands) {
    const brand = Array.isArray(rawData.brands) ? rawData.brands[0] : rawData.brands;
    if (brand) {
      baseTransform.make = brand.name;
      baseTransform.brand_id = brand.id;
    }
  }
  
  return baseTransform;
};

// Transform for admin display
export const transformForAdminDisplay = (rawData: any): Motorcycle => {
  const baseTransform = transformMotorcycleWithBrand(rawData);
  
  return {
    ...baseTransform,
    // Add any admin-specific transformations here
    migration_status: rawData.migration_status || 'none',
    is_placeholder: rawData.is_placeholder || false
  };
};

// Transform multiple motorcycles
export const transformMotorcycles = (rawDataArray: any[]): Motorcycle[] => {
  return rawDataArray.map(transformMotorcycleData);
};

// Normalize motorcycle data for consistency
export const normalizeMotorcycleData = (motorcycle: Motorcycle): Motorcycle => {
  return {
    ...motorcycle,
    // Ensure required fields have sensible defaults
    name: motorcycle.name || `${motorcycle.make} ${motorcycle.model}`,
    slug: motorcycle.slug || `${motorcycle.make}-${motorcycle.model}`.toLowerCase().replace(/\s+/g, '-'),
    type: motorcycle.type || motorcycle.category || 'Standard',
    category: motorcycle.category || motorcycle.type || 'Standard',
    style_tags: motorcycle.style_tags || [],
    smart_features: motorcycle.smart_features || [],
    difficulty_level: motorcycle.difficulty_level || 1,
    engine_size: motorcycle.engine_size || 0,
    horsepower: motorcycle.horsepower || 0,
    weight_kg: motorcycle.weight_kg || 0,
    seat_height_mm: motorcycle.seat_height_mm || 0,
    abs: motorcycle.abs || false,
    summary: motorcycle.summary || ''
  };
};

// Enhanced ComponentData interface
export interface ComponentData {
  id: string;
  type: string;
  data: any;
  configurations?: any[];
  components?: {
    engines: any[];
    brakes: any[];
    frames: any[];
    suspensions: any[];
    wheels: any[];
  };
  model_assignments?: any[];
}

// Main transform function for motorcycles (single export to avoid redeclaration)
export const transformToMotorcycle = (model: any): Motorcycle => {
  return transformMotorcycleWithBrand(model);
};
