
import React from "react";
import { AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";
import { MotorcycleModel, ModelYear, Configuration } from "@/types/motorcycle";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface ValidationIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  fix?: string;
  section: 'basic' | 'components' | 'dimensions' | 'metrics' | 'notes';
}

export interface ValidationResult {
  isValid: boolean;
  completeness: number;
  issues: ValidationIssue[];
  sectionStatus: Record<string, 'complete' | 'partial' | 'missing'>;
}

export const validateConfiguration = (
  config: Configuration | undefined,
  modelData: MotorcycleModel | undefined,
  yearData: ModelYear | undefined,
  allConfigs: Configuration[]
): ValidationResult => {
  const issues: ValidationIssue[] = [];
  const sectionStatus: Record<string, 'complete' | 'partial' | 'missing'> = {
    basic: 'missing',
    components: 'missing',
    dimensions: 'missing',
    metrics: 'missing',
    notes: 'complete'
  };

  if (!config) {
    return {
      isValid: false,
      completeness: 0,
      issues: [{ type: 'error', message: 'No configuration selected', section: 'basic' }],
      sectionStatus
    };
  }

  // Basic Info Validation
  let basicScore = 0;
  if (config.name) basicScore += 25;
  if (config.market_region) basicScore += 25;
  if (config.msrp_usd) basicScore += 25;
  if (config.trim_level) basicScore += 25;

  if (!config.name) {
    issues.push({
      type: 'error',
      message: 'Configuration name is required',
      fix: 'Add a descriptive name for this trim level',
      section: 'basic'
    });
  }

  // Check for default configuration
  const hasDefault = allConfigs.some(c => c.is_default);
  if (!hasDefault) {
    issues.push({
      type: 'error',
      message: 'No default configuration set for this year',
      fix: 'Mark one configuration as default',
      section: 'basic'
    });
  }

  // Components Validation
  let componentScore = 0;
  const requiredComponents = ['engine_id', 'brake_system_id', 'frame_id'];
  const optionalComponents = ['suspension_id', 'wheel_id'];

  requiredComponents.forEach(component => {
    if (config[component as keyof Configuration]) {
      componentScore += 60 / requiredComponents.length;
    } else {
      issues.push({
        type: 'error',
        message: `Missing ${component.replace('_id', '').replace('_', ' ')} component`,
        fix: `Select a ${component.replace('_id', '').replace('_', ' ')} from the components tab`,
        section: 'components'
      });
    }
  });

  optionalComponents.forEach(component => {
    if (config[component as keyof Configuration]) {
      componentScore += 40 / optionalComponents.length;
    } else {
      issues.push({
        type: 'warning',
        message: `Missing ${component.replace('_id', '').replace('_', ' ')} component`,
        fix: `Consider adding ${component.replace('_id', '').replace('_', ' ')} for completeness`,
        section: 'components'
      });
    }
  });

  // Dimensions Validation
  let dimensionScore = 0;
  const dimensionFields = ['seat_height_mm', 'weight_kg', 'wheelbase_mm', 'fuel_capacity_l', 'ground_clearance_mm'];
  
  dimensionFields.forEach(field => {
    if (config[field as keyof Configuration]) {
      dimensionScore += 100 / dimensionFields.length;
    } else {
      issues.push({
        type: 'warning',
        message: `Missing ${field.replace('_', ' ').replace('mm', '').replace('kg', '').replace('l', '')}`,
        fix: `Add ${field.replace('_', ' ')} in the dimensions tab`,
        section: 'dimensions'
      });
    }
  });

  // Update section status
  sectionStatus.basic = basicScore >= 75 ? 'complete' : basicScore > 0 ? 'partial' : 'missing';
  sectionStatus.components = componentScore >= 80 ? 'complete' : componentScore > 0 ? 'partial' : 'missing';
  sectionStatus.dimensions = dimensionScore >= 60 ? 'complete' : dimensionScore > 0 ? 'partial' : 'missing';
  sectionStatus.metrics = config.msrp_usd ? 'complete' : 'partial';

  const overallCompleteness = Math.round((basicScore + componentScore + dimensionScore) / 3);
  const hasErrors = issues.some(issue => issue.type === 'error');

  return {
    isValid: !hasErrors,
    completeness: overallCompleteness,
    issues,
    sectionStatus
  };
};

interface ValidationIndicatorProps {
  status: 'complete' | 'partial' | 'missing';
  issues?: ValidationIssue[];
  compact?: boolean;
}

export const ValidationIndicator: React.FC<ValidationIndicatorProps> = ({ status, issues = [], compact = false }) => {
  const getIcon = () => {
    switch (status) {
      case 'complete': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'partial': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'missing': return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const getTooltipContent = () => {
    if (issues.length === 0) return status === 'complete' ? 'Section complete' : 'No issues found';
    
    return (
      <div className="space-y-1">
        {issues.map((issue, index) => (
          <div key={index} className="text-xs">
            <div className="font-medium">{issue.message}</div>
            {issue.fix && <div className="text-gray-400">{issue.fix}</div>}
          </div>
        ))}
      </div>
    );
  };

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {getIcon()}
          </TooltipTrigger>
          <TooltipContent>
            {getTooltipContent()}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className="gap-1">
            {getIcon()}
            <span className="capitalize">{status}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          {getTooltipContent()}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
