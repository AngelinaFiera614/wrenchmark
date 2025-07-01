
import React, { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, Cog, Disc, Box, Zap, Circle, User, FileText, Image, Wrench } from "lucide-react";
import { calculateDataCompleteness, calculateDataCompletenessSync, DataCompletion } from "@/utils/dataCompleteness";
import { Motorcycle } from "@/types";

interface MotorcycleCompletenessIndicatorProps {
  motorcycle?: Motorcycle;
  completeness?: DataCompletion;
  showDetails?: boolean;
  variant?: 'card' | 'detail' | 'admin';
}

const MotorcycleCompletenessIndicator = ({ 
  motorcycle,
  completeness: propCompleteness, 
  showDetails = true,
  variant = 'admin'
}: MotorcycleCompletenessIndicatorProps) => {
  const [completeness, setCompleteness] = useState<DataCompletion | null>(propCompleteness || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (motorcycle && !propCompleteness) {
      setLoading(true);
      calculateDataCompleteness(motorcycle)
        .then(setCompleteness)
        .catch(() => {
          // Fallback to sync version if async fails
          setCompleteness(calculateDataCompletenessSync(motorcycle));
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
      case 'brake_system': return <Disc className="h-3 w-3" />;
      case 'frame': return <Box className="h-3 w-3" />;
      case 'suspension': return <Zap className="h-3 w-3" />;
      case 'wheel': return <Circle className="h-3 w-3" />;
      default: return null;
    }
  };

  const getSectionIcon = (section: string) => {
    switch (section) {
      case 'basicInfo': return <User className="h-4 w-4" />;
      case 'specifications': return <FileText className="h-4 w-4" />;
      case 'components': return <Wrench className="h-4 w-4" />;
      case 'media': return <Image className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Progress 
            value={completeness.completionPercentage} 
            className="h-2"
          />
        </div>
        <span className={`text-sm font-medium ${getProgressColor(completeness.completionPercentage).replace('bg-', 'text-')}`}>
          {completeness.completionPercentage}%
        </span>
        {showDetails && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">Completion Breakdown</p>
                    <p className="text-sm text-muted-foreground">Weighted scoring system</p>
                  </div>
                  
                  {/* Section Breakdown */}
                  <div className="space-y-2">
                    {Object.entries(completeness.breakdown).map(([sectionKey, section]) => (
                      <div key={sectionKey} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getSectionIcon(sectionKey)}
                          <span className="text-sm capitalize">
                            {sectionKey === 'basicInfo' ? 'Basic Info' : sectionKey}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({sectionKey === 'basicInfo' ? '30%' : 
                              sectionKey === 'specifications' ? '35%' :
                              sectionKey === 'components' ? '25%' : '10%'})
                          </span>
                        </div>
                        <span className={`text-sm ${section.percentage >= 80 ? 'text-green-400' : 
                          section.percentage >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {section.percentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Component Status */}
                  <div className="border-t pt-2">
                    <p className="text-sm font-medium mb-1">Components:</p>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <div className={`flex items-center gap-1 ${completeness.hasEngine ? 'text-green-600' : 'text-red-600'}`}>
                        {getComponentIcon('engine')}
                        Engine
                      </div>
                      <div className={`flex items-center gap-1 ${completeness.hasBrakes ? 'text-green-600' : 'text-red-600'}`}>
                        {getComponentIcon('brake_system')}
                        Brakes
                      </div>
                      <div className={`flex items-center gap-1 ${completeness.hasFrame ? 'text-green-600' : 'text-red-600'}`}>
                        {getComponentIcon('frame')}
                        Frame
                      </div>
                      <div className={`flex items-center gap-1 ${completeness.hasSuspension ? 'text-green-600' : 'text-red-600'}`}>
                        {getComponentIcon('suspension')}
                        Suspension
                      </div>
                      <div className={`flex items-center gap-1 ${completeness.hasWheels ? 'text-green-600' : 'text-red-600'}`}>
                        {getComponentIcon('wheel')}
                        Wheels
                      </div>
                    </div>
                  </div>
                  
                  {completeness.missingCriticalFields.length > 0 && (
                    <div className="border-t pt-2">
                      <p className="text-sm font-medium text-red-600">Critical Missing:</p>
                      <p className="text-xs">{completeness.missingCriticalFields.join(', ')}</p>
                    </div>
                  )}
                  
                  <div className="text-xs text-muted-foreground">
                    New weighted scoring: Basic Info (30%), Specs (35%), Components (25%), Media (10%)
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      {variant === 'admin' && (
        <div className="flex items-center gap-2">
          <Badge 
            variant="outline" 
            className={`text-xs ${completeness.completionPercentage >= 90 ? 'text-green-400 border-green-400' :
              completeness.completionPercentage >= 70 ? 'text-yellow-400 border-yellow-400' :
              completeness.completionPercentage >= 50 ? 'text-orange-400 border-orange-400' :
              'text-red-400 border-red-400'}`}
          >
            {completeness.completionPercentage >= 90 ? 'Excellent' :
             completeness.completionPercentage >= 70 ? 'Good' :
             completeness.completionPercentage >= 50 ? 'Fair' : 'Poor'}
          </Badge>
          
          <span className="text-xs text-muted-foreground">
            {completeness.completedFields.length} of {completeness.completedFields.length + completeness.missingFields.length} fields
          </span>
          
          {(completeness.hasEngine || completeness.hasBrakes || completeness.hasFrame || 
            completeness.hasSuspension || completeness.hasWheels) && (
            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
              {[completeness.hasEngine, completeness.hasBrakes, completeness.hasFrame, 
                completeness.hasSuspension, completeness.hasWheels].filter(Boolean).length}/5 Components
            </Badge>
          )}
        </div>
      )}
      
      {variant === 'admin' && showDetails && (
        <div className="grid grid-cols-4 gap-2">
          {Object.entries(completeness.breakdown).map(([sectionKey, section]) => (
            <div key={sectionKey} className="text-center">
              <div className={`text-sm ${section.percentage >= 80 ? 'text-green-400' : 
                section.percentage >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                {section.percentage}%
              </div>
              <div className="text-xs text-muted-foreground capitalize">
                {sectionKey === 'basicInfo' ? 'Basic' : sectionKey}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MotorcycleCompletenessIndicator;
