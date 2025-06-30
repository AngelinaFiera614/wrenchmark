
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Cog, Disc, Box, Zap, Circle } from 'lucide-react';
import { DataCompletion } from '@/utils/dataCompleteness';

interface ComponentStatusBadgesProps {
  completeness: DataCompletion;
  variant?: 'compact' | 'full';
}

const ComponentStatusBadges = ({ completeness, variant = 'compact' }: ComponentStatusBadgesProps) => {
  const components = [
    { key: 'hasEngine', label: 'Engine', icon: Cog },
    { key: 'hasBrakes', label: 'Brakes', icon: Disc },
    { key: 'hasFrame', label: 'Frame', icon: Box },
    { key: 'hasSuspension', label: 'Suspension', icon: Zap },
    { key: 'hasWheels', label: 'Wheels', icon: Circle }
  ];

  const linkedCount = components.filter(comp => completeness[comp.key as keyof DataCompletion]).length;
  const linkedComponents = components.filter(comp => completeness[comp.key as keyof DataCompletion]);
  const unlinkedComponents = components.filter(comp => !completeness[comp.key as keyof DataCompletion]);

  if (variant === 'compact') {
    return (
      <TooltipProvider>
        <div className="flex items-center gap-2">
          <Badge 
            variant={linkedCount > 0 ? "default" : "outline"}
            className={`text-xs ${
              linkedCount > 0 
                ? 'bg-accent-teal/20 text-accent-teal border-accent-teal/30' 
                : 'border-orange-400/30 text-orange-400'
            }`}
          >
            <Cog className="h-3 w-3 mr-1" />
            {linkedCount}/5 Components
          </Badge>
          
          {/* Individual component status icons */}
          <div className="flex gap-1">
            {components.map(({ key, label, icon: Icon }) => {
              const isLinked = completeness[key as keyof DataCompletion];
              return (
                <Tooltip key={key}>
                  <TooltipTrigger>
                    <div className={`p-1 rounded ${isLinked ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                      <Icon className="h-3 w-3" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{label}: {isLinked ? 'Linked' : 'Not Linked'}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <div className="space-y-2">
      {linkedComponents.length > 0 && (
        <div>
          <p className="text-xs font-medium text-green-600 mb-1">Linked Components:</p>
          <div className="flex flex-wrap gap-1">
            {linkedComponents.map(({ key, label, icon: Icon }) => (
              <Badge
                key={key}
                variant="default"
                className="text-xs bg-green-500/20 text-green-400 border-green-500/30"
              >
                <Icon className="h-2 w-2 mr-1" />
                {label}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {unlinkedComponents.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-500 mb-1">Missing Components:</p>
          <div className="flex flex-wrap gap-1">
            {unlinkedComponents.map(({ key, label, icon: Icon }) => (
              <Badge
                key={key}
                variant="outline"
                className="text-xs border-gray-400/30 text-gray-400"
              >
                <Icon className="h-2 w-2 mr-1" />
                {label}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComponentStatusBadges;
