
import { Motorcycle } from "@/types";

export const transformMotorcycleData = (rawData: any): Motorcycle => {
  console.log("=== STARTING transformMotorcycleData DEBUG ===");
  console.log("Raw motorcycle data:", rawData);
  
  // Handle brand data - it should come from the brands relationship
  const brandData = rawData.brands || {};
  console.log("Brand data from relationship:", brandData);
  
  const brandName = brandData.name || rawData.brand_name || 'Unknown Brand';
  console.log("Resolved brand name:", brandName);
  
  // Extract model years and configurations
  const modelYears = rawData.model_years || [];
  console.log("Model years found:", modelYears.length);
  
  // Find the best configuration to use for base data
  let bestConfiguration = null;
  let allConfigurations = [];
  
  for (const modelYear of modelYears) {
    const configs = modelYear.model_configurations || [];
    allConfigurations.push(...configs.map(config => ({
      ...config,
      model_year: modelYear
    })));
  }
  
  console.log("All configurations found:", allConfigurations.length);
  console.log("Configuration details:", allConfigurations.map(c => ({
    id: c.id,
    name: c.name,
    is_default: c.is_default,
    hasEngine: !!c.engines,
    engineData: c.engines ? {
      displacement_cc: c.engines.displacement_cc,
      power_hp: c.engines.power_hp,
      torque_nm: c.engines.torque_nm
    } : null,
    seat_height_mm: c.seat_height_mm,
    weight_kg: c.weight_kg
  })));
  
  // Select best configuration - prioritize those with actual data over defaults
  if (allConfigurations.length > 0) {
    // First try to find configuration with complete engine data
    bestConfiguration = allConfigurations.find(c => 
      c.engines && c.engines.displacement_cc > 0 && c.engines.power_hp > 0
    );
    
    // If no configuration with engine data, try default
    if (!bestConfiguration) {
      bestConfiguration = allConfigurations.find(c => c.is_default);
    }
    
    // If no default, use the first one
    if (!bestConfiguration) {
      bestConfiguration = allConfigurations[0];
    }
    
    console.log("Selected best configuration:", {
      id: bestConfiguration?.id,
      name: bestConfiguration?.name,
      is_default: bestConfiguration?.is_default,
      hasEngineData: !!(bestConfiguration?.engines?.displacement_cc)
    });
  }
  
  // Enhanced engine data extraction with proper field mapping
  let engineData: any = {};
  if (bestConfiguration?.engines) {
    const engine = bestConfiguration.engines;
    console.log("Engine data from configuration:", engine);
    
    engineData = {
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
    
    console.log("Mapped engine data:", engineData);
  } else {
    console.log("No engine data in configuration, using fallback");
    engineData = {
      engine_size: rawData.engine_size || 0,
      displacement_cc: rawData.engine_size || 0,
      engine_cc: rawData.engine_size || 0,
      horsepower: rawData.horsepower || 0,
      horsepower_hp: rawData.horsepower || 0,
      torque_nm: rawData.torque_nm || 0,
      engine_type: rawData.engine_type || null,
      cylinder_count: rawData.cylinder_count || null,
      cooling_system: rawData.cooling_system || null,
      power_rpm: rawData.power_rpm || null,
      torque_rpm: rawData.torque_rpm || null,
    };
  }
  
  // Enhanced brake data extraction
  let brakeData: any = {};
  if (bestConfiguration?.brake_systems) {
    const brakes = bestConfiguration.brake_systems;
    console.log("Brake data from configuration:", brakes);
    
    brakeData = {
      abs: brakes.has_traction_control || false,
      has_abs: brakes.has_traction_control || false,
      brake_type: brakes.type || null,
    };
  } else {
    brakeData = {
      abs: rawData.has_abs || false,
      has_abs: rawData.has_abs || false,
      brake_type: rawData.brake_type || null,
    };
  }
  
  console.log("Final brake data:", brakeData);
  
  // Enhanced dimensions from configuration with proper field mapping
  let dimensionData: any = {};
  if (bestConfiguration) {
    console.log("Dimension data from configuration:", {
      seat_height_mm: bestConfiguration.seat_height_mm,
      weight_kg: bestConfiguration.weight_kg,
      wheelbase_mm: bestConfiguration.wheelbase_mm,
      ground_clearance_mm: bestConfiguration.ground_clearance_mm,
      fuel_capacity_l: bestConfiguration.fuel_capacity_l
    });
    
    dimensionData = {
      seat_height_mm: bestConfiguration.seat_height_mm || rawData.seat_height_mm || 0,
      weight_kg: bestConfiguration.weight_kg || rawData.weight_kg || 0,
      wheelbase_mm: bestConfiguration.wheelbase_mm || rawData.wheelbase_mm || 0,
      ground_clearance_mm: bestConfiguration.ground_clearance_mm || rawData.ground_clearance_mm || 0,
      fuel_capacity_l: bestConfiguration.fuel_capacity_l || rawData.fuel_capacity_l || 0,
      // Add imperial conversions
      seat_height_in: (bestConfiguration.seat_height_mm || rawData.seat_height_mm) ? 
        ((bestConfiguration.seat_height_mm || rawData.seat_height_mm) / 25.4) : 0,
      weight_lbs: (bestConfiguration.weight_kg || rawData.weight_kg) ? 
        ((bestConfiguration.weight_kg || rawData.weight_kg) * 2.20462) : 0,
      wheelbase_in: (bestConfiguration.wheelbase_mm || rawData.wheelbase_mm) ? 
        ((bestConfiguration.wheelbase_mm || rawData.wheelbase_mm) / 25.4) : 0,
      ground_clearance_in: (bestConfiguration.ground_clearance_mm || rawData.ground_clearance_mm) ? 
        ((bestConfiguration.ground_clearance_mm || rawData.ground_clearance_mm) / 25.4) : 0,
      fuel_capacity_gal: (bestConfiguration.fuel_capacity_l || rawData.fuel_capacity_l) ? 
        ((bestConfiguration.fuel_capacity_l || rawData.fuel_capacity_l) * 0.264172) : 0,
    };
  } else {
    dimensionData = {
      seat_height_mm: rawData.seat_height_mm || 0,
      weight_kg: rawData.weight_kg || 0,
      wheelbase_mm: rawData.wheelbase_mm || 0,
      ground_clearance_mm: rawData.ground_clearance_mm || 0,
      fuel_capacity_l: rawData.fuel_capacity_l || 0,
      seat_height_in: rawData.seat_height_mm ? (rawData.seat_height_mm / 25.4) : 0,
      weight_lbs: rawData.weight_kg ? (rawData.weight_kg * 2.20462) : 0,
      wheelbase_in: rawData.wheelbase_mm ? (rawData.wheelbase_mm / 25.4) : 0,
      ground_clearance_in: rawData.ground_clearance_mm ? (rawData.ground_clearance_mm / 25.4) : 0,
      fuel_capacity_gal: rawData.fuel_capacity_l ? (rawData.fuel_capacity_l * 0.264172) : 0,
    };
  }
  
  console.log("Final dimension data:", dimensionData);
  
  // Enhanced speed data with proper conversions
  const speedData = {
    top_speed_kph: rawData.top_speed_kph || 0,
    top_speed_mph: rawData.top_speed_kph ? (rawData.top_speed_kph * 0.621371) : (rawData.top_speed_mph || 0),
  };
  
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
    
    // Enhanced engine fields with configuration data prioritized
    engine_size: engineData.engine_size,
    engine_cc: engineData.engine_cc,
    displacement_cc: engineData.displacement_cc,
    horsepower: engineData.horsepower,
    horsepower_hp: engineData.horsepower_hp,
    torque_nm: engineData.torque_nm,
    engine_type: engineData.engine_type,
    cylinder_count: engineData.cylinder_count,
    power_rpm: engineData.power_rpm,
    torque_rpm: engineData.torque_rpm,
    cooling_system: engineData.cooling_system,
    
    // Enhanced dimension fields with configuration data prioritized
    weight_kg: dimensionData.weight_kg,
    weight_lbs: dimensionData.weight_lbs,
    seat_height_mm: dimensionData.seat_height_mm,
    seat_height_in: dimensionData.seat_height_in,
    wheelbase_mm: dimensionData.wheelbase_mm,
    wheelbase_in: dimensionData.wheelbase_in,
    ground_clearance_mm: dimensionData.ground_clearance_mm,
    ground_clearance_in: dimensionData.ground_clearance_in,
    fuel_capacity_l: dimensionData.fuel_capacity_l,
    fuel_capacity_gal: dimensionData.fuel_capacity_gal,
    
    // Enhanced brake fields with configuration data prioritized
    abs: brakeData.abs,
    has_abs: brakeData.has_abs,
    brake_type: brakeData.brake_type,
    
    // Enhanced speed fields
    top_speed_kph: speedData.top_speed_kph,
    top_speed_mph: speedData.top_speed_mph,
    
    // Other existing fields
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
    
    // Store component references for detailed views with the actual selected configuration
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
  
  console.log("Final transformed motorcycle with actual specs:", {
    id: transformed.id,
    engine_size: transformed.engine_size,
    horsepower: transformed.horsepower,
    torque_nm: transformed.torque_nm,
    weight_kg: transformed.weight_kg,
    seat_height_mm: transformed.seat_height_mm,
    has_valid_specs: {
      engine: transformed.engine_size > 0,
      power: transformed.horsepower > 0,
      dimensions: transformed.seat_height_mm > 0
    },
    configurations: transformed._componentData?.configurations?.length,
    selectedConfig: bestConfiguration?.name
  });
  
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
