import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Cog, Bike, Shield, Settings, Wrench } from 'lucide-react';

interface ComponentSpec {
  label: string;
  value: string | number | null | undefined;
  unit?: string;
  highlight?: boolean;
}

interface ComponentDetailCardProps {
  type: 'engine' | 'brake' | 'frame' | 'suspension' | 'wheel';
  title: string;
  data: any;
  onCompare?: () => void;
}

const ComponentTypeIcons = {
  engine: Cog,
  brake: Shield,
  frame: Settings,
  suspension: Wrench,
  wheel: Bike
};

export default function ComponentDetailCard({ 
  type, 
  title, 
  data, 
  onCompare 
}: ComponentDetailCardProps) {
  const Icon = ComponentTypeIcons[type];

  const getSpecs = (): ComponentSpec[] => {
    switch (type) {
      case 'engine':
        return [
          { label: 'Displacement', value: data.displacement_cc, unit: 'cc', highlight: true },
          { label: 'Power', value: data.power_hp, unit: 'hp' },
          { label: 'Torque', value: data.torque_nm, unit: 'Nm' },
          { label: 'Type', value: data.engine_type },
          { label: 'Cylinders', value: data.cylinder_count },
          { label: 'Cooling', value: data.cooling },
          { label: 'Fuel System', value: data.fuel_system },
          { label: 'Compression Ratio', value: data.compression_ratio }
        ];
      case 'brake':
        return [
          { label: 'System Type', value: data.type, highlight: true },
          { label: 'Front Type', value: data.brake_type_front },
          { label: 'Rear Type', value: data.brake_type_rear },
          { label: 'Front Disc Size', value: data.front_disc_size_mm, unit: 'mm' },
          { label: 'Rear Disc Size', value: data.rear_disc_size_mm, unit: 'mm' },
          { label: 'Brand', value: data.brake_brand },
          { label: 'Traction Control', value: data.has_traction_control ? 'Yes' : 'No' }
        ];
      case 'frame':
        return [
          { label: 'Type', value: data.type, highlight: true },
          { label: 'Material', value: data.material },
          { label: 'Construction', value: data.construction_method },
          { label: 'Rake', value: data.rake_degrees, unit: '°' },
          { label: 'Trail', value: data.trail_mm, unit: 'mm' }
        ];
      case 'suspension':
        return [
          { label: 'Front Type', value: data.front_type, highlight: true },
          { label: 'Rear Type', value: data.rear_type, highlight: true },
          { label: 'Front Travel', value: data.front_travel_mm, unit: 'mm' },
          { label: 'Rear Travel', value: data.rear_travel_mm, unit: 'mm' },
          { label: 'Front Brand', value: data.front_brand },
          { label: 'Rear Brand', value: data.rear_brand },
          { label: 'Adjustability', value: data.adjustability }
        ];
      case 'wheel':
        return [
          { label: 'Type', value: data.type, highlight: true },
          { label: 'Front Size', value: data.front_size },
          { label: 'Rear Size', value: data.rear_size },
          { label: 'Front Tire', value: data.front_tire_size },
          { label: 'Rear Tire', value: data.rear_tire_size },
          { label: 'Material', value: data.rim_material },
          { label: 'Front Spokes', value: data.spoke_count_front },
          { label: 'Rear Spokes', value: data.spoke_count_rear }
        ];
      default:
        return [];
    }
  };

  const specs = getSpecs().filter(spec => spec.value !== null && spec.value !== undefined);

  return (
    <Card className="bg-explorer-card border-explorer-chrome/30 hover:border-explorer-teal/50 transition-colors duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-explorer-text">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-explorer-teal" />
            {title}
          </div>
          {onCompare && (
            <button
              onClick={onCompare}
              className="text-xs px-3 py-1 bg-explorer-teal/20 text-explorer-teal rounded border border-explorer-teal/30 hover:bg-explorer-teal/30 transition-colors"
            >
              Compare
            </button>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {specs.map((spec, index) => (
            <div key={index}>
              <div className="flex items-center justify-between">
                <span className="text-sm text-explorer-text-muted">{spec.label}</span>
                <div className="flex items-center gap-1">
                  {spec.highlight ? (
                    <Badge variant="secondary" className="bg-explorer-teal/20 text-explorer-teal">
                      {spec.value}{spec.unit && ` ${spec.unit}`}
                    </Badge>
                  ) : (
                    <span className="text-sm font-medium text-explorer-text">
                      {spec.value}{spec.unit && ` ${spec.unit}`}
                    </span>
                  )}
                </div>
              </div>
              {index < specs.length - 1 && <Separator className="mt-2 bg-explorer-chrome/20" />}
            </div>
          ))}
        </div>
        
        {data.notes && (
          <div className="mt-4 pt-3 border-t border-explorer-chrome/20">
            <p className="text-xs text-explorer-text-muted">{data.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
