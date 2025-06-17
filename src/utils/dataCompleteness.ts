
export interface DataCompletenessStatus {
  hasEngine: boolean;
  hasBrakes: boolean;
  hasFrame: boolean;
  hasSuspension: boolean;
  hasWheels: boolean;
  hasDimensions: boolean;
  completionPercentage: number;
  missingCriticalFields: string[];
}

export function calculateDataCompleteness(motorcycle: any, selectedConfiguration?: any): DataCompletenessStatus {
  const config = selectedConfiguration || motorcycle._componentData?.selectedConfiguration;
  
  // Check for component data
  const hasEngine = !!(config?.engines?.id || config?.engine?.id || motorcycle.engine_size > 0);
  const hasBrakes = !!(config?.brake_systems?.id || config?.brakes?.id || motorcycle.brake_type);
  const hasFrame = !!(config?.frames?.id || config?.frame?.id);
  const hasSuspension = !!(config?.suspensions?.id || config?.suspension?.id);
  const hasWheels = !!(config?.wheels?.id || config?.wheel?.id);
  
  // Check for basic dimensions
  const hasDimensions = !!(
    motorcycle.seat_height_mm > 0 || 
    motorcycle.weight_kg > 0 || 
    motorcycle.wheelbase_mm > 0 ||
    config?.seat_height_mm > 0 ||
    config?.weight_kg > 0 ||
    config?.wheelbase_mm > 0
  );

  const components = [hasEngine, hasBrakes, hasFrame, hasSuspension, hasWheels, hasDimensions];
  const completeComponents = components.filter(Boolean).length;
  const completionPercentage = Math.round((completeComponents / components.length) * 100);

  const missingCriticalFields = [];
  if (!hasEngine) missingCriticalFields.push('Engine');
  if (!hasBrakes) missingCriticalFields.push('Brakes');
  if (!hasFrame) missingCriticalFields.push('Frame');
  if (!hasSuspension) missingCriticalFields.push('Suspension');
  if (!hasWheels) missingCriticalFields.push('Wheels');
  if (!hasDimensions) missingCriticalFields.push('Dimensions');

  return {
    hasEngine,
    hasBrakes,
    hasFrame,
    hasSuspension,
    hasWheels,
    hasDimensions,
    completionPercentage,
    missingCriticalFields
  };
}

export function getDataCompletenessColor(percentage: number): string {
  if (percentage >= 80) return 'text-green-600';
  if (percentage >= 60) return 'text-yellow-600';
  if (percentage >= 40) return 'text-orange-600';
  return 'text-red-600';
}

export function getDataCompletenessIcon(percentage: number): string {
  if (percentage >= 80) return 'check-circle';
  if (percentage >= 60) return 'alert-circle';
  return 'x-circle';
}
