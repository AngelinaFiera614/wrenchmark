
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Image, AlertCircle, Star } from 'lucide-react';

interface FilterPresetsProps {
  onApplyPreset: (preset: FilterPreset) => void;
  activePreset?: string;
}

export interface FilterPreset {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  filters: {
    search?: string;
    categories?: string[];
    hasImage?: boolean;
    recentlyUpdated?: boolean;
    missingRelated?: boolean;
  };
}

const PRESETS: FilterPreset[] = [
  {
    id: 'recent',
    name: 'Recently Updated',
    icon: <Calendar className="h-4 w-4" />,
    description: 'Terms updated in the last 7 days',
    filters: { recentlyUpdated: true }
  },
  {
    id: 'no-images',
    name: 'Missing Images',
    icon: <Image className="h-4 w-4" />,
    description: 'Terms without images',
    filters: { hasImage: false }
  },
  {
    id: 'incomplete',
    name: 'Incomplete',
    icon: <AlertCircle className="h-4 w-4" />,
    description: 'Terms missing categories or related terms',
    filters: { missingRelated: true }
  },
  {
    id: 'featured',
    name: 'Featured Terms',
    icon: <Star className="h-4 w-4" />,
    description: 'Important motorcycle terms',
    filters: { categories: ['engine', 'safety', 'performance'] }
  }
];

export function FilterPresets({ onApplyPreset, activePreset }: FilterPresetsProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium">Quick Filters</h4>
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <Button
            key={preset.id}
            variant={activePreset === preset.id ? "default" : "outline"}
            size="sm"
            onClick={() => onApplyPreset(preset)}
            className="gap-2"
          >
            {preset.icon}
            {preset.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
