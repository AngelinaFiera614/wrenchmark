
import React from 'react';
import { Badge } from '@/components/ui/badge';
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

  if (variant === 'compact') {
    return (
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
    );
  }

  return (
    <div className="flex flex-wrap gap-1">
      {components.map(({ key, label, icon: Icon }) => {
        const isLinked = completeness[key as keyof DataCompletion];
        return (
          <Badge
            key={key}
            variant={isLinked ? "default" : "outline"}
            className={`text-xs ${
              isLinked 
                ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                : 'border-gray-400/30 text-gray-400'
            }`}
          >
            <Icon className="h-2 w-2 mr-1" />
            {label}
          </Badge>
        );
      })}
    </div>
  );
};

export default ComponentStatusBadges;
