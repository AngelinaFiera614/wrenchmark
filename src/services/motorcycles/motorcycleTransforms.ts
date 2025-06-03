
import { Motorcycle } from "@/types";

// Extract engine data from various sources with better fallbacks
const extractEngineData = (rawData: any, configurations: any[] = []) => {
  // Try to find the best configuration with engine data
  const configWithEngine = configurations.find(config => 
    config?.engines?.displacement_cc > 0 || config?.engine?.displacement_cc > 0
  );
  
  const engineSource = configWithEngine?.engines || configWithEngine?.engine || {};
  
  // Use configuration engine data first, then fallback to model-level data
  const displacement = engineSource.displacement_cc || rawData.engine_size || 0;
  const power = engineSource.power_hp || rawData.horsepower || 0;
  const torque = engineSource.torque_nm || rawData.torque_nm || 0;
  
  return {
    engine_size: displacement,
    displacement_cc: displacement,
    engine_cc: displacement,
    horsepower: power,
    horsepower_hp: power,
    torque_nm: torque,
    engine_type: engineSource.engine_type || rawData.engine_type || null,
    cylinder_count: engineSource.cylinder_count || rawData.cylinder_count || null,
    cooling_system: engineSource.cooling || rawData.cooling_system || null,
    power_rpm: engineSource.power_rpm || rawData.power_rpm || null,
    torque_rpm: engineSource.torque_rpm || rawData.torque_rpm || null,
  };
};

// Extract brake data with fallbacks
const extractBrakeData = (configurations: any[] = [], fallbackData: any = {}) => {
  const configWithBrakes = configurations.find(config => 
    config?.brake_systems || config?.brakes
  );
  
  const brakeSource = configWithBrakes?.brake_systems || configWithBrakes?.brakes || {};
  
  return {
    abs: brakeSource.has_traction_control || fallbackData.has_abs || false,
    has_abs: brakeSource.has_traction_control || fallbackData.has_abs || false,
    brake_type: brakeSource.type || fallbackData.brake_type || null,
  };
};

// Extract dimension data with fallbacks
const extractDimensionData = (configurations: any[] = [], fallbackData: any = {}) => {
  // Find configuration with the most complete dimension data
  const configWithDimensions = configurations.find(config => 
    config?.seat_height_mm > 0 || config?.weight_kg > 0
  ) || configurations[0];
  
  const seat_height_mm = configWithDimensions?.seat_height_mm || fallbackData.seat_height_mm || 0;
  const weight_kg = configWithDimensions?.weight_kg || fallbackData.weight_kg || 0;
  const wheelbase_mm = configWithDimensions?.wheelbase_mm || fallbackData.wheelbase_mm || 0;
  const ground_clearance_mm = configWithDimensions?.ground_clearance_mm || fallbackData.ground_clearance_mm || 0;
  const fuel_capacity_l = configWithDimensions?.fuel_capacity_l || fallbackData.fuel_capacity_l || 0;

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
    
    console.log(`Found ${allConfigurations.length} configurations for ${rawData.name}`);
    
    // Extract data using configurations with fallbacks to model-level data
    const engineData = extractEngineData(rawData, allConfigurations);
    const brakeData = extractBrakeData(allConfigurations, rawData);
    const dimensionData = extractDimensionData(allConfigurations, rawData);
    const colorOptions = modelYears.flatMap(year => year.color_options || []);

    // Determine data completeness
    const hasEngineData = engineData.engine_size > 0;
    const hasDimensionData = dimensionData.seat_height_mm > 0 || dimensionData.weight_kg > 0;
    const hasComponentData = allConfigurations.length > 0;
    
    console.log(`Data completeness for ${rawData.name}:`, {
      hasEngineData,
      hasDimensionData,
      hasComponentData,
      configurationsCount: allConfigurations.length
    });

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
      is_placeholder: !hasEngineData && !hasDimensionData,
      migration_status: hasComponentData ? 'migrated' : 'basic_data_only',
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
        configurations: allConfigurations,
        colorOptions: colorOptions,
        selectedConfiguration: allConfigurations.find(c => c.is_default) || allConfigurations[0],
        hasComponentData,
        dataCompleteness: {
          hasEngineData,
          hasDimensionData,
          hasComponentData,
          configurationsCount: allConfigurations.length
        }
      }
    };
    
    console.log(`Successfully transformed ${transformed.make} ${transformed.model}`);
    console.log(`Data status: placeholder=${transformed.is_placeholder}, migration=${transformed.migration_status}`);
    
    return transformed;
  } catch (error) {
    console.error(`Error transforming motorcycle data for ${rawData.name}:`, error);
    
    // Return a minimal motorcycle with basic data instead of failing
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
      
      // Use any available model-level data or provide defaults
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
      is_placeholder: true,
      migration_status: 'error_fallback',
      status: rawData.status || 'active',
      engine: `${rawData.engine_size || 0}cc`,
      is_draft: rawData.is_draft || false,
      use_cases: [],
      _componentData: {
        configurations: [],
        colorOptions: [],
        selectedConfiguration: null,
        hasComponentData: false,
        dataCompleteness: {
          hasEngineData: false,
          hasDimensionData: false,
          hasComponentData: false,
          configurationsCount: 0
        }
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
