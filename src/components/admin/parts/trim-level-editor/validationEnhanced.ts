import { Configuration } from "@/types/motorcycle";

export interface FormCompleteness {
  basicInfo: number;
  components: number;
  dimensions: number;
  overall: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export const calculateFormCompleteness = (config: Configuration): FormCompleteness => {
  // Calculate basic info completeness
  const basicInfoFields = [
    config.name,
    config.market_region,
    config.msrp_usd
  ];
  const basicInfoComplete = basicInfoFields.filter(field => field !== null && field !== undefined && field !== '').length;
  const basicInfo = Math.round((basicInfoComplete / basicInfoFields.length) * 100);

  // Calculate components completeness
  const componentFields = [
    config.engine_id,
    config.brake_system_id,
    config.frame_id,
    config.suspension_id,
    config.wheel_id
  ];
  const componentsComplete = componentFields.filter(field => field !== null && field !== undefined && field !== '').length;
  const components = Math.round((componentsComplete / componentFields.length) * 100);

  // Calculate dimensions completeness
  const dimensionFields = [
    config.seat_height_mm,
    config.weight_kg,
    config.wheelbase_mm,
    config.fuel_capacity_l,
    config.ground_clearance_mm
  ];
  const dimensionsComplete = dimensionFields.filter(field => field !== null && field !== undefined).length;
  const dimensions = Math.round((dimensionsComplete / dimensionFields.length) * 100);

  // Calculate overall completeness
  const totalFields = basicInfoFields.length + componentFields.length + dimensionFields.length;
  const totalComplete = basicInfoComplete + componentsComplete + dimensionsComplete;
  const overall = Math.round((totalComplete / totalFields) * 100);

  return {
    basicInfo,
    components,
    dimensions,
    overall
  };
};

export const validateTrimLevelFormEnhanced = (formData: any, modelYearId: string): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];

  // Required field validation
  if (!formData.name || formData.name.trim() === '') {
    errors.push('Trim level name is required');
  }

  if (!modelYearId) {
    errors.push('Model year ID is required');
  }

  // Warning validations
  if (!formData.engine_id) {
    warnings.push('No engine selected');
  }

  if (!formData.brake_system_id) {
    warnings.push('No brake system selected');
  }

  if (!formData.frame_id) {
    warnings.push('No frame selected');
  }

  if (!formData.suspension_id) {
    warnings.push('No suspension selected');
  }

  if (!formData.wheel_id) {
    warnings.push('No wheels selected');
  }

  // Dimension validations
  if (formData.seat_height_mm && formData.seat_height_mm <= 0) {
    errors.push('Seat height must be positive');
  }

  if (formData.weight_kg && formData.weight_kg <= 0) {
    errors.push('Weight must be positive');
  }

  if (formData.wheelbase_mm && formData.wheelbase_mm <= 0) {
    errors.push('Wheelbase must be positive');
  }

  if (formData.fuel_capacity_l && formData.fuel_capacity_l <= 0) {
    errors.push('Fuel capacity must be positive');
  }

  if (formData.ground_clearance_mm && formData.ground_clearance_mm <= 0) {
    errors.push('Ground clearance must be positive');
  }

  // Suggestions for improvement
  if (!formData.market_region) {
    suggestions.push('Consider adding a market region for better categorization');
  }

  if (!formData.msrp_usd && formData.msrp_usd !== 0) {
    suggestions.push('Adding MSRP information helps with market positioning and customer expectations');
  }

  if (formData.seat_height_mm && formData.weight_kg) {
    // Add performance-based suggestions
    const seatHeight = Number(formData.seat_height_mm);
    const weight = Number(formData.weight_kg);
    
    if (seatHeight < 780) {
      suggestions.push('Low seat height detected - consider adding beginner-friendly tags');
    }
    
    if (weight > 250) {
      suggestions.push('Heavy motorcycle detected - consider noting handling characteristics');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    suggestions
  };
};
