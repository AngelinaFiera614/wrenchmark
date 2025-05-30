
import { Motorcycle } from "@/types";

export const transformMotorcycleData = (rawData: any): Motorcycle => {
  console.log("=== STARTING transformMotorcycleData DEBUG ===");
  console.log("Transforming motorcycle data:", rawData);
  
  // Handle brand data - it should come from the brands relationship
  const brandData = rawData.brands || {};
  console.log("Brand data from relationship:", brandData);
  
  const brandName = brandData.name || rawData.brand_name || 'Unknown Brand';
  console.log("Resolved brand name:", brandName);
  
  // Create the transformed motorcycle object
  const transformed: Motorcycle = {
    id: rawData.id,
    make: brandName,
    brand_id: rawData.brand_id,
    model: rawData.name || 'Unknown Model',
    year: rawData.production_start_year || new Date().getFullYear(),
    category: rawData.category || rawData.type || 'Standard',
    style_tags: [], // Will be populated from tags relationship if available
    difficulty_level: rawData.difficulty_level || 3,
    image_url: rawData.default_image_url || '/placeholder.svg',
    engine_size: rawData.engine_size || 0,
    horsepower: rawData.horsepower || 0,
    weight_kg: rawData.weight_kg || 0,
    wet_weight_kg: rawData.wet_weight_kg,
    seat_height_mm: rawData.seat_height_mm || 0,
    abs: rawData.has_abs || false,
    top_speed_kph: rawData.top_speed_kph || 0,
    torque_nm: rawData.torque_nm || 0,
    wheelbase_mm: rawData.wheelbase_mm || 0,
    ground_clearance_mm: rawData.ground_clearance_mm || 0,
    fuel_capacity_l: rawData.fuel_capacity_l || 0,
    smart_features: [],
    summary: rawData.summary || rawData.base_description || '',
    slug: rawData.slug,
    created_at: rawData.created_at,
    is_placeholder: false,
    migration_status: 'migrated',
    status: rawData.status || rawData.production_status,
    engine: `${rawData.engine_size || 0}cc`,
    is_draft: rawData.is_draft || false,
    
    // Enhanced technical fields
    transmission: rawData.transmission,
    drive_type: rawData.drive_type,
    cooling_system: rawData.cooling_system,
    power_to_weight_ratio: rawData.power_to_weight_ratio,
    is_entry_level: rawData.is_entry_level,
    recommended_license_level: rawData.recommended_license_level,
    use_cases: rawData.use_cases || [],
    
    // Compatibility aliases for legacy code
    engine_cc: rawData.engine_size,
    displacement_cc: rawData.engine_size,
    horsepower_hp: rawData.horsepower,
    
    // Enhanced engine information
    power_rpm: rawData.power_rpm,
    torque_rpm: rawData.torque_rpm,
    engine_type: rawData.engine_type,
    cylinder_count: rawData.cylinder_count,
    
    // Enhanced brake system information
    brake_type: rawData.brake_type,
    has_abs: rawData.has_abs,
  };
  
  console.log("Transformed motorcycle:", transformed);
  console.log("=== END transformMotorcycleData DEBUG ===");
  return transformed;
};

export const createPlaceholderMotorcycleData = (input: {
  make: string;
  model: string;
  year: number;
  isDraft?: boolean;
}) => {
  const slug = `${input.make}-${input.model}-${input.year}`.toLowerCase().replace(/\s+/g, '-');
  
  return {
    name: input.model,
    type: 'Standard',
    base_description: `${input.year} ${input.make} ${input.model}`,
    production_start_year: input.year,
    production_status: 'active',
    default_image_url: '/placeholder.svg',
    slug: slug,
    is_draft: input.isDraft || false,
    // Basic technical data with defaults
    engine_size: 600,
    horsepower: 50,
    torque_nm: 45,
    weight_kg: 180,
    seat_height_mm: 800,
    wheelbase_mm: 1400,
    ground_clearance_mm: 150,
    fuel_capacity_l: 15,
    top_speed_kph: 180,
    has_abs: true,
    difficulty_level: 3,
    category: 'Standard',
    summary: `The ${input.year} ${input.make} ${input.model} is a versatile motorcycle suitable for various riding conditions.`,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

export const createDraftMotorcycleData = (input: {
  make: string;
  model: string;
  year: number;
}) => {
  return createPlaceholderMotorcycleData({
    ...input,
    isDraft: true,
  });
};
