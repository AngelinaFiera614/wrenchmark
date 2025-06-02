
import { Motorcycle } from "@/types";

export interface ValidationResult {
  isValid: boolean;
  missingFields: string[];
  hasMinimalData: boolean;
  completenessScore: number;
}

export const validateMotorcycleData = (motorcycle: Motorcycle): ValidationResult => {
  const requiredFields = ['make', 'model', 'year'];
  const importantFields = ['engine_size', 'horsepower', 'weight_kg', 'seat_height_mm'];
  const optionalFields = ['torque_nm', 'top_speed_kph', 'fuel_capacity_l', 'wheelbase_mm'];
  
  const missingRequired = requiredFields.filter(field => 
    !motorcycle[field as keyof Motorcycle] || 
    motorcycle[field as keyof Motorcycle] === ''
  );
  
  const missingImportant = importantFields.filter(field => 
    !motorcycle[field as keyof Motorcycle] || 
    motorcycle[field as keyof Motorcycle] === 0
  );
  
  const presentOptional = optionalFields.filter(field => 
    motorcycle[field as keyof Motorcycle] && 
    motorcycle[field as keyof Motorcycle] !== 0
  ).length;
  
  const isValid = missingRequired.length === 0;
  const hasMinimalData = missingRequired.length === 0 && missingImportant.length <= 2;
  
  // Calculate completeness score (0-100)
  const totalFields = requiredFields.length + importantFields.length + optionalFields.length;
  const presentFields = 
    (requiredFields.length - missingRequired.length) + 
    (importantFields.length - missingImportant.length) + 
    presentOptional;
  
  const completenessScore = Math.round((presentFields / totalFields) * 100);
  
  return {
    isValid,
    missingFields: [...missingRequired, ...missingImportant],
    hasMinimalData,
    completenessScore
  };
};

export const enhanceMotorcycleWithDefaults = (motorcycle: Motorcycle): Motorcycle => {
  // Provide intelligent defaults based on category and engine size
  const defaults = getDefaultsByCategory(motorcycle.category, motorcycle.engine_size);
  
  return {
    ...motorcycle,
    // Apply defaults only if fields are missing or zero
    horsepower: motorcycle.horsepower || defaults.horsepower,
    torque_nm: motorcycle.torque_nm || defaults.torque_nm,
    weight_kg: motorcycle.weight_kg || defaults.weight_kg,
    seat_height_mm: motorcycle.seat_height_mm || defaults.seat_height_mm,
    top_speed_kph: motorcycle.top_speed_kph || defaults.top_speed_kph,
    fuel_capacity_l: motorcycle.fuel_capacity_l || defaults.fuel_capacity_l,
    wheelbase_mm: motorcycle.wheelbase_mm || defaults.wheelbase_mm,
    ground_clearance_mm: motorcycle.ground_clearance_mm || defaults.ground_clearance_mm,
  };
};

const getDefaultsByCategory = (category: string, engineSize: number) => {
  const baseDefaults = {
    horsepower: Math.round(engineSize * 0.1), // Rough hp/cc ratio
    torque_nm: Math.round(engineSize * 0.08),
    weight_kg: 180,
    seat_height_mm: 800,
    top_speed_kph: 160,
    fuel_capacity_l: 15,
    wheelbase_mm: 1400,
    ground_clearance_mm: 150,
  };
  
  // Category-specific adjustments
  switch (category?.toLowerCase()) {
    case 'sport':
      return {
        ...baseDefaults,
        horsepower: Math.round(engineSize * 0.12),
        weight_kg: 170,
        seat_height_mm: 820,
        top_speed_kph: 200,
        fuel_capacity_l: 17,
      };
      
    case 'cruiser':
      return {
        ...baseDefaults,
        horsepower: Math.round(engineSize * 0.08),
        weight_kg: 220,
        seat_height_mm: 720,
        top_speed_kph: 140,
        fuel_capacity_l: 20,
        wheelbase_mm: 1600,
      };
      
    case 'adventure':
      return {
        ...baseDefaults,
        weight_kg: 200,
        seat_height_mm: 870,
        ground_clearance_mm: 200,
        fuel_capacity_l: 22,
        wheelbase_mm: 1500,
      };
      
    case 'touring':
      return {
        ...baseDefaults,
        weight_kg: 230,
        seat_height_mm: 780,
        fuel_capacity_l: 25,
        wheelbase_mm: 1550,
      };
      
    default:
      return baseDefaults;
  }
};
