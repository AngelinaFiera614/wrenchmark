
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

export async function calculateDataCompleteness(
  motorcycle: Motorcycle, 
  selectedConfiguration?: any
): Promise<DataCompletion> {
  const requiredFields = [
    { key: 'name', label: 'Name', critical: true },
    { key: 'brand_id', label: 'Brand', critical: true },
    { key: 'type', label: 'Type', critical: true },
    { key: 'production_start_year', label: 'Production Start Year', critical: false },
    { key: 'base_description', label: 'Description', critical: false },
    { key: 'default_image_url', label: 'Default Image', critical: false },
    { key: 'engine_size', label: 'Engine Size', critical: false },
    { key: 'horsepower', label: 'Horsepower', critical: false },
    { key: 'weight_kg', label: 'Weight', critical: false },
    { key: 'seat_height_mm', label: 'Seat Height', critical: false },
  ];

  const completedFields: string[] = [];
  const missingFields: string[] = [];
  const criticalMissing: string[] = [];

  requiredFields.forEach(field => {
    const value = motorcycle[field.key as keyof Motorcycle];
    const hasValue = value !== null && value !== undefined && value !== '';
    
    if (hasValue) {
      completedFields.push(field.label);
    } else {
      missingFields.push(field.label);
      if (field.critical) {
        criticalMissing.push(field.label);
      }
    }
  });

  // Check for brand name availability (handles different data structures)
  const hasBrandName = !!(
    motorcycle.brand?.name || 
    motorcycle.brands?.name || 
    motorcycle.make
  );

  if (!hasBrandName && !criticalMissing.includes('Brand')) {
    criticalMissing.push('Brand Display Name');
    missingFields.push('Brand Display Name');
  }

  // Check component availability from model assignments
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

  const completionPercentage = Math.round(
    (completedFields.length / requiredFields.length) * 100
  );

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
    hasWheels
  };
}

// Synchronous version for immediate use (without model assignments check)
export function calculateDataCompletenessSync(motorcycle: Motorcycle, selectedConfiguration?: any): DataCompletion {
  const requiredFields = [
    { key: 'name', label: 'Name', critical: true },
    { key: 'brand_id', label: 'Brand', critical: true },
    { key: 'type', label: 'Type', critical: true },
    { key: 'production_start_year', label: 'Production Start Year', critical: false },
    { key: 'base_description', label: 'Description', critical: false },
    { key: 'default_image_url', label: 'Default Image', critical: false },
    { key: 'engine_size', label: 'Engine Size', critical: false },
    { key: 'horsepower', label: 'Horsepower', critical: false },
    { key: 'weight_kg', label: 'Weight', critical: false },
    { key: 'seat_height_mm', label: 'Seat Height', critical: false },
  ];

  const completedFields: string[] = [];
  const missingFields: string[] = [];
  const criticalMissing: string[] = [];

  requiredFields.forEach(field => {
    const value = motorcycle[field.key as keyof Motorcycle];
    const hasValue = value !== null && value !== undefined && value !== '';
    
    if (hasValue) {
      completedFields.push(field.label);
    } else {
      missingFields.push(field.label);
      if (field.critical) {
        criticalMissing.push(field.label);
      }
    }
  });

  // Check for brand name availability (handles different data structures)
  const hasBrandName = !!(
    motorcycle.brand?.name || 
    motorcycle.brands?.name || 
    motorcycle.make
  );

  if (!hasBrandName && !criticalMissing.includes('Brand')) {
    criticalMissing.push('Brand Display Name');
    missingFields.push('Brand Display Name');
  }

  // Check component availability from configuration only (for sync version)
  const hasEngine = !!(selectedConfiguration?.engine || selectedConfiguration?.engines || selectedConfiguration?.engine_id);
  const hasBrakes = !!(selectedConfiguration?.brake_system || selectedConfiguration?.brake_systems || selectedConfiguration?.brake_system_id);
  const hasFrame = !!(selectedConfiguration?.frame || selectedConfiguration?.frames || selectedConfiguration?.frame_id);
  const hasSuspension = !!(selectedConfiguration?.suspension || selectedConfiguration?.suspensions || selectedConfiguration?.suspension_id);
  const hasWheels = !!(selectedConfiguration?.wheel || selectedConfiguration?.wheels || selectedConfiguration?.wheel_id);

  const completionPercentage = Math.round(
    (completedFields.length / requiredFields.length) * 100
  );

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
    hasWheels
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
