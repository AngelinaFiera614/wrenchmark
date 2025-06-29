
import { Motorcycle } from "@/types";
import { getModelComponentAssignments } from "@/services/modelComponentService";

export interface MotorcycleCompleteness {
  percentage: number;
  missingFields: string[];
  completedFields: string[];
  status: 'excellent' | 'good' | 'fair' | 'poor';
  statusColor: string;
  hasComponents: boolean;
  componentStatus: {
    hasEngine: boolean;
    hasBrakes: boolean;
    hasFrame: boolean;
    hasSuspension: boolean;
    hasWheels: boolean;
  };
}

export async function calculateMotorcycleCompleteness(motorcycle: Motorcycle): Promise<MotorcycleCompleteness> {
  const requiredFields = [
    { key: 'name', label: 'Name', weight: 2 },
    { key: 'brand_id', label: 'Brand', weight: 2 },
    { key: 'type', label: 'Type', weight: 2 },
    { key: 'production_start_year', label: 'Production Year', weight: 1 },
    { key: 'engine_size', label: 'Engine Size', weight: 1.5 },
    { key: 'horsepower', label: 'Horsepower', weight: 1.5 },
    { key: 'weight_kg', label: 'Weight', weight: 1 },
    { key: 'base_description', label: 'Description', weight: 1 },
    { key: 'default_image_url', label: 'Image', weight: 1 },
    { key: 'seat_height_mm', label: 'Seat Height', weight: 0.5 },
  ];

  let totalWeight = 0;
  let completedWeight = 0;
  const missingFields: string[] = [];
  const completedFields: string[] = [];

  requiredFields.forEach(field => {
    totalWeight += field.weight;
    const value = motorcycle[field.key as keyof Motorcycle];
    const hasValue = value !== null && value !== undefined && value !== '';
    
    if (hasValue) {
      completedWeight += field.weight;
      completedFields.push(field.label);
    } else {
      missingFields.push(field.label);
    }
  });

  // Check for brand name availability
  const hasBrandName = !!(motorcycle.brand?.name || motorcycle.brands?.name);
  if (!hasBrandName && !missingFields.includes('Brand Name')) {
    missingFields.push('Brand Name');
  } else if (hasBrandName && !completedFields.includes('Brand Name')) {
    completedFields.push('Brand Name');
    completedWeight += 0.5; // Small bonus for brand name
    totalWeight += 0.5;
  }

  // Check component assignments
  let componentStatus = {
    hasEngine: false,
    hasBrakes: false,
    hasFrame: false,
    hasSuspension: false,
    hasWheels: false,
  };

  try {
    const assignments = await getModelComponentAssignments(motorcycle.id);
    
    assignments.forEach(assignment => {
      switch (assignment.component_type) {
        case 'engine':
          componentStatus.hasEngine = true;
          break;
        case 'brake_system':
          componentStatus.hasBrakes = true;
          break;
        case 'frame':
          componentStatus.hasFrame = true;
          break;
        case 'suspension':
          componentStatus.hasSuspension = true;
          break;
        case 'wheel':
          componentStatus.hasWheels = true;
          break;
      }
    });

    // Add component bonus to completeness
    const componentCount = Object.values(componentStatus).filter(Boolean).length;
    const componentBonus = componentCount * 2; // 2 points per component
    completedWeight += componentBonus;
    totalWeight += 10; // Max 10 points for all 5 components

    // Update completed/missing fields based on components
    if (componentStatus.hasEngine) completedFields.push('Engine');
    else missingFields.push('Engine');
    
    if (componentStatus.hasBrakes) completedFields.push('Brake System');
    else missingFields.push('Brake System');
    
    if (componentStatus.hasFrame) completedFields.push('Frame');
    else missingFields.push('Frame');
    
    if (componentStatus.hasSuspension) completedFields.push('Suspension');
    else missingFields.push('Suspension');
    
    if (componentStatus.hasWheels) completedFields.push('Wheels');
    else missingFields.push('Wheels');

  } catch (error) {
    console.error('Error checking component assignments:', error);
    // Add component fields to missing if we can't check
    missingFields.push('Engine', 'Brake System', 'Frame', 'Suspension', 'Wheels');
    totalWeight += 10;
  }

  const percentage = Math.round((completedWeight / totalWeight) * 100);
  const hasComponents = Object.values(componentStatus).some(Boolean);
  
  let status: MotorcycleCompleteness['status'];
  let statusColor: string;

  if (percentage >= 90) {
    status = 'excellent';
    statusColor = 'text-green-600';
  } else if (percentage >= 70) {
    status = 'good';
    statusColor = 'text-yellow-600';
  } else if (percentage >= 50) {
    status = 'fair';
    statusColor = 'text-orange-600';
  } else {
    status = 'poor';
    statusColor = 'text-red-600';
  }

  return {
    percentage,
    missingFields,
    completedFields,
    status,
    statusColor,
    hasComponents,
    componentStatus
  };
}

// Synchronous version for immediate use (without model assignments check)
export function calculateMotorcycleCompletenessSync(motorcycle: Motorcycle): MotorcycleCompleteness {
  const requiredFields = [
    { key: 'name', label: 'Name', weight: 2 },
    { key: 'brand_id', label: 'Brand', weight: 2 },
    { key: 'type', label: 'Type', weight: 2 },
    { key: 'production_start_year', label: 'Production Year', weight: 1 },
    { key: 'engine_size', label: 'Engine Size', weight: 1.5 },
    { key: 'horsepower', label: 'Horsepower', weight: 1.5 },
    { key: 'weight_kg', label: 'Weight', weight: 1 },
    { key: 'base_description', label: 'Description', weight: 1 },
    { key: 'default_image_url', label: 'Image', weight: 1 },
    { key: 'seat_height_mm', label: 'Seat Height', weight: 0.5 },
  ];

  let totalWeight = 0;
  let completedWeight = 0;
  const missingFields: string[] = [];
  const completedFields: string[] = [];

  requiredFields.forEach(field => {
    totalWeight += field.weight;
    const value = motorcycle[field.key as keyof Motorcycle];
    const hasValue = value !== null && value !== undefined && value !== '';
    
    if (hasValue) {
      completedWeight += field.weight;
      completedFields.push(field.label);
    } else {
      missingFields.push(field.label);
    }
  });

  // Check for brand name availability
  const hasBrandName = !!(motorcycle.brand?.name || motorcycle.brands?.name);
  if (!hasBrandName && !missingFields.includes('Brand Name')) {
    missingFields.push('Brand Name');
  }

  const percentage = Math.round((completedWeight / totalWeight) * 100);
  
  let status: MotorcycleCompleteness['status'];
  let statusColor: string;

  if (percentage >= 90) {
    status = 'excellent';
    statusColor = 'text-green-600';
  } else if (percentage >= 70) {
    status = 'good';
    statusColor = 'text-yellow-600';
  } else if (percentage >= 50) {
    status = 'fair';
    statusColor = 'text-orange-600';
  } else {
    status = 'poor';
    statusColor = 'text-red-600';
  }

  return {
    percentage,
    missingFields,
    completedFields,
    status,
    statusColor,
    hasComponents: false,
    componentStatus: {
      hasEngine: false,
      hasBrakes: false,
      hasFrame: false,
      hasSuspension: false,
      hasWheels: false,
    }
  };
}

export function getCompletionLabel(status: MotorcycleCompleteness['status']): string {
  switch (status) {
    case 'excellent': return 'Excellent';
    case 'good': return 'Good';
    case 'fair': return 'Needs Work';
    case 'poor': return 'Incomplete';
    default: return 'Unknown';
  }
}
