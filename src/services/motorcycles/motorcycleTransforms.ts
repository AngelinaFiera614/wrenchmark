import { Motorcycle } from "@/types";

// Simplified data extraction with better fallbacks
const extractEngineData = (configuration: any, fallbackData: any = {}) => {
  const engine = configuration?.engines || configuration?.engine;
  
  // Use component data if available, otherwise fallback to model-level data
  const displacement = engine?.displacement_cc || fallbackData.engine_size || 0;
  const power = engine?.power_hp || fallbackData.horsepower || 0;
  const torque = engine?.torque_nm || fallbackData.torque_nm || 0;
  
  return {
    engine_size: displacement,
    displacement_cc: displacement,
    engine_cc: displacement,
    horsepower: power,
    horsepower_hp: power,
    torque_nm: torque,
    engine_type: engine?.engine_type || fallbackData.engine_type || null,
    cylinder_count: engine?.cylinder_count || fallbackData.cylinder_count || null,
    cooling_system: engine?.cooling || fallbackData.cooling_system || null,
    power_rpm: engine?.power_rpm || fallbackData.power_rpm || null,
    torque_rpm: engine?.torque_rpm || fallbackData.torque_rpm || null,
  };
};

const extractBrakeData = (configuration: any, fallbackData: any = {}) => {
  const brakes = configuration?.brake_systems || configuration?.brakes;
  
  return {
    abs: brakes?.has_traction_control || fallbackData.has_abs || false,
    has_abs: brakes?.has_traction_control || fallbackData.has_abs || false,
    brake_type: brakes?.type || fallbackData.brake_type || null,
  };
};

const extractDimensionData = (configuration: any, fallbackData: any = {}) => {
  // Prefer configuration data, fallback to model-level data
  const seat_height_mm = configuration?.seat_height_mm || fallbackData.seat_height_mm || 0;
  const weight_kg = configuration?.weight_kg || fallbackData.weight_kg || 0;
  const wheelbase_mm = configuration?.wheelbase_mm || fallbackData.wheelbase_mm || 0;
  const ground_clearance_mm = configuration?.ground_clearance_mm || fallbackData.ground_clearance_mm || 0;
  const fuel_capacity_l = configuration?.fuel_capacity_l || fallbackData.fuel_capacity_l || 0;

  return {
    seat_height_mm,
    weight_kg,
    wheelbase_mm,
    ground_clearance_mm,
    fuel_capacity_l,
    // Imperial conversions
    seat_height_in: seat_height_mm ? (seat_height_mm / 25.4) : 0,
    weight_lbs: weight_kg ? (weight_kg * 2.20462) : 0,
    wheelbase_in: wheelbase_mm ? (wheelbase_mm / 25.4) : 0,
    ground_clearance_in: ground_clearance_mm ? (ground_clearance_mm / 25.4) : 0,
    fuel_capacity_gal: fuel_capacity_l ? (fuel_capacity_l * 0.264172) : 0,
  };
};

const selectBestConfiguration = (configurations: any[]) => {
  if (!configurations || configurations.length === 0) {
    return null;
  }

  // Find default configuration first
  let best = configurations.find(c => c.is_default);
  
  // If no default, find one with most complete data
  if (!best) {
    best = configurations.find(c => {
      const engine = c.engines || c.engine;
      return engine && (engine.displacement_cc > 0 || engine.power_hp > 0);
    });
  }

  // Fallback to first configuration
  return best || configurations[0];
};

export const transformMotorcycleData = (rawData: any): Motorcycle => {
  console.log("=== transformMotorcycleData ===");
  console.log("Processing motorcycle:", rawData.name);
  
  try {
    // Extract brand data with fallback
    const brandName = rawData.brands?.name || 'Unknown Brand';
    
    // Process model years and configurations
    const modelYears = rawData.years || [];
    const allConfigurations = modelYears.flatMap(year => 
      (year.configurations || []).map(config => ({
        ...config,
        model_year: year
      }))
    );
    
    // Select the best configuration
    const bestConfiguration = selectBestConfiguration(allConfigurations);
    
    // Extract data using the best configuration with fallbacks to model-level data
    const engineData = extractEngineData(bestConfiguration, rawData);
    const brakeData = extractBrakeData(bestConfiguration, rawData);
    const dimensionData = extractDimensionData(bestConfiguration, rawData);
    const colorOptions = modelYears.flatMap(year => year.color_options || []);

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
      
      // Other fields with fallbacks
      wet_weight_kg: rawData.wet_weight_kg || null,
      smart_features: [],
      summary: rawData.summary || rawData.base_description || '',
      slug: rawData.slug,
      created_at: rawData.created_at,
      is_placeholder: false,
      migration_status: 'migrated',
      status: rawData.status || rawData.production_status || 'active',
      engine: `${engineData.engine_size || 0}cc`,
      is_draft: rawData.is_draft || false,
      transmission: rawData.transmission,
      drive_type: rawData.drive_type,
      cooling_system: rawData.cooling_system,
      power_to_weight_ratio: rawData.power_to_weight_ratio,
      is_entry_level: rawData.is_entry_level,
      recommended_license_level: rawData.recommended_license_level,
      use_cases: rawData.use_cases || [],
      
      // Store component data for detailed views
      _componentData: {
        engine: bestConfiguration?.engines || bestConfiguration?.engine,
        brakes: bestConfiguration?.brake_systems || bestConfiguration?.brakes,
        frame: bestConfiguration?.frames || bestConfiguration?.frame,
        suspension: bestConfiguration?.suspensions || bestConfiguration?.suspension,
        wheels: bestConfiguration?.wheels || bestConfiguration?.wheel,
        configurations: allConfigurations,
        colorOptions: colorOptions,
        selectedConfiguration: bestConfiguration
      }
    };
    
    console.log(`Successfully transformed ${transformed.make} ${transformed.model}`);
    return transformed;
  } catch (error) {
    console.error(`Error transforming motorcycle data for ${rawData.name}:`, error);
    
    // Return a basic motorcycle with minimal data instead of failing
    return {
      id: rawData.id,
      make: rawData.brands?.name || 'Unknown Brand',
      brand_id: rawData.brand_id,
      model: rawData.name || 'Unknown Model',
      year: rawData.production_start_year || new Date().getFullYear(),
      category: rawData.category || rawData.type || 'Standard',
      style_tags: [],
      difficulty_level: rawData.difficulty_level || 3,
      image_url: rawData.default_image_url || '/placeholder.svg',
      engine_size: rawData.engine_size || 0,
      horsepower: rawData.horsepower || 0,
      weight_kg: rawData.weight_kg || 0,
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
      migration_status: 'incomplete_data',
      status: rawData.status || 'active',
      engine: `${rawData.engine_size || 0}cc`,
      is_draft: rawData.is_draft || false,
      use_cases: [],
      _componentData: {
        configurations: [],
        colorOptions: [],
        selectedConfiguration: null
      }
    };
  }
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
