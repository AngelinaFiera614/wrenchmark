
import { Configuration } from "@/types/motorcycle";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  completeness: number;
  sectionStatus: Record<string, 'complete' | 'partial' | 'missing'>;
}

export interface FormCompleteness {
  overall: number;
  basicInfo: number;
  components: number;
  dimensions: number;
}

export const validateTrimLevelFormEnhanced = (formData: any, modelYearId: string): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];

  // Required field validation
  if (!formData.name || formData.name.trim().length === 0) {
    errors.push("Trim level name is required");
  }

  if (!modelYearId) {
    errors.push("Model year is required");
  }

  // Component validation
  if (!formData.engine_id) {
    warnings.push("Engine component is not assigned");
  }

  if (!formData.brake_system_id) {
    warnings.push("Brake system is not assigned");
  }

  if (!formData.frame_id) {
    warnings.push("Frame component is not assigned");
  }

  // Dimension validation
  if (!formData.seat_height_mm) {
    warnings.push("Seat height is missing");
  }

  if (!formData.weight_kg) {
    warnings.push("Weight is missing");
  }

  // Pricing validation
  if (!formData.msrp_usd) {
    suggestions.push("Consider adding MSRP for better completeness");
  }

  // Market region suggestion
  if (!formData.market_region) {
    suggestions.push("Market region helps with regional specifications");
  }

  // Calculate section status
  const sectionStatus = {
    basic: formData.name && formData.msrp_usd ? 'complete' : formData.name ? 'partial' : 'missing',
    components: (formData.engine_id && formData.brake_system_id && formData.frame_id) ? 'complete' : 
                (formData.engine_id || formData.brake_system_id || formData.frame_id) ? 'partial' : 'missing',
    dimensions: (formData.seat_height_mm && formData.weight_kg && formData.wheelbase_mm) ? 'complete' : 
                (formData.seat_height_mm || formData.weight_kg) ? 'partial' : 'missing',
    metrics: 'complete', // Always complete as it's calculated
    notes: 'complete' // Always complete as it's optional
  } as Record<string, 'complete' | 'partial' | 'missing'>;

  // Calculate overall completeness
  const totalFields = 10; // Total expected fields
  let completedFields = 0;

  if (formData.name) completedFields++;
  if (formData.engine_id) completedFields++;
  if (formData.brake_system_id) completedFields++;
  if (formData.frame_id) completedFields++;
  if (formData.seat_height_mm) completedFields++;
  if (formData.weight_kg) completedFields++;
  if (formData.wheelbase_mm) completedFields++;
  if (formData.fuel_capacity_l) completedFields++;
  if (formData.msrp_usd) completedFields++;
  if (formData.market_region) completedFields++;

  const completeness = Math.round((completedFields / totalFields) * 100);

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    suggestions,
    completeness,
    sectionStatus
  };
};

export const calculateFormCompleteness = (configuration: Configuration): FormCompleteness => {
  // Basic info completeness
  const basicInfoFields = [
    configuration.name,
    configuration.msrp_usd,
    configuration.market_region
  ];
  const basicInfoComplete = basicInfoFields.filter(Boolean).length;
  const basicInfo = Math.round((basicInfoComplete / basicInfoFields.length) * 100);

  // Components completeness
  const componentFields = [
    configuration.engine_id,
    configuration.brake_system_id,
    configuration.frame_id,
    configuration.suspension_id,
    configuration.wheel_id
  ];
  const componentsComplete = componentFields.filter(Boolean).length;
  const components = Math.round((componentsComplete / componentFields.length) * 100);

  // Dimensions completeness
  const dimensionFields = [
    configuration.seat_height_mm,
    configuration.weight_kg,
    configuration.wheelbase_mm,
    configuration.fuel_capacity_l,
    configuration.ground_clearance_mm
  ];
  const dimensionsComplete = dimensionFields.filter(Boolean).length;
  const dimensions = Math.round((dimensionsComplete / dimensionFields.length) * 100);

  // Overall completeness
  const overall = Math.round((basicInfo + components + dimensions) / 3);

  return {
    overall,
    basicInfo,
    components,
    dimensions
  };
};
