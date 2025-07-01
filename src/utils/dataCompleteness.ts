
import { Motorcycle } from "@/types";
import { getModelComponentAssignments } from "@/services/modelComponentService";

export interface DataCompletion {
  completionPercentage: number;
  missingFields: string[];
  completedFields: string[];
  criticalMissing: string[];
  missingCriticalFields: string[];
  hasEngine: boolean;
  hasBrakes: boolean;
  hasFrame: boolean;
  hasSuspension: boolean;
  hasWheels: boolean;
  // New detailed breakdown
  breakdown: {
    basicInfo: { score: number; total: number; percentage: number; };
    specifications: { score: number; total: number; percentage: number; };
    components: { score: number; total: number; percentage: number; };
    media: { score: number; total: number; percentage: number; };
  };
}

export interface DataCompletenessStatus {
  completionPercentage: number;
  missingCriticalFields: string[];
  hasEngine: boolean;
  hasBrakes: boolean;
  hasFrame: boolean;
  hasSuspension: boolean;
  hasWheels: boolean;
}

// Field definitions with weights for new scoring system
const COMPLETION_FIELDS = {
  basicInfo: [
    { key: 'name', label: 'Name', weight: 3, critical: true },
    { key: 'brand_id', label: 'Brand', weight: 3, critical: true },
    { key: 'type', label: 'Type', weight: 2, critical: true },
    { key: 'production_start_year', label: 'Production Year', weight: 1, critical: false },
  ],
  specifications: [
    { key: 'engine_size', label: 'Engine Size', weight: 2, critical: false },
    { key: 'horsepower', label: 'Horsepower', weight: 2, critical: false },
    { key: 'torque_nm', label: 'Torque', weight: 1.5, critical: false },
    { key: 'weight_kg', label: 'Weight', weight: 2, critical: false },
    { key: 'seat_height_mm', label: 'Seat Height', weight: 1.5, critical: false },
    { key: 'wheelbase_mm', label: 'Wheelbase', weight: 1, critical: false },
    { key: 'fuel_capacity_l', label: 'Fuel Capacity', weight: 1, critical: false },
    { key: 'ground_clearance_mm', label: 'Ground Clearance', weight: 0.5, critical: false },
    { key: 'top_speed_kph', label: 'Top Speed', weight: 1, critical: false },
  ],
  media: [
    { key: 'default_image_url', label: 'Default Image', weight: 1, critical: false },
    { key: 'base_description', label: 'Description', weight: 1, critical: false },
  ]
};

// Component weights for scoring
const COMPONENT_WEIGHTS = {
  engine: 2,
  brake_system: 1.5,
  frame: 1.5,
  suspension: 1,
  wheel: 1
};

export async function calculateDataCompleteness(
  motorcycle: Motorcycle, 
  selectedConfiguration?: any
): Promise<DataCompletion> {
  const breakdown = {
    basicInfo: { score: 0, total: 0, percentage: 0 },
    specifications: { score: 0, total: 0, percentage: 0 },
    components: { score: 0, total: 0, percentage: 0 },
    media: { score: 0, total: 0, percentage: 0 }
  };

  const completedFields: string[] = [];
  const missingFields: string[] = [];
  const criticalMissing: string[] = [];

  // Calculate basic info score (30% weight)
  COMPLETION_FIELDS.basicInfo.forEach(field => {
    breakdown.basicInfo.total += field.weight;
    const value = motorcycle[field.key as keyof Motorcycle];
    const hasValue = value !== null && value !== undefined && value !== '';
    
    if (hasValue) {
      breakdown.basicInfo.score += field.weight;
      completedFields.push(field.label);
    } else {
      missingFields.push(field.label);
      if (field.critical) {
        criticalMissing.push(field.label);
      }
    }
  });

  // Calculate specifications score (35% weight) - with smart component integration
  for (const field of COMPLETION_FIELDS.specifications) {
    breakdown.specifications.total += field.weight;
    let value = motorcycle[field.key as keyof Motorcycle];
    let hasValue = value !== null && value !== undefined && value !== 0 && value !== '';
    
    // Smart integration: try to get value from components if missing from model
    if (!hasValue && selectedConfiguration) {
      hasValue = await tryGetSpecFromComponents(field.key, selectedConfiguration, motorcycle.id);
    }
    
    if (hasValue) {
      breakdown.specifications.score += field.weight;
      completedFields.push(field.label);
    } else {
      missingFields.push(field.label);
      if (field.critical) {
        criticalMissing.push(field.label);
      }
    }
  }

  // Calculate media score (10% weight)
  COMPLETION_FIELDS.media.forEach(field => {
    breakdown.media.total += field.weight;
    const value = motorcycle[field.key as keyof Motorcycle];
    const hasValue = value !== null && value !== undefined && value !== '';
    
    if (hasValue) {
      breakdown.media.score += field.weight;
      completedFields.push(field.label);
    } else {
      missingFields.push(field.label);
    }
  });

  // Calculate component score (25% weight)
  let hasEngine = false;
  let hasBrakes = false;
  let hasFrame = false;
  let hasSuspension = false;
  let hasWheels = false;

  try {
    // Get model component assignments
    const assignments = await getModelComponentAssignments(motorcycle.id);
    
    assignments.forEach(assignment => {
      switch (assignment.component_type) {
        case 'engine':
          hasEngine = true;
          break;
        case 'brake_system':
          hasBrakes = true;
          break;
        case 'frame':
          hasFrame = true;
          break;
        case 'suspension':
          hasSuspension = true;
          break;
        case 'wheel':
          hasWheels = true;
          break;
      }
    });

    // Also check configuration-level assignments if provided
    if (selectedConfiguration) {
      hasEngine = hasEngine || !!(selectedConfiguration.engine || selectedConfiguration.engines || selectedConfiguration.engine_id);
      hasBrakes = hasBrakes || !!(selectedConfiguration.brake_system || selectedConfiguration.brake_systems || selectedConfiguration.brake_system_id);
      hasFrame = hasFrame || !!(selectedConfiguration.frame || selectedConfiguration.frames || selectedConfiguration.frame_id);
      hasSuspension = hasSuspension || !!(selectedConfiguration.suspension || selectedConfiguration.suspensions || selectedConfiguration.suspension_id);
      hasWheels = hasWheels || !!(selectedConfiguration.wheel || selectedConfiguration.wheels || selectedConfiguration.wheel_id);
    }
  } catch (error) {
    console.error('Error checking model component assignments:', error);
    // Fallback to configuration-level checks only
    if (selectedConfiguration) {
      hasEngine = !!(selectedConfiguration.engine || selectedConfiguration.engines || selectedConfiguration.engine_id);
      hasBrakes = !!(selectedConfiguration.brake_system || selectedConfiguration.brake_systems || selectedConfiguration.brake_system_id);
      hasFrame = !!(selectedConfiguration.frame || selectedConfiguration.frames || selectedConfiguration.frame_id);
      hasSuspension = !!(selectedConfiguration.suspension || selectedConfiguration.suspensions || selectedConfiguration.suspension_id);
      hasWheels = !!(selectedConfiguration.wheel || selectedConfiguration.wheels || selectedConfiguration.wheel_id);
    }
  }

  // Calculate component scores
  Object.entries(COMPONENT_WEIGHTS).forEach(([componentType, weight]) => {
    breakdown.components.total += weight;
    let hasComponent = false;
    
    switch (componentType) {
      case 'engine': hasComponent = hasEngine; break;
      case 'brake_system': hasComponent = hasBrakes; break;
      case 'frame': hasComponent = hasFrame; break;
      case 'suspension': hasComponent = hasSuspension; break;
      case 'wheel': hasComponent = hasWheels; break;
    }
    
    if (hasComponent) {
      breakdown.components.score += weight;
      completedFields.push(`${componentType.replace('_', ' ')} component`);
    } else {
      missingFields.push(`${componentType.replace('_', ' ')} component`);
    }
  });

  // Calculate percentages for each section
  breakdown.basicInfo.percentage = breakdown.basicInfo.total > 0 
    ? Math.round((breakdown.basicInfo.score / breakdown.basicInfo.total) * 100) 
    : 0;
  breakdown.specifications.percentage = breakdown.specifications.total > 0 
    ? Math.round((breakdown.specifications.score / breakdown.specifications.total) * 100) 
    : 0;
  breakdown.components.percentage = breakdown.components.total > 0 
    ? Math.round((breakdown.components.score / breakdown.components.total) * 100) 
    : 0;
  breakdown.media.percentage = breakdown.media.total > 0 
    ? Math.round((breakdown.media.score / breakdown.media.total) * 100) 
    : 0;

  // Calculate weighted overall completion percentage
  const totalScore = 
    (breakdown.basicInfo.score / breakdown.basicInfo.total) * 0.30 +
    (breakdown.specifications.score / breakdown.specifications.total) * 0.35 +
    (breakdown.components.score / breakdown.components.total) * 0.25 +
    (breakdown.media.score / breakdown.media.total) * 0.10;

  const completionPercentage = Math.round(totalScore * 100);

  return {
    completionPercentage,
    missingFields,
    completedFields,
    criticalMissing,
    missingCriticalFields: criticalMissing,
    hasEngine,
    hasBrakes,
    hasFrame,
    hasSuspension,
    hasWheels,
    breakdown
  };
}

// Helper function to try getting specifications from components
async function tryGetSpecFromComponents(fieldKey: string, configuration: any, modelId: string): Promise<boolean> {
  try {
    // This would need to be expanded to actually query component data
    // For now, just return false - this is a placeholder for component spec integration
    switch (fieldKey) {
      case 'horsepower':
        return !!(configuration.engine?.power_hp || configuration.engines?.power_hp);
      case 'torque_nm':
        return !!(configuration.engine?.torque_nm || configuration.engines?.torque_nm);
      case 'engine_size':
        return !!(configuration.engine?.displacement_cc || configuration.engines?.displacement_cc);
      case 'weight_kg':
        return !!(configuration.weight_kg); // This might come from configuration
      default:
        return false;
    }
  } catch (error) {
    return false;
  }
}

// Synchronous version for immediate use (without model assignments check)
export function calculateDataCompletenessSync(motorcycle: Motorcycle, selectedConfiguration?: any): DataCompletion {
  const breakdown = {
    basicInfo: { score: 0, total: 0, percentage: 0 },
    specifications: { score: 0, total: 0, percentage: 0 },
    components: { score: 0, total: 0, percentage: 0 },
    media: { score: 0, total: 0, percentage: 0 }
  };

  const completedFields: string[] = [];
  const missingFields: string[] = [];
  const criticalMissing: string[] = [];

  // Calculate basic info score
  COMPLETION_FIELDS.basicInfo.forEach(field => {
    breakdown.basicInfo.total += field.weight;
    const value = motorcycle[field.key as keyof Motorcycle];
    const hasValue = value !== null && value !== undefined && value !== '';
    
    if (hasValue) {
      breakdown.basicInfo.score += field.weight;
      completedFields.push(field.label);
    } else {
      missingFields.push(field.label);
      if (field.critical) {
        criticalMissing.push(field.label);
      }
    }
  });

  // Calculate specifications score
  COMPLETION_FIELDS.specifications.forEach(field => {
    breakdown.specifications.total += field.weight;
    const value = motorcycle[field.key as keyof Motorcycle];
    const hasValue = value !== null && value !== undefined && value !== 0 && value !== '';
    
    if (hasValue) {
      breakdown.specifications.score += field.weight;
      completedFields.push(field.label);
    } else {
      missingFields.push(field.label);
    }
  });

  // Calculate media score
  COMPLETION_FIELDS.media.forEach(field => {
    breakdown.media.total += field.weight;
    const value = motorcycle[field.key as keyof Motorcycle];
    const hasValue = value !== null && value !== undefined && value !== '';
    
    if (hasValue) {
      breakdown.media.score += field.weight;
      completedFields.push(field.label);
    } else {
      missingFields.push(field.label);
    }
  });

  // Calculate component score (sync version - configuration only)
  const hasEngine = !!(selectedConfiguration?.engine || selectedConfiguration?.engines || selectedConfiguration?.engine_id);
  const hasBrakes = !!(selectedConfiguration?.brake_system || selectedConfiguration?.brake_systems || selectedConfiguration?.brake_system_id);
  const hasFrame = !!(selectedConfiguration?.frame || selectedConfiguration?.frames || selectedConfiguration?.frame_id);
  const hasSuspension = !!(selectedConfiguration?.suspension || selectedConfiguration?.suspensions || selectedConfiguration?.suspension_id);
  const hasWheels = !!(selectedConfiguration?.wheel || selectedConfiguration?.wheels || selectedConfiguration?.wheel_id);

  // Calculate component scores
  Object.entries(COMPONENT_WEIGHTS).forEach(([componentType, weight]) => {
    breakdown.components.total += weight;
    let hasComponent = false;
    
    switch (componentType) {
      case 'engine': hasComponent = hasEngine; break;
      case 'brake_system': hasComponent = hasBrakes; break;
      case 'frame': hasComponent = hasFrame; break;
      case 'suspension': hasComponent = hasSuspension; break;
      case 'wheel': hasComponent = hasWheels; break;
    }
    
    if (hasComponent) {
      breakdown.components.score += weight;
      completedFields.push(`${componentType.replace('_', ' ')} component`);
    } else {
      missingFields.push(`${componentType.replace('_', ' ')} component`);
    }
  });

  // Calculate percentages for each section
  breakdown.basicInfo.percentage = breakdown.basicInfo.total > 0 
    ? Math.round((breakdown.basicInfo.score / breakdown.basicInfo.total) * 100) 
    : 0;
  breakdown.specifications.percentage = breakdown.specifications.total > 0 
    ? Math.round((breakdown.specifications.score / breakdown.specifications.total) * 100) 
    : 0;
  breakdown.components.percentage = breakdown.components.total > 0 
    ? Math.round((breakdown.components.score / breakdown.components.total) * 100) 
    : 0;
  breakdown.media.percentage = breakdown.media.total > 0 
    ? Math.round((breakdown.media.score / breakdown.media.total) * 100) 
    : 0;

  // Calculate weighted overall completion percentage
  const totalScore = 
    (breakdown.basicInfo.score / breakdown.basicInfo.total) * 0.30 +
    (breakdown.specifications.score / breakdown.specifications.total) * 0.35 +
    (breakdown.components.score / breakdown.components.total) * 0.25 +
    (breakdown.media.score / breakdown.media.total) * 0.10;

  const completionPercentage = Math.round(totalScore * 100);

  return {
    completionPercentage,
    missingFields,
    completedFields,
    criticalMissing,
    missingCriticalFields: criticalMissing,
    hasEngine,
    hasBrakes,
    hasFrame,
    hasSuspension,
    hasWheels,
    breakdown
  };
}

export function getCompletionColor(percentage: number): string {
  if (percentage >= 90) return 'text-green-400';
  if (percentage >= 70) return 'text-yellow-400';
  if (percentage >= 50) return 'text-orange-400';
  return 'text-red-400';
}

export function getCompletionStatus(motorcycle: Motorcycle): {
  status: 'complete' | 'good' | 'needs-work' | 'incomplete';
  color: string;
  message: string;
} {
  const completion = calculateDataCompletenessSync(motorcycle);
  
  if (completion.criticalMissing.length > 0) {
    return {
      status: 'incomplete',
      color: 'text-red-400',
      message: `Missing critical fields: ${completion.criticalMissing.join(', ')}`
    };
  }
  
  if (completion.completionPercentage >= 90) {
    return {
      status: 'complete',
      color: 'text-green-400',
      message: 'Model data is complete'
    };
  }
  
  if (completion.completionPercentage >= 70) {
    return {
      status: 'good',
      color: 'text-yellow-400',
      message: `${completion.missingFields.length} optional fields missing`
    };
  }
  
  return {
    status: 'needs-work',
    color: 'text-orange-400',
    message: `${completion.missingFields.length} fields need attention`
  };
}
