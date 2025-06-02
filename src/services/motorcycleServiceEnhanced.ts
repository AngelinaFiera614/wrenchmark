
import { supabase } from "@/integrations/supabase/client";
import { Motorcycle } from "@/types";

export const getMotorcycleBySlugEnhanced = async (slug: string): Promise<Motorcycle | null> => {
  try {
    console.log("Fetching enhanced motorcycle data for slug:", slug);
    
    // First get the motorcycle model
    const { data: model, error: modelError } = await supabase
      .from('motorcycle_models')
      .select(`
        *,
        brand:brand_id (
          id,
          name,
          logo_url
        )
      `)
      .eq('slug', slug)
      .single();

    if (modelError || !model) {
      console.error("Model not found:", modelError);
      return null;
    }

    // Get model years with configurations and components
    const { data: modelYears, error: yearsError } = await supabase
      .from('model_years')
      .select(`
        *,
        configurations:model_configurations (
          *,
          engines:engine_id (
            id,
            name,
            displacement_cc,
            power_hp,
            torque_nm,
            engine_type,
            power_rpm,
            torque_rpm,
            cylinder_count,
            cooling,
            fuel_system
          ),
          brake_systems:brake_system_id (
            id,
            type,
            brake_type_front,
            brake_type_rear,
            has_traction_control
          ),
          frames:frame_id (
            id,
            type,
            material,
            construction_method
          ),
          suspensions:suspension_id (
            id,
            front_type,
            rear_type,
            brand,
            adjustability
          ),
          wheels:wheel_id (
            id,
            type,
            front_size,
            rear_size,
            rim_material
          ),
          color_variants:color_id (
            id,
            name,
            color_code,
            hex_code
          )
        )
      `)
      .eq('motorcycle_id', model.id)
      .order('year', { ascending: false });

    if (yearsError) {
      console.error("Error fetching model years:", yearsError);
    }

    // Transform to legacy motorcycle format for compatibility
    const transformedMotorcycle = transformModelToMotorcycle(model, modelYears || []);
    
    console.log("Enhanced motorcycle data transformed:", {
      id: transformedMotorcycle.id,
      hasConfigurations: transformedMotorcycle._componentData?.configurations?.length || 0,
      hasEngine: !!transformedMotorcycle._componentData?.engine,
      engineSize: transformedMotorcycle.engine_size
    });

    return transformedMotorcycle;
  } catch (error) {
    console.error("Error in getMotorcycleBySlugEnhanced:", error);
    return null;
  }
};

const transformModelToMotorcycle = (model: any, modelYears: any[]): Motorcycle => {
  // Get the most recent year or first available year
  const primaryYear = modelYears.find(y => y.year === new Date().getFullYear()) || 
                      modelYears.find(y => y.is_available) || 
                      modelYears[0];

  // Get the default configuration or first configuration
  const defaultConfig = primaryYear?.configurations?.find((c: any) => c.is_default) || 
                        primaryYear?.configurations?.[0];

  // Extract component data
  const engine = defaultConfig?.engines;
  const brakes = defaultConfig?.brake_systems;
  const frame = defaultConfig?.frames;
  const suspension = defaultConfig?.suspensions;
  const wheels = defaultConfig?.wheels;

  // Calculate performance metrics
  const engineSize = engine?.displacement_cc || model.engine_size || 0;
  const horsepower = engine?.power_hp || model.horsepower || 0;
  const torque = engine?.torque_nm || model.torque_nm || 0;
  const weight = defaultConfig?.weight_kg || model.weight_kg || 0;

  const transformedMotorcycle: Motorcycle = {
    id: model.id,
    make: model.brand?.name || "Unknown",
    brand_id: model.brand_id,
    model: model.name,
    year: primaryYear?.year || model.production_start_year || new Date().getFullYear(),
    category: model.type || "Standard",
    style_tags: [],
    difficulty_level: model.difficulty_level || 3,
    image_url: defaultConfig?.image_url || model.default_image_url || "",
    engine_size: engineSize,
    displacement_cc: engineSize,
    engine_cc: engineSize,
    horsepower: horsepower,
    horsepower_hp: horsepower,
    weight_kg: weight,
    wet_weight_kg: model.wet_weight_kg,
    seat_height_mm: defaultConfig?.seat_height_mm || model.seat_height_mm || 0,
    abs: brakes?.has_traction_control || model.has_abs || false,
    has_abs: brakes?.has_traction_control || model.has_abs || false,
    top_speed_kph: model.top_speed_kph || 0,
    torque_nm: torque,
    wheelbase_mm: defaultConfig?.wheelbase_mm || model.wheelbase_mm || 0,
    ground_clearance_mm: defaultConfig?.ground_clearance_mm || model.ground_clearance_mm || 0,
    fuel_capacity_l: defaultConfig?.fuel_capacity_l || model.fuel_capacity_l || 0,
    smart_features: [],
    summary: model.base_description || model.summary || "",
    slug: model.slug,
    status: model.production_status,
    
    // Enhanced engine information
    engine_type: engine?.engine_type,
    power_rpm: engine?.power_rpm,
    torque_rpm: engine?.torque_rpm,
    cylinder_count: engine?.cylinder_count,
    
    // Enhanced brake information
    brake_type: brakes?.type,
    
    // Enhanced fields
    transmission: model.transmission,
    drive_type: model.drive_type,
    cooling_system: engine?.cooling || model.cooling_system,
    power_to_weight_ratio: weight > 0 ? Math.round((horsepower / weight) * 1000) / 1000 : undefined,
    is_entry_level: model.is_entry_level,
    recommended_license_level: model.recommended_license_level,
    use_cases: model.use_cases || [],
    
    // Component data for detailed views
    _componentData: {
      engine,
      brakes,
      frame,
      suspension,
      wheels,
      configurations: modelYears?.flatMap(y => y.configurations || []) || [],
      selectedConfiguration: defaultConfig,
      colorOptions: modelYears?.flatMap(y => y.configurations?.map((c: any) => c.color_variants).filter(Boolean) || []) || []
    }
  };

  return transformedMotorcycle;
};

// Batch generate missing data for all models
export const generateMissingModelData = async (): Promise<{ success: number; failed: string[] }> => {
  try {
    console.log("Starting batch data generation for all models");
    
    const { data: models, error } = await supabase
      .from('motorcycle_models')
      .select('id, name')
      .eq('production_status', 'active')
      .limit(50); // Process in batches to avoid timeouts

    if (error || !models) {
      console.error("Error fetching models for batch generation:", error);
      return { success: 0, failed: [] };
    }

    let successCount = 0;
    const failedModels: string[] = [];

    for (const model of models) {
      try {
        // Check if model already has years and configurations
        const { data: existingYears } = await supabase
          .from('model_years')
          .select('id, configurations:model_configurations(id)')
          .eq('motorcycle_id', model.id);

        const hasCompleteData = existingYears && 
          existingYears.length > 0 && 
          existingYears.some(year => year.configurations && year.configurations.length > 0);

        if (!hasCompleteData) {
          // Import the generation function
          const { generateModelYearsEnhanced } = await import("@/services/models/modelYearGeneration");
          
          const success = await generateModelYearsEnhanced(model.id, {
            includeHistorical: false, // Only recent years for faster processing
            createDefaultTrims: true,
            batchSize: 5
          });

          if (success) {
            successCount++;
            console.log(`Generated data for ${model.name}`);
          } else {
            failedModels.push(model.name);
          }
        } else {
          successCount++;
          console.log(`${model.name} already has complete data`);
        }
      } catch (error) {
        console.error(`Failed to generate data for ${model.name}:`, error);
        failedModels.push(model.name);
      }
    }

    console.log(`Batch generation complete: ${successCount} successful, ${failedModels.length} failed`);
    return { success: successCount, failed: failedModels };
  } catch (error) {
    console.error("Error in batch data generation:", error);
    return { success: 0, failed: [] };
  }
};
