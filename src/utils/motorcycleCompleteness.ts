
import { Motorcycle } from "@/types";

export interface MotorcycleCompleteness {
  percentage: number;
  missingFields: string[];
  completedFields: string[];
  status: 'excellent' | 'good' | 'fair' | 'poor';
  statusColor: string;
}

export function calculateMotorcycleCompleteness(motorcycle: Motorcycle): MotorcycleCompleteness {
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
    statusColor
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
