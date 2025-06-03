
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { DataCompletenessStatus } from '@/utils/dataCompleteness';

interface DataCompletenessIndicatorProps {
  status: DataCompletenessStatus;
  variant?: 'card' | 'detail' | 'admin';
  showDetails?: boolean;
}

export function DataCompletenessIndicator({ 
  status, 
  variant = 'card', 
  showDetails = false 
}: DataCompletenessIndicatorProps) {
  const { completionPercentage, missingComponents } = status;

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

  const content = (
    <Badge variant="outline" className={getVariantStyles()}>
      <AlertTriangle className="h-3 w-3 mr-1" />
      {variant === 'admin' ? `${completionPercentage}% Complete` : 'Incomplete'}
    </Badge>
  );

  if (!showDetails && missingComponents.length === 0) {
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
            {missingComponents.length > 0 && (
              <div>
                <div className="text-sm font-medium mb-1">Missing:</div>
                <div className="text-sm text-muted-foreground">
                  {missingComponents.join(', ')}
                </div>
              </div>
            )}
            <div className="text-xs text-muted-foreground">
              Some specifications may not be available
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
