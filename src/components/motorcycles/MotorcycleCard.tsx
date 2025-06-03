
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Motorcycle } from '@/types';
import { useMeasurement } from '@/context/MeasurementContext';
import { formatEngineType, formatHorsepower, formatBrakeSystem } from '@/utils/performanceFormatters';
import { Plus, Gauge, Zap, Shield } from 'lucide-react';
import { useComparison } from '@/context/ComparisonContext';
import { DataCompletenessIndicator } from './DataCompletenessIndicator';
import { calculateDataCompleteness } from '@/utils/dataCompleteness';

interface MotorcycleCardProps {
  motorcycle: Motorcycle;
}

const MotorcycleCard: React.FC<MotorcycleCardProps> = ({ motorcycle }) => {
  const { unit } = useMeasurement();
  const { addToComparison, removeFromComparison, isInComparison } = useComparison();

  const inComparison = isInComparison(motorcycle.id);
  const dataCompleteness = calculateDataCompleteness(motorcycle);

  const handleComparisonToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inComparison) {
      removeFromComparison(motorcycle.id);
    } else {
      addToComparison(motorcycle);
    }
  };

  const engineDisplay = formatEngineType(
    motorcycle.engine_cc || motorcycle.displacement_cc, 
    motorcycle.engine_type, 
    motorcycle.cylinder_count
  );
  
  const powerDisplay = formatHorsepower(
    motorcycle.horsepower_hp || motorcycle.horsepower, 
    motorcycle.power_rpm
  );
  
  const brakeDisplay = formatBrakeSystem(
    motorcycle.brake_type, 
    motorcycle.has_abs || motorcycle.abs
  );

  const weightDisplay =
    unit === "metric"
      ? `${motorcycle.weight_kg || 'N/A'} kg`
      : `${motorcycle.weight_lbs || (motorcycle.weight_kg ? Math.round(motorcycle.weight_kg * 2.205) : 'N/A')} lbs`;

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group">
      <Link to={`/motorcycles/${motorcycle.slug || motorcycle.id}`}>
        <div className="aspect-video relative overflow-hidden bg-muted">
          <img
            src={motorcycle.image_url}
            alt={`${motorcycle.make} ${motorcycle.model}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
            }}
          />
          <div className="absolute top-2 right-2">
            <Button
              variant={inComparison ? "default" : "outline"}
              size="sm"
              className="bg-background/80 backdrop-blur-sm"
              onClick={handleComparisonToggle}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {dataCompleteness.completionPercentage < 100 && (
            <div className="absolute top-2 left-2">
              <DataCompletenessIndicator status={dataCompleteness} variant="card" />
            </div>
          )}
        </div>
      </Link>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-bold text-lg line-clamp-1">
              {motorcycle.make} {motorcycle.model}
            </h3>
            <p className="text-sm text-muted-foreground">
              {motorcycle.year} • {motorcycle.category}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <Gauge className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Engine:</span>
              </div>
              <span className="font-medium">
                {engineDisplay || 'N/A'}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Power:</span>
              </div>
              <span className="font-medium">
                {powerDisplay || 'N/A'}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Brakes:</span>
              </div>
              <span className="font-medium">
                {brakeDisplay || 'N/A'}
              </span>
            </div>
          </div>

          {motorcycle.style_tags && motorcycle.style_tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {motorcycle.style_tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {motorcycle.style_tags.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{motorcycle.style_tags.length - 2}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MotorcycleCard;
