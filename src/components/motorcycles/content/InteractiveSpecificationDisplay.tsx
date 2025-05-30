
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Info, TrendingUp, Zap, Gauge, Weight, Ruler } from 'lucide-react';
import { Motorcycle } from '@/types';

interface SpecificationCategory {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  specs: SpecificationItem[];
}

interface SpecificationItem {
  label: string;
  value: string | number | null;
  unit?: string;
  description?: string;
  category?: 'excellent' | 'good' | 'average' | 'below-average';
  benchmark?: number;
}

interface InteractiveSpecificationDisplayProps {
  motorcycle: Motorcycle;
  comparisonMode?: boolean;
  onSpecSelect?: (spec: SpecificationItem) => void;
}

export default function InteractiveSpecificationDisplay({
  motorcycle,
  comparisonMode = false,
  onSpecSelect
}: InteractiveSpecificationDisplayProps) {
  const [selectedCategory, setSelectedCategory] = useState('performance');
  const [showBenchmarks, setShowBenchmarks] = useState(false);

  const getPerformanceRating = (value: number, benchmark: number): number => {
    return Math.min((value / benchmark) * 100, 100);
  };

  const categories: SpecificationCategory[] = [
    {
      id: 'performance',
      label: 'Performance',
      icon: Zap,
      specs: [
        {
          label: 'Engine Displacement',
          value: motorcycle.engine_size,
          unit: 'cc',
          description: 'Total volume of all cylinders',
          benchmark: 1000
        },
        {
          label: 'Power Output',
          value: motorcycle.horsepower,
          unit: 'hp',
          description: 'Maximum power at peak RPM',
          benchmark: 150
        },
        {
          label: 'Torque',
          value: motorcycle.torque_nm,
          unit: 'Nm',
          description: 'Maximum torque output',
          benchmark: 120
        },
        {
          label: 'Top Speed',
          value: motorcycle.top_speed_kph,
          unit: 'km/h',
          description: 'Maximum achievable speed',
          benchmark: 250
        },
        {
          label: 'Power-to-Weight',
          value: motorcycle.power_to_weight_ratio,
          unit: 'hp/kg',
          description: 'Power output relative to weight',
          benchmark: 1.0
        }
      ]
    },
    {
      id: 'dimensions',
      label: 'Dimensions',
      icon: Ruler,
      specs: [
        {
          label: 'Weight',
          value: motorcycle.weight_kg,
          unit: 'kg',
          description: 'Dry weight of the motorcycle',
          benchmark: 200
        },
        {
          label: 'Wet Weight',
          value: motorcycle.wet_weight_kg,
          unit: 'kg',
          description: 'Weight with all fluids',
          benchmark: 220
        },
        {
          label: 'Seat Height',
          value: motorcycle.seat_height_mm,
          unit: 'mm',
          description: 'Height from ground to seat',
          benchmark: 800
        },
        {
          label: 'Wheelbase',
          value: motorcycle.wheelbase_mm,
          unit: 'mm',
          description: 'Distance between wheel centers',
          benchmark: 1400
        },
        {
          label: 'Ground Clearance',
          value: motorcycle.ground_clearance_mm,
          unit: 'mm',
          description: 'Lowest point to ground distance',
          benchmark: 150
        }
      ]
    },
    {
      id: 'practical',
      label: 'Practical',
      icon: Gauge,
      specs: [
        {
          label: 'Fuel Capacity',
          value: motorcycle.fuel_capacity_l,
          unit: 'L',
          description: 'Total fuel tank capacity',
          benchmark: 15
        },
        {
          label: 'Difficulty Level',
          value: motorcycle.difficulty_level,
          unit: '/10',
          description: 'Riding difficulty rating',
          benchmark: 5
        },
        {
          label: 'ABS',
          value: motorcycle.abs ? 'Yes' : 'No',
          description: 'Anti-lock braking system',
          category: motorcycle.abs ? 'excellent' : 'below-average'
        }
      ]
    }
  ];

  const currentCategory = categories.find(c => c.id === selectedCategory);

  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-explorer-text">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-explorer-teal" />
            Interactive Specifications
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBenchmarks(!showBenchmarks)}
              className="text-xs border-explorer-chrome/30 text-explorer-text hover:border-explorer-teal/50"
            >
              <Info className="h-3 w-3 mr-1" />
              {showBenchmarks ? 'Hide' : 'Show'} Benchmarks
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-3 bg-explorer-dark-light">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex items-center gap-2 text-explorer-text data-[state=active]:bg-explorer-teal data-[state=active]:text-explorer-dark"
                >
                  <Icon className="h-4 w-4" />
                  {category.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-6">
              <div className="space-y-4">
                {category.specs
                  .filter(spec => spec.value !== null && spec.value !== undefined)
                  .map((spec, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border transition-colors ${
                        comparisonMode 
                          ? 'border-explorer-chrome/30 hover:border-explorer-teal/50 cursor-pointer' 
                          : 'border-explorer-chrome/20'
                      } bg-explorer-dark-light`}
                      onClick={() => comparisonMode && onSpecSelect?.(spec)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-explorer-text">{spec.label}</span>
                          {spec.category && (
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                spec.category === 'excellent' ? 'border-green-500 text-green-400' :
                                spec.category === 'good' ? 'border-blue-500 text-blue-400' :
                                spec.category === 'average' ? 'border-yellow-500 text-yellow-400' :
                                'border-red-500 text-red-400'
                              }`}
                            >
                              {spec.category}
                            </Badge>
                          )}
                        </div>
                        <span className="font-bold text-explorer-teal">
                          {spec.value}{spec.unit && ` ${spec.unit}`}
                        </span>
                      </div>
                      
                      {spec.description && (
                        <p className="text-sm text-explorer-text-muted mb-3">
                          {spec.description}
                        </p>
                      )}
                      
                      {showBenchmarks && spec.benchmark && typeof spec.value === 'number' && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-explorer-text-muted">
                            <span>vs. Category Average</span>
                            <span>{getPerformanceRating(spec.value, spec.benchmark).toFixed(0)}%</span>
                          </div>
                          <Progress
                            value={getPerformanceRating(spec.value, spec.benchmark)}
                            className="h-2"
                          />
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
