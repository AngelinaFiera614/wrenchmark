
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Star, Zap, AlertTriangle, Bookmark } from 'lucide-react';
import { Motorcycle } from '@/types';

interface FilterPreset {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  filters: any;
  count?: number;
}

interface FilterPresetsProps {
  motorcycles: Motorcycle[];
  onApplyPreset: (preset: FilterPreset) => void;
}

const FilterPresets = ({ motorcycles, onApplyPreset }: FilterPresetsProps) => {
  const presets: FilterPreset[] = [
    {
      id: 'recent',
      name: 'Recent Models',
      description: '2020 and newer',
      icon: <Calendar className="h-4 w-4" />,
      filters: {
        yearRange: [2020, 2030],
        statusFilter: 'all'
      },
      count: motorcycles.filter(m => 
        (m.production_start_year || 0) >= 2020
      ).length
    },
    {
      id: 'popular',
      name: 'Popular Brands',
      description: 'Honda, Yamaha, Kawasaki, Suzuki',
      icon: <Star className="h-4 w-4" />,
      filters: {
        brands: ['Honda', 'Yamaha', 'Kawasaki', 'Suzuki'],
        statusFilter: 'published'
      },
      count: motorcycles.filter(m => 
        ['Honda', 'Yamaha', 'Kawasaki', 'Suzuki'].includes(m.brand?.name || '')
      ).length
    },
    {
      id: 'sport',
      name: 'Sport Bikes',
      description: 'Sport and supersport motorcycles',
      icon: <Zap className="h-4 w-4" />,
      filters: {
        categories: ['Sport', 'Supersport', 'Sportbike'],
        statusFilter: 'published'
      },
      count: motorcycles.filter(m => 
        ['Sport', 'Supersport', 'Sportbike'].includes(m.category || m.type || '')
      ).length
    },
    {
      id: 'incomplete',
      name: 'Incomplete Data',
      description: 'Missing key specifications',
      icon: <AlertTriangle className="h-4 w-4" />,
      filters: {
        dataCompleteness: 'incomplete',
        statusFilter: 'all'
      },
      count: motorcycles.filter(m => 
        !m.engine_size || !m.horsepower || !m.weight_kg || !m.seat_height_mm
      ).length
    }
  ];

  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardHeader>
        <CardTitle className="text-lg text-explorer-text flex items-center gap-2">
          <Bookmark className="h-5 w-5" />
          Filter Presets
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {presets.map((preset) => (
            <Button
              key={preset.id}
              variant="outline"
              onClick={() => onApplyPreset(preset)}
              className="h-auto p-4 bg-explorer-dark border-explorer-chrome/30 hover:bg-accent-teal/10 hover:border-accent-teal/30 transition-colors"
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="flex items-center gap-2">
                  {preset.icon}
                  <span className="font-medium text-sm">{preset.name}</span>
                </div>
                <p className="text-xs text-explorer-text-muted">
                  {preset.description}
                </p>
                <Badge variant="secondary" className="bg-accent-teal/20 text-accent-teal text-xs">
                  {preset.count} models
                </Badge>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterPresets;
