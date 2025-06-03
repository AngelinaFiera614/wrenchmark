import { Motorcycle } from "@/types";
import { extractEngineData } from "./engineDataExtractor";
import { extractBrakeData } from "./brakeDataExtractor";
import { extractDimensionData } from "./dimensionDataExtractor";

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
    const hasComponentDataAvailable = allConfigurations.length > 0;
    
    console.log(`Data completeness for ${rawData.name}:`, {
      hasEngineData,
      hasDimensionData,
      hasComponentData: hasComponentDataAvailable,
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
      migration_status: hasComponentDataAvailable ? 'migrated' : 'basic_data_only',
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
        selectedConfiguration: allConfigurations.find(c => c.is_default) || allConfigurations[0]
      }
    };
    
    console.log(`Successfully transformed ${transformed.make} ${transformed.model}`);
    console.log(`Data status: placeholder=${transformed.is_placeholder}, migration=${transformed.migration_status}`);
    
    return transformed;
  } catch (error) {
    console.error(`Error transforming motorcycle data for ${rawData.name}:`, error);
    
    // Return a minimal motorcycle with basic data instead of failing
    return createErrorFallbackMotorcycle(rawData);
  }
};

const createErrorFallbackMotorcycle = (rawData: any): Motorcycle => {
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
      selectedConfiguration: null
    }
  };
};
