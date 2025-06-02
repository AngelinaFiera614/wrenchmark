import { Motorcycle } from "@/types";

// Enhanced data extraction utilities
const extractEngineData = (configuration: any, fallbackData: any = {}) => {
  const engine = configuration?.engines;
  
  if (engine) {
    return {
      engine_size: engine.displacement_cc || 0,
      displacement_cc: engine.displacement_cc || 0,
      engine_cc: engine.displacement_cc || 0,
      horsepower: engine.power_hp || 0,
      horsepower_hp: engine.power_hp || 0,
      torque_nm: engine.torque_nm || 0,
      engine_type: engine.engine_type || null,
      cylinder_count: engine.cylinder_count || null,
      cooling_system: engine.cooling || null,
      power_rpm: engine.power_rpm || null,
      torque_rpm: engine.torque_rpm || null,
    };
  }

  // Fallback to model-level data
  return {
    engine_size: fallbackData.engine_size || 0,
    displacement_cc: fallbackData.engine_size || 0,
    engine_cc: fallbackData.engine_size || 0,
    horsepower: fallbackData.horsepower || 0,
    horsepower_hp: fallbackData.horsepower || 0,
    torque_nm: fallbackData.torque_nm || 0,
    engine_type: fallbackData.engine_type || null,
    cylinder_count: fallbackData.cylinder_count || null,
    cooling_system: fallbackData.cooling_system || null,
    power_rpm: fallbackData.power_rpm || null,
    torque_rpm: fallbackData.torque_rpm || null,
  };
};

const extractBrakeData = (configuration: any, fallbackData: any = {}) => {
  const brakes = configuration?.brake_systems;
  
  if (brakes) {
    return {
      abs: brakes.has_traction_control || false,
      has_abs: brakes.has_traction_control || false,
      brake_type: brakes.type || null,
    };
  }

  return {
    abs: fallbackData.has_abs || false,
    has_abs: fallbackData.has_abs || false,
    brake_type: fallbackData.brake_type || null,
  };
};

const extractDimensionData = (configuration: any, fallbackData: any = {}) => {
  const dimensions = {
    seat_height_mm: configuration?.seat_height_mm || fallbackData.seat_height_mm || 0,
    weight_kg: configuration?.weight_kg || fallbackData.weight_kg || 0,
    wheelbase_mm: configuration?.wheelbase_mm || fallbackData.wheelbase_mm || 0,
    ground_clearance_mm: configuration?.ground_clearance_mm || fallbackData.ground_clearance_mm || 0,
    fuel_capacity_l: configuration?.fuel_capacity_l || fallbackData.fuel_capacity_l || 0,
  };

  // Add imperial conversions
  return {
    ...dimensions,
    seat_height_in: dimensions.seat_height_mm ? (dimensions.seat_height_mm / 25.4) : 0,
    weight_lbs: dimensions.weight_kg ? (dimensions.weight_kg * 2.20462) : 0,
    wheelbase_in: dimensions.wheelbase_mm ? (dimensions.wheelbase_mm / 25.4) : 0,
    ground_clearance_in: dimensions.ground_clearance_mm ? (dimensions.ground_clearance_mm / 25.4) : 0,
    fuel_capacity_gal: dimensions.fuel_capacity_l ? (dimensions.fuel_capacity_l * 0.264172) : 0,
  };
};

const selectBestConfiguration = (configurations: any[]) => {
  if (!configurations || configurations.length === 0) {
    return null;
  }

  // Priority order for configuration selection
  // 1. Configuration with complete engine AND dimension data
  let best = configurations.find(c => 
    c.engines?.displacement_cc > 0 && 
    c.engines?.power_hp > 0 &&
    c.seat_height_mm > 0 &&
    c.weight_kg > 0
  );

  // 2. Configuration with complete dimension data
  if (!best) {
    best = configurations.find(c => 
      c.seat_height_mm > 0 && c.weight_kg > 0
    );
  }

  // 3. Configuration with engine data
  if (!best) {
    best = configurations.find(c => 
      c.engines?.displacement_cc > 0 && c.engines?.power_hp > 0
    );
  }

  // 4. Default configuration
  if (!best) {
    best = configurations.find(c => c.is_default);
  }

  // 5. First configuration
  return best || configurations[0];
};

export const transformMotorcycleData = (rawData: any): Motorcycle => {
  console.log("=== transformMotorcycleData ===");
  console.log("Processing motorcycle:", rawData.name);
  
  // Extract brand data
  const brandName = rawData.brands?.name || 'Unknown Brand';
  
  // Process model years and configurations
  const modelYears = rawData.years || [];
  const allConfigurations = modelYears.flatMap(year => 
    (year.model_configurations || []).map(config => ({
      ...config,
      model_year: year
    }))
  );
  
  console.log(`Found ${allConfigurations.length} configurations for ${rawData.name}`);
  
  // Select the best configuration
  const bestConfiguration = selectBestConfiguration(allConfigurations);
  
  if (bestConfiguration) {
    console.log(`Selected configuration: ${bestConfiguration.name || bestConfiguration.id}`);
  }

  // Extract enhanced data using the best configuration
  const engineData = extractEngineData(bestConfiguration, rawData);
  const brakeData = extractBrakeData(bestConfiguration, rawData);
  const dimensionData = extractDimensionData(bestConfiguration, rawData);

  // Create the transformed motorcycle object
  const transformed: Motorcycle = {
    id: rawData.id,
    make: brandName,
    brand_id: rawData.brand_id,
    model: rawData.name || 'Unknown Model',
    year: rawData.production_start_year || new Date().getFullYear(),
    category: rawData.category || rawData.type || 'Standard',
    style_tags: [],
    difficulty_level: rawData.difficulty_level || 3,
    image_url: rawData.default_image_url || '/placeholder.svg',
    
    // Enhanced engine fields
    ...engineData,
    
    // Enhanced dimension fields
    ...dimensionData,
    
    // Enhanced brake fields
    ...brakeData,
    
    // Speed data with conversions
    top_speed_kph: rawData.top_speed_kph || 0,
    top_speed_mph: rawData.top_speed_kph ? (rawData.top_speed_kph * 0.621371) : 0,
    
    // Other fields
    wet_weight_kg: rawData.wet_weight_kg,
    smart_features: [],
    summary: rawData.summary || rawData.base_description || '',
    slug: rawData.slug,
    created_at: rawData.created_at,
    is_placeholder: false,
    migration_status: 'migrated',
    status: rawData.status || rawData.production_status,
    engine: `${engineData.engine_size || 0}cc`,
    is_draft: rawData.is_draft || false,
    transmission: rawData.transmission,
    drive_type: rawData.drive_type,
    power_to_weight_ratio: rawData.power_to_weight_ratio,
    is_entry_level: rawData.is_entry_level,
    recommended_license_level: rawData.recommended_license_level,
    use_cases: rawData.use_cases || [],
    
    // Store component references
    _componentData: {
      engine: bestConfiguration?.engines,
      brakes: bestConfiguration?.brake_systems,
      frame: bestConfiguration?.frames,
      suspension: bestConfiguration?.suspensions,
      wheels: bestConfiguration?.wheels,
      configurations: allConfigurations,
      colorOptions: [],
      selectedConfiguration: bestConfiguration
    }
  };
  
  console.log(`Transformed ${transformed.make} ${transformed.model}:`, {
    engine_size: transformed.engine_size,
    horsepower: transformed.horsepower,
    weight_kg: transformed.weight_kg,
    seat_height_mm: transformed.seat_height_mm
  });
  
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
    // Basic technical data with realistic defaults
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
