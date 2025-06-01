
import { Motorcycle } from "@/types";

export const transformMotorcycleData = (rawData: any): Motorcycle => {
  console.log("=== STARTING transformMotorcycleData DEBUG ===");
  console.log("Transforming motorcycle data:", rawData);
  
  // Handle brand data - it should come from the brands relationship
  const brandData = rawData.brands || {};
  console.log("Brand data from relationship:", brandData);
  
  const brandName = brandData.name || rawData.brand_name || 'Unknown Brand';
  console.log("Resolved brand name:", brandName);
  
  // Extract component data from configurations if available
  const configurations = rawData.configurations || [];
  const defaultConfig = configurations.find(c => c.is_default) || configurations[0];
  console.log("Default configuration found:", defaultConfig);
  
  // Extract engine data with proper type checking
  let engineData: any = {};
  if (defaultConfig?.engines) {
    engineData = {
      engine_size: defaultConfig.engines.displacement_cc || rawData.engine_size,
      horsepower: defaultConfig.engines.power_hp || rawData.horsepower,
      torque_nm: defaultConfig.engines.torque_nm || rawData.torque_nm,
      engine_type: defaultConfig.engines.engine_type,
      cylinder_count: defaultConfig.engines.cylinder_count,
      cooling_system: defaultConfig.engines.cooling,
      power_rpm: defaultConfig.engines.power_rpm,
      torque_rpm: defaultConfig.engines.torque_rpm,
    };
  }
  
  // Extract brake data with proper type checking
  let brakeData: any = {};
  if (defaultConfig?.brake_systems) {
    brakeData = {
      abs: defaultConfig.brake_systems.has_traction_control || rawData.has_abs,
      brake_type: defaultConfig.brake_systems.type,
    };
  }
  
  // Extract dimensions from configuration with proper type checking
  let dimensionData: any = {};
  if (defaultConfig) {
    dimensionData = {
      seat_height_mm: defaultConfig.seat_height_mm || rawData.seat_height_mm,
      weight_kg: defaultConfig.weight_kg || rawData.weight_kg,
      wheelbase_mm: defaultConfig.wheelbase_mm || rawData.wheelbase_mm,
      ground_clearance_mm: defaultConfig.ground_clearance_mm || rawData.ground_clearance_mm,
      fuel_capacity_l: defaultConfig.fuel_capacity_l || rawData.fuel_capacity_l,
    };
  }
  
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
    
    // Use component data if available, fallback to model data
    engine_size: engineData.engine_size || rawData.engine_size || 0,
    horsepower: engineData.horsepower || rawData.horsepower || 0,
    torque_nm: engineData.torque_nm || rawData.torque_nm || 0,
    weight_kg: dimensionData.weight_kg || rawData.weight_kg || 0,
    seat_height_mm: dimensionData.seat_height_mm || rawData.seat_height_mm || 0,
    wheelbase_mm: dimensionData.wheelbase_mm || rawData.wheelbase_mm || 0,
    ground_clearance_mm: dimensionData.ground_clearance_mm || rawData.ground_clearance_mm || 0,
    fuel_capacity_l: dimensionData.fuel_capacity_l || rawData.fuel_capacity_l || 0,
    
    wet_weight_kg: rawData.wet_weight_kg,
    abs: brakeData.abs || rawData.has_abs || false,
    top_speed_kph: rawData.top_speed_kph || 0,
    smart_features: [],
    summary: rawData.summary || rawData.base_description || '',
    slug: rawData.slug,
    created_at: rawData.created_at,
    is_placeholder: false,
    migration_status: 'migrated',
    status: rawData.status || rawData.production_status,
    engine: `${engineData.engine_size || rawData.engine_size || 0}cc`,
    is_draft: rawData.is_draft || false,
    
    // Enhanced technical fields from components
    transmission: rawData.transmission,
    drive_type: rawData.drive_type,
    cooling_system: engineData.cooling_system || rawData.cooling_system,
    power_to_weight_ratio: rawData.power_to_weight_ratio,
    is_entry_level: rawData.is_entry_level,
    recommended_license_level: rawData.recommended_license_level,
    use_cases: rawData.use_cases || [],
    
    // Compatibility aliases for legacy code
    engine_cc: engineData.engine_size || rawData.engine_size,
    displacement_cc: engineData.engine_size || rawData.engine_size,
    horsepower_hp: engineData.horsepower || rawData.horsepower,
    
    // Enhanced engine information from components
    power_rpm: engineData.power_rpm,
    torque_rpm: engineData.torque_rpm,
    engine_type: engineData.engine_type,
    cylinder_count: engineData.cylinder_count,
    
    // Enhanced brake system information from components
    brake_type: brakeData.brake_type,
    has_abs: brakeData.abs || rawData.has_abs,
    
    // Store component references for detailed views
    _componentData: {
      engine: defaultConfig?.engines,
      brakes: defaultConfig?.brake_systems,
      frame: defaultConfig?.frames,
      suspension: defaultConfig?.suspensions,
      wheels: defaultConfig?.wheels,
      configurations: configurations
    }
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
