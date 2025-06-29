
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertTriangle, CheckCircle, Cog, Disc, Box, Zap, Circle } from 'lucide-react';
import { calculateDataCompleteness, calculateDataCompletenessSync, DataCompletion } from '@/utils/dataCompleteness';
import { Motorcycle } from '@/types';

interface DataCompletenessIndicatorProps {
  motorcycle?: Motorcycle;
  status?: DataCompletion;
  variant?: 'card' | 'detail' | 'admin';
  showDetails?: boolean;
}

export function DataCompletenessIndicator({ 
  motorcycle,
  status: propStatus, 
  variant = 'card', 
  showDetails = false 
}: DataCompletenessIndicatorProps) {
  const [status, setStatus] = useState<DataCompletion | null>(propStatus || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (motorcycle && !propStatus) {
      setLoading(true);
      calculateDataCompleteness(motorcycle)
        .then(setStatus)
        .catch(() => {
          // Fallback to sync version if async fails
          setStatus(calculateDataCompletenessSync(motorcycle));
        })
        .finally(() => setLoading(false));
    }
  }, [motorcycle, propStatus]);

  if (!status && !loading) {
    return null;
  }

  if (loading) {
    return (
      <Badge variant="outline" className="text-xs">
        <div className="animate-spin h-3 w-3 mr-1 border-2 border-current border-t-transparent rounded-full" />
        Loading...
      </Badge>
    );
  }

  if (!status) return null;

  const { completionPercentage, missingCriticalFields } = status;

  if (completionPercentage === 100) {
    return variant === 'card' ? (
      <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
        <CheckCircle className="h-3 w-3 mr-1" />
        Complete
      </Badge>
    ) : null;
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'admin':
        return 'text-sm border-orange-200 bg-orange-50 text-orange-700';
      case 'detail':
        return 'text-sm border-orange-200 bg-orange-50 text-orange-700';
      default:
        return 'text-xs border-orange-200 bg-orange-50 text-orange-700';
    }
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

  const content = (
    <Badge variant="outline" className={getVariantStyles()}>
      <AlertTriangle className="h-3 w-3 mr-1" />
      {variant === 'admin' ? `${completionPercentage}% Complete` : 'Incomplete'}
    </Badge>
  );

  if (!showDetails && missingCriticalFields.length === 0) {
    return content;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-2">
            <div className="font-medium">
              Data Completeness: {completionPercentage}%
            </div>
            {missingCriticalFields.length > 0 && (
              <div>
                <div className="text-sm font-medium mb-1">Missing:</div>
                <div className="text-sm text-muted-foreground">
                  {missingCriticalFields.join(', ')}
                </div>
              </div>
            )}
            
            {/* Component Status */}
            <div className="border-t pt-2">
              <div className="text-sm font-medium mb-1">Components:</div>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div className={`flex items-center gap-1 ${status.hasEngine ? 'text-green-600' : 'text-red-600'}`}>
                  {getComponentIcon('engine')}
                  Engine
                </div>
                <div className={`flex items-center gap-1 ${status.hasBrakes ? 'text-green-600' : 'text-red-600'}`}>
                  {getComponentIcon('brake_system')}
                  Brakes
                </div>
                <div className={`flex items-center gap-1 ${status.hasFrame ? 'text-green-600' : 'text-red-600'}`}>
                  {getComponentIcon('frame')}
                  Frame
                </div>
                <div className={`flex items-center gap-1 ${status.hasSuspension ? 'text-green-600' : 'text-red-600'}`}>
                  {getComponentIcon('suspension')}
                  Suspension
                </div>
                <div className={`flex items-center gap-1 ${status.hasWheels ? 'text-green-600' : 'text-red-600'}`}>
                  {getComponentIcon('wheel')}
                  Wheels
                </div>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground">
              Components inherit from model assignments
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
