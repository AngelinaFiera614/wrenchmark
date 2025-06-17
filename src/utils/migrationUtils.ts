
import { Motorcycle } from "@/types";

// Utility to check if a motorcycle needs migration
export const needsMigration = (motorcycle: Motorcycle): boolean => {
  // Check if motorcycle has any deprecated or missing fields
  if (motorcycle.migration_status === 'complete') {
    return false;
  }
  
  // Check for required fields
  const hasRequiredFields = !!(
    motorcycle.name &&
    motorcycle.slug &&
    motorcycle.brand_id &&
    motorcycle.type
  );
  
  return !hasRequiredFields;
};

// Transform legacy motorcycle data to new format
export const migrateLegacyMotorcycle = (legacyData: any): Motorcycle => {
  return {
    id: legacyData.id || `migrated-${Date.now()}`,
    name: legacyData.name || `${legacyData.make} ${legacyData.model}`,
    slug: legacyData.slug || `${legacyData.make}-${legacyData.model}`.toLowerCase().replace(/\s+/g, '-'),
    brand_id: legacyData.brand_id || legacyData.make?.toLowerCase().replace(/\s+/g, '-') || 'unknown',
    type: legacyData.type || legacyData.category || 'Standard',
    is_draft: legacyData.is_draft ?? true,
    make: legacyData.make || 'Unknown',
    model: legacyData.model || 'Unknown',
    year: legacyData.year || new Date().getFullYear(),
    category: legacyData.category || legacyData.type || 'Standard',
    style_tags: legacyData.style_tags || [],
    difficulty_level: legacyData.difficulty_level || 1,
    image_url: legacyData.image_url || legacyData.default_image_url || '',
    engine_size: legacyData.engine_size || legacyData.displacement_cc || 0,
    horsepower: legacyData.horsepower || legacyData.power_hp || 0,
    weight_kg: legacyData.weight_kg || 0,
    seat_height_mm: legacyData.seat_height_mm || 0,
    abs: legacyData.abs || legacyData.has_abs || false,
    top_speed_kph: legacyData.top_speed_kph || 0,
    torque_nm: legacyData.torque_nm || 0,
    wheelbase_mm: legacyData.wheelbase_mm || 0,
    ground_clearance_mm: legacyData.ground_clearance_mm || 0,
    fuel_capacity_l: legacyData.fuel_capacity_l || 0,
    smart_features: legacyData.smart_features || [],
    summary: legacyData.summary || legacyData.description || '',
    migration_status: 'migrated',
    created_at: legacyData.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};

// Batch migrate multiple motorcycles
export const batchMigrateMotorcycles = (legacyMotorcycles: any[]): Motorcycle[] => {
  return legacyMotorcycles.map(migrateLegacyMotorcycle);
};

// Validate migrated motorcycle data
export const validateMigratedMotorcycle = (motorcycle: Motorcycle): boolean => {
  const requiredFields = ['id', 'name', 'slug', 'brand_id', 'type'];
  
  for (const field of requiredFields) {
    if (!motorcycle[field as keyof Motorcycle]) {
      console.warn(`Missing required field: ${field}`, motorcycle);
      return false;
    }
  }
  
  return true;
};

// Clean up motorcycle data by removing invalid properties
export const cleanMotorcycleData = (motorcycle: any): Motorcycle => {
  // Define all valid Motorcycle interface properties
  const validProperties = [
    'id', 'name', 'slug', 'brand_id', 'type', 'is_draft', 'make', 'model', 'year',
    'category', 'style_tags', 'difficulty_level', 'image_url', 'engine_size',
    'horsepower', 'weight_kg', 'seat_height_mm', 'abs', 'top_speed_kph',
    'torque_nm', 'wheelbase_mm', 'ground_clearance_mm', 'fuel_capacity_l',
    'smart_features', 'summary', 'is_placeholder', 'migration_status',
    'created_at', 'updated_at', 'has_abs', 'torque_rpm', 'top_speed_mph',
    'engine_cc', 'displacement_cc', 'engine_type', 'cylinder_count',
    'horsepower_hp', 'power_rpm', 'brake_type', 'weight_lbs', 'seat_height_in',
    'wheelbase_in', 'ground_clearance_in', 'fuel_capacity_gal', 'is_entry_level',
    'power_to_weight_ratio', 'use_cases', 'wet_weight_kg', '_componentData'
  ];

  // Create clean object with only valid properties
  const cleanData: any = {};
  
  for (const prop of validProperties) {
    if (motorcycle[prop] !== undefined) {
      cleanData[prop] = motorcycle[prop];
    }
  }
  
  return cleanData as Motorcycle;
};
