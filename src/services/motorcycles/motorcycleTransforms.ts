
import { Motorcycle } from "@/types";

export const transformMotorcycleData = (rawData: any): Motorcycle => {
  // Handle the corrected brands relationship structure
  const brandData = rawData.brands || {};
  
  console.log("Transforming motorcycle data:", {
    name: rawData.name,
    brandName: brandData.name,
    hasValidBrand: !!brandData.name,
    engineSize: rawData.engine_size,
    horsepower: rawData.horsepower,
    hasEngineData: !!(rawData.engine_size || rawData.horsepower),
    isDraft: rawData.is_draft,
    powerToWeightRatio: rawData.power_to_weight_ratio,
    transmission: rawData.transmission,
    driveType: rawData.drive_type,
    coolingSystem: rawData.cooling_system,
    rawDataKeys: Object.keys(rawData)
  });
  
  // For drafts, provide safe defaults for missing data
  const isDraft = rawData.is_draft || false;
  const engineSize = rawData.engine_size || null;
  const horsepower = rawData.horsepower || null;
  
  return {
    id: rawData.id,
    make: brandData.name || "Unknown Brand",
    brand_id: rawData.brand_id,
    model: rawData.name,
    year: rawData.production_start_year || new Date().getFullYear(),
    category: rawData.category || rawData.type || "Standard",
    style_tags: [],
    difficulty_level: rawData.difficulty_level || 1,
    image_url: rawData.default_image_url || "",
    engine_size: engineSize || 0,
    horsepower: horsepower || 0,
    weight_kg: rawData.weight_kg || 0,
    wet_weight_kg: rawData.wet_weight_kg || 0,
    seat_height_mm: rawData.seat_height_mm || 0,
    abs: rawData.has_abs || false,
    top_speed_kph: rawData.top_speed_kph || 0,
    torque_nm: rawData.torque_nm || 0,
    wheelbase_mm: rawData.wheelbase_mm || 0,
    ground_clearance_mm: rawData.ground_clearance_mm || 0,
    fuel_capacity_l: rawData.fuel_capacity_l || 0,
    smart_features: [],
    summary: rawData.summary || rawData.base_description || "",
    slug: rawData.slug,
    created_at: rawData.created_at,
    is_placeholder: false,
    migration_status: "migrated",
    status: rawData.status || rawData.production_status,
    engine: rawData.engine_size ? `${rawData.engine_size}cc` : "",
    is_draft: isDraft,
    
    // New enhanced technical fields
    transmission: rawData.transmission,
    drive_type: rawData.drive_type,
    cooling_system: rawData.cooling_system,
    power_to_weight_ratio: rawData.power_to_weight_ratio,
    is_entry_level: rawData.is_entry_level || false,
    recommended_license_level: rawData.recommended_license_level,
    use_cases: rawData.use_cases || [],
    
    // Compatibility aliases - preserve original values for filtering
    engine_cc: engineSize,
    displacement_cc: engineSize,
    horsepower_hp: horsepower,
    
    // Enhanced engine information
    power_rpm: rawData.power_rpm,
    torque_rpm: rawData.torque_rpm,
    engine_type: rawData.engine_type,
    cylinder_count: rawData.cylinder_count,
    
    // Enhanced brake system information
    brake_type: rawData.brake_type,
    has_abs: rawData.has_abs,
    
    // US Standard fields (calculated in app, not stored)
    weight_lbs: rawData.weight_kg ? Math.round(rawData.weight_kg * 2.205) : undefined,
    seat_height_in: rawData.seat_height_mm ? Math.round(rawData.seat_height_mm / 25.4) : undefined,
    wheelbase_in: rawData.wheelbase_mm ? Math.round(rawData.wheelbase_mm / 25.4) : undefined,
    ground_clearance_in: rawData.ground_clearance_mm ? Math.round(rawData.ground_clearance_mm / 25.4) : undefined,
    fuel_capacity_gal: rawData.fuel_capacity_l ? Math.round(rawData.fuel_capacity_l * 0.264172 * 100) / 100 : undefined,
    top_speed_mph: rawData.top_speed_kph ? Math.round(rawData.top_speed_kph * 0.621371) : undefined,
  };
};

export const createPlaceholderMotorcycleData = (motorcycleData: {
  make: string;
  model: string;
  year: number;
  isDraft?: boolean;
}) => {
  return {
    name: motorcycleData.model,
    type: "Standard",
    production_start_year: motorcycleData.year,
    production_status: "active",
    slug: `${motorcycleData.make.toLowerCase()}-${motorcycleData.model.toLowerCase()}-${motorcycleData.year}`.replace(/\s+/g, '-'),
    brand_id: null,
    base_description: `${motorcycleData.make} ${motorcycleData.model} ${motorcycleData.year}`,
    is_draft: motorcycleData.isDraft || false,
  };
};

export const createDraftMotorcycleData = (name: string, brandId: string) => {
  return {
    name,
    brand_id: brandId,
    type: "Standard",
    production_status: "active",
    slug: `${name.toLowerCase().replace(/\s+/g, '-')}-draft-${Date.now()}`,
    is_draft: true,
  };
};
