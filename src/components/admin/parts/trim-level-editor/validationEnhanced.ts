
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  completeness: number;
  missingFields: string[];
  suggestions: string[];
}

export interface FormCompleteness {
  basicInfo: number;
  components: number;
  dimensions: number;
  overall: number;
}

export const calculateFormCompleteness = (formData: any): FormCompleteness => {
  // Basic info fields (required for functionality)
  const basicInfoFields = ['name', 'model_year_id'];
  const basicInfoOptional = ['market_region', 'price_premium_usd'];
  const basicInfoFilled = basicInfoFields.filter(field => formData[field]?.toString().trim()).length;
  const basicInfoOptionalFilled = basicInfoOptional.filter(field => formData[field]?.toString().trim()).length;
  const basicInfo = ((basicInfoFilled + (basicInfoOptionalFilled * 0.5)) / (basicInfoFields.length + basicInfoOptional.length * 0.5)) * 100;

  // Component fields
  const componentFields = ['engine_id', 'brake_system_id', 'frame_id', 'suspension_id', 'wheel_id'];
  const componentsFilled = componentFields.filter(field => formData[field]?.toString().trim()).length;
  const components = (componentsFilled / componentFields.length) * 100;

  // Dimension fields
  const dimensionFields = ['seat_height_mm', 'weight_kg', 'wheelbase_mm', 'fuel_capacity_l', 'ground_clearance_mm'];
  const dimensionsFilled = dimensionFields.filter(field => formData[field]?.toString().trim()).length;
  const dimensions = (dimensionsFilled / dimensionFields.length) * 100;

  // Overall completeness
  const overall = (basicInfo * 0.4 + components * 0.4 + dimensions * 0.2);

  return {
    basicInfo: Math.round(basicInfo),
    components: Math.round(components),
    dimensions: Math.round(dimensions),
    overall: Math.round(overall)
  };
};

export const validateTrimLevelFormEnhanced = (formData: any, modelYearId: string): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const missingFields: string[] = [];
  const suggestions: string[] = [];

  // Required field validation
  if (!formData.name?.toString().trim()) {
    errors.push("Trim level name is required");
    missingFields.push("name");
  }
  
  if (!modelYearId) {
    errors.push("Model year ID is missing");
  }

  // Numeric field validation with enhanced feedback
  const numericFields = [
    { field: 'seat_height_mm', label: 'Seat height', min: 500, max: 1200, unit: 'mm' },
    { field: 'weight_kg', label: 'Weight', min: 50, max: 500, unit: 'kg' },
    { field: 'wheelbase_mm', label: 'Wheelbase', min: 800, max: 2000, unit: 'mm' },
    { field: 'fuel_capacity_l', label: 'Fuel capacity', min: 1, max: 50, unit: 'L' },
    { field: 'ground_clearance_mm', label: 'Ground clearance', min: 50, max: 500, unit: 'mm' },
    { field: 'price_premium_usd', label: 'Price premium', min: 0, max: 50000, unit: 'USD' }
  ];

  for (const { field, label, min, max, unit } of numericFields) {
    const value = formData[field as keyof typeof formData];
    
    if (value === '' || value === null || value === undefined) {
      if (field !== 'price_premium_usd') {
        missingFields.push(field);
        warnings.push(`${label} is not specified`);
      }
      continue;
    }

    const numValue = Number(value);
    if (isNaN(numValue)) {
      errors.push(`${label} must be a valid number`);
      continue;
    }

    if (numValue < min) {
      if (field === 'price_premium_usd' && numValue < 0) {
        errors.push(`${label} cannot be negative`);
      } else if (field !== 'price_premium_usd') {
        errors.push(`${label} seems unusually low (${numValue}${unit}). Expected range: ${min}-${max}${unit}`);
      }
    }

    if (numValue > max) {
      warnings.push(`${label} seems unusually high (${numValue}${unit}). Expected range: ${min}-${max}${unit}`);
    }
  }

  // Component validation
  const componentFields = [
    { field: 'engine_id', label: 'Engine' },
    { field: 'brake_system_id', label: 'Brake system' },
    { field: 'frame_id', label: 'Frame' },
    { field: 'suspension_id', label: 'Suspension' },
    { field: 'wheel_id', label: 'Wheels' }
  ];

  const missingComponents = componentFields.filter(({ field }) => !formData[field]);
  if (missingComponents.length > 0) {
    missingComponents.forEach(({ label, field }) => {
      missingFields.push(field);
      warnings.push(`${label} not selected`);
    });
    suggestions.push("Consider selecting all components for a complete configuration");
  }

  // Logical consistency checks
  if (formData.seat_height_mm && formData.ground_clearance_mm) {
    const seatHeight = Number(formData.seat_height_mm);
    const groundClearance = Number(formData.ground_clearance_mm);
    
    if (seatHeight < groundClearance + 300) {
      warnings.push("Seat height seems low relative to ground clearance");
    }
  }

  if (formData.weight_kg && formData.fuel_capacity_l) {
    const weight = Number(formData.weight_kg);
    const fuelCapacity = Number(formData.fuel_capacity_l);
    
    if (weight < 100 && fuelCapacity > 20) {
      warnings.push("Large fuel capacity for a lightweight motorcycle - please verify");
    }
  }

  // Calculate completeness
  const completeness = calculateFormCompleteness(formData).overall;

  // Add suggestions based on completeness
  if (completeness < 50) {
    suggestions.push("This configuration needs more information to be useful");
  } else if (completeness < 80) {
    suggestions.push("Consider adding more details for a comprehensive configuration");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    completeness,
    missingFields,
    suggestions
  };
};
