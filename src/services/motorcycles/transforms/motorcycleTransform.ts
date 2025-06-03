
import { Database } from "@/integrations/supabase/types";
import { Motorcycle } from "@/types";
import { extractEngineData } from "./engineDataExtractor";
import { extractBrakeData } from "./brakeDataExtractor";
import { extractDimensionData } from "./dimensionDataExtractor";

// Component data structure for inheritance
export interface ComponentData {
  configurations: any[];
  components: {
    engines: any[];
    brakes: any[];
    frames: any[];
    suspensions: any[];
    wheels: any[];
  };
  model_assignments: any[];
}

// Transform a raw motorcycle model into the Motorcycle type with enhanced component inheritance
export const transformToMotorcycle = (
  model: any,
  modelYears: any[],
  componentData: ComponentData
): Motorcycle => {
  console.log("=== TRANSFORM: Processing model ===", model.name);
  console.log("Model years:", modelYears.length);
  console.log("Configurations:", componentData.configurations.length);
  console.log("Model assignments:", componentData.model_assignments.length);

  // Find the most recent year for this model
  const latestYear = modelYears.reduce((latest, year) => {
    return year.year > latest.year ? year : latest;
  }, modelYears[0] || { year: new Date().getFullYear() });

  // Find configurations for the latest year
  const latestConfigurations = componentData.configurations.filter(
    config => config.model_year_id === latestYear?.id
  );

  console.log("Latest year:", latestYear?.year);
  console.log("Latest configurations:", latestConfigurations.length);

  // Use the default configuration or the first available
  const defaultConfig = latestConfigurations.find(config => config.is_default) || 
                       latestConfigurations[0];

  if (defaultConfig) {
    console.log("Using configuration:", defaultConfig.name || "Standard");
  } else {
    console.log("No configuration found, using model-level defaults");
  }

  // Extract component data with inheritance
  const resolvedComponents = resolveComponentInheritance(
    model,
    defaultConfig,
    componentData
  );

  // Extract engine data
  const engineData = extractEngineData(
    latestConfigurations,
    resolvedComponents.engine,
    model
  );

  // Extract brake data
  const brakeData = extractBrakeData(
    latestConfigurations,
    resolvedComponents.brake_system,
    model
  );

  // Extract dimension data
  const dimensionData = extractDimensionData(
    latestConfigurations,
    model
  );

  // Build the transformed motorcycle
  const motorcycle: Motorcycle = {
    id: model.id,
    make: model.brands?.name || "Unknown",
    model: model.name,
    year: latestYear?.year || new Date().getFullYear(),
    slug: model.slug,
    type: model.type || "Standard",
    image_url: model.default_image_url || latestYear?.image_url,
    
    // Engine specifications
    engine_size: engineData.displacement_cc,
    horsepower: engineData.power_hp,
    torque_nm: engineData.torque_nm,
    engine: engineData.engine_type,
    fuel_system: engineData.fuel_system,
    cooling: engineData.cooling,
    
    // Brake data
    has_abs: brakeData.has_abs,
    brake_type: brakeData.brake_type,
    
    // Dimensions
    seat_height_mm: dimensionData.seat_height_mm,
    weight_kg: dimensionData.weight_kg,
    wheelbase_mm: dimensionData.wheelbase_mm,
    fuel_capacity_l: dimensionData.fuel_capacity_l,
    ground_clearance_mm: dimensionData.ground_clearance_mm,

    // Metadata
    is_placeholder: false,
    migration_status: "new_system",
    summary: model.summary || model.base_description,
    
    // Component inheritance metadata
    _componentData: {
      configurations: latestConfigurations,
      resolvedComponents
    }
  };

  console.log("=== TRANSFORM: Completed ===", {
    model: motorcycle.model,
    engine_size: motorcycle.engine_size,
    horsepower: motorcycle.horsepower,
    has_components: !!resolvedComponents.engine
  });

  return motorcycle;
};

// Resolve component inheritance for a configuration
function resolveComponentInheritance(
  model: any,
  configuration: any,
  componentData: ComponentData
) {
  const modelAssignments = componentData.model_assignments.filter(
    assignment => assignment.model_id === model.id
  );

  console.log("=== INHERITANCE: Resolving components ===");
  console.log("Model assignments:", modelAssignments.length);
  console.log("Configuration:", configuration?.name || "None");

  const resolved = {
    engine: resolveComponent('engine', configuration, modelAssignments, componentData.components.engines),
    brake_system: resolveComponent('brake_system', configuration, modelAssignments, componentData.components.brakes),
    frame: resolveComponent('frame', configuration, modelAssignments, componentData.components.frames),
    suspension: resolveComponent('suspension', configuration, modelAssignments, componentData.components.suspensions),
    wheel: resolveComponent('wheel', configuration, modelAssignments, componentData.components.wheels)
  };

  console.log("=== INHERITANCE: Resolved ===", {
    engine: !!resolved.engine,
    brake_system: !!resolved.brake_system,
    frame: !!resolved.frame,
    suspension: !!resolved.suspension,
    wheel: !!resolved.wheel
  });

  return resolved;
}

// Resolve a single component using the inheritance hierarchy
function resolveComponent(
  componentType: string,
  configuration: any,
  modelAssignments: any[],
  components: any[]
) {
  // 1. Check if configuration has an override
  if (configuration) {
    const overrideField = `${componentType}_override`;
    const componentField = `${componentType}_id`;
    
    if (configuration[overrideField] && configuration[componentField]) {
      const component = components.find(c => c.id === configuration[componentField]);
      if (component) {
        console.log(`Using ${componentType} from configuration override`);
        return component;
      }
    }
  }

  // 2. Check model-level assignments
  const modelAssignment = modelAssignments.find(
    assignment => assignment.component_type === componentType
  );
  
  if (modelAssignment) {
    const component = components.find(c => c.id === modelAssignment.component_id);
    if (component) {
      console.log(`Using ${componentType} from model assignment`);
      return component;
    }
  }

  // 3. Fall back to configuration direct assignment
  if (configuration) {
    const componentField = `${componentType}_id`;
    if (configuration[componentField]) {
      const component = components.find(c => c.id === configuration[componentField]);
      if (component) {
        console.log(`Using ${componentType} from configuration direct`);
        return component;
      }
    }
  }

  console.log(`No ${componentType} found for inheritance`);
  return null;
}
