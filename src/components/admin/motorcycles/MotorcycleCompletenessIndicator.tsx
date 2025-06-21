
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { MotorcycleCompleteness, getCompletionLabel } from "@/utils/motorcycleCompleteness";

interface MotorcycleCompletenessIndicatorProps {
  completeness: MotorcycleCompleteness;
  showDetails?: boolean;
}

const MotorcycleCompletenessIndicator = ({ 
  completeness, 
  showDetails = true 
}: MotorcycleCompletenessIndicatorProps) => {
  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-green-500";
    if (percentage >= 70) return "bg-yellow-500";
    if (percentage >= 50) return "bg-orange-500";
    return "bg-red-500";
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
                  {completeness.missingFields.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-red-600">Missing:</p>
                      <p className="text-xs">{completeness.missingFields.join(', ')}</p>
                    </div>
                  )}
                  {completeness.completedFields.length > 0 && (
                    <div>
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
      </div>
    </div>
  );
};

export default MotorcycleCompletenessIndicator;
