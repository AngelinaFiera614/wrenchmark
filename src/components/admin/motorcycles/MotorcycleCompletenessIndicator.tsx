
import React, { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, Cog, Disc, Box, Zap, Circle } from "lucide-react";
import { calculateMotorcycleCompleteness, calculateMotorcycleCompletenessSync, MotorcycleCompleteness, getCompletionLabel } from "@/utils/motorcycleCompleteness";
import { Motorcycle } from "@/types";

interface MotorcycleCompletenessIndicatorProps {
  motorcycle?: Motorcycle;
  completeness?: MotorcycleCompleteness;
  showDetails?: boolean;
}

const MotorcycleCompletenessIndicator = ({ 
  motorcycle,
  completeness: propCompleteness, 
  showDetails = true 
}: MotorcycleCompletenessIndicatorProps) => {
  const [completeness, setCompleteness] = useState<MotorcycleCompleteness | null>(propCompleteness || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (motorcycle && !propCompleteness) {
      setLoading(true);
      calculateMotorcycleCompleteness(motorcycle)
        .then(setCompleteness)
        .catch(() => {
          // Fallback to sync version if async fails
          setCompleteness(calculateMotorcycleCompletenessSync(motorcycle));
        })
        .finally(() => setLoading(false));
    }
  }, [motorcycle, propCompleteness]);

  if (!completeness && !loading) {
    return null;
  }

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <div className="h-2 bg-gray-200 rounded animate-pulse" />
          </div>
          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  if (!completeness) return null;

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-green-500";
    if (percentage >= 70) return "bg-yellow-500";
    if (percentage >= 50) return "bg-orange-500";
    return "bg-red-500";
  };

  const getComponentIcon = (componentType: string) => {
    switch (componentType) {
      case 'engine': return <Cog className="h-3 w-3" />;
      case 'brake': return <Disc className="h-3 w-3" />;
      case 'frame': return <Box className="h-3 w-3" />;
      case 'suspension': return <Zap className="h-3 w-3" />;
      case 'wheel': return <Circle className="h-3 w-3" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Progress 
            value={completeness.percentage} 
            className="h-2"
          />
        </div>
        <span className={`text-sm font-medium ${completeness.statusColor}`}>
          {completeness.percentage}%
        </span>
        {showDetails && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <div className="space-y-2">
                  <div>
                    <p className="font-medium">Status: {getCompletionLabel(completeness.status)}</p>
                  </div>
                  
                  {/* Component Status */}
                  {completeness.hasComponents && (
                    <div className="border-t pt-2">
                      <p className="text-sm font-medium text-green-600 mb-1">Components Linked:</p>
                      <div className="grid grid-cols-2 gap-1 text-xs">
                        {completeness.componentStatus.hasEngine && (
                          <div className="flex items-center gap-1 text-green-600">
                            {getComponentIcon('engine')}
                            Engine
                          </div>
                        )}
                        {completeness.componentStatus.hasBrakes && (
                          <div className="flex items-center gap-1 text-green-600">
                            {getComponentIcon('brake')}
                            Brakes
                          </div>
                        )}
                        {completeness.componentStatus.hasFrame && (
                          <div className="flex items-center gap-1 text-green-600">
                            {getComponentIcon('frame')}
                            Frame
                          </div>
                        )}
                        {completeness.componentStatus.hasSuspension && (
                          <div className="flex items-center gap-1 text-green-600">
                            {getComponentIcon('suspension')}
                            Suspension
                          </div>
                        )}
                        {completeness.componentStatus.hasWheels && (
                          <div className="flex items-center gap-1 text-green-600">
                            {getComponentIcon('wheel')}
                            Wheels
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {completeness.missingFields.length > 0 && (
                    <div className="border-t pt-2">
                      <p className="text-sm font-medium text-red-600">Missing:</p>
                      <p className="text-xs">{completeness.missingFields.slice(0, 5).join(', ')}</p>
                      {completeness.missingFields.length > 5 && (
                        <p className="text-xs text-muted-foreground">
                          +{completeness.missingFields.length - 5} more
                        </p>
                      )}
                    </div>
                  )}
                  
                  {completeness.completedFields.length > 0 && (
                    <div className="border-t pt-2">
                      <p className="text-sm font-medium text-green-600">Complete:</p>
                      <p className="text-xs">{completeness.completedFields.slice(0, 5).join(', ')}</p>
                      {completeness.completedFields.length > 5 && (
                        <p className="text-xs text-muted-foreground">
                          +{completeness.completedFields.length - 5} more
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <Badge 
          variant="outline" 
          className={`text-xs ${completeness.statusColor} border-current`}
        >
          {getCompletionLabel(completeness.status)}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {completeness.completedFields.length} of {completeness.completedFields.length + completeness.missingFields.length} fields
        </span>
        {completeness.hasComponents && (
          <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
            Components Linked
          </Badge>
        )}
      </div>
    </div>
  );
};

export default MotorcycleCompletenessIndicator;
