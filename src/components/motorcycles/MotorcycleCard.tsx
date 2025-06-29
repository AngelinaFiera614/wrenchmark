import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Calendar, Zap, Gauge, Weight } from "lucide-react";
import { Motorcycle } from "@/types";
import { calculateDataCompletenessSync } from "@/utils/dataCompleteness";
import { DataCompletenessIndicator } from "./DataCompletenessIndicator";

interface MotorcycleCardProps {
  motorcycle: Motorcycle;
  onViewDetails?: (motorcycle: Motorcycle) => void;
  showCompleteness?: boolean;
}

const MotorcycleCard = ({ 
  motorcycle, 
  onViewDetails,
  showCompleteness = false 
}: MotorcycleCardProps) => {
  // Get brand name from the relationship
  const brandName = motorcycle.brand?.name || motorcycle.brands?.name || 'Unknown Brand';
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header Section */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-lg">
                {brandName} {motorcycle.name}
              </h4>
              <p className="text-sm text-muted-foreground">
                {motorcycle.type} • {motorcycle.production_start_year || 'Unknown Year'}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge 
                variant={motorcycle.is_draft ? "secondary" : "default"}
                className={motorcycle.is_draft ? "bg-orange-100 text-orange-800" : "bg-green-100 text-green-800"}
              >
                {motorcycle.is_draft ? 'Draft' : 'Published'}
              </Badge>
            </div>
          </div>

          {/* Data Completeness Section */}
          {showCompleteness && (
            <div className="bg-muted/30 p-3 rounded-lg">
              <h5 className="text-sm font-medium mb-2">Data Completeness</h5>
              <DataCompletenessIndicator 
                status={calculateDataCompletenessSync(motorcycle)} 
                variant="card" 
              />
            </div>
          )}

          {/* Specifications Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            {motorcycle.production_start_year && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{motorcycle.production_start_year}+</span>
              </div>
            )}
            
            {motorcycle.engine_size && (
              <div className="flex items-center gap-1">
                <Zap className="h-4 w-4 text-muted-foreground" />
                <span>{motorcycle.engine_size}cc</span>
              </div>
            )}
            
            {motorcycle.horsepower && (
              <div className="flex items-center gap-1">
                <Gauge className="h-4 w-4 text-muted-foreground" />
                <span>{motorcycle.horsepower}hp</span>
              </div>
            )}
            
            {motorcycle.weight_kg && (
              <div className="flex items-center gap-1">
                <Weight className="h-4 w-4 text-muted-foreground" />
                <span>{motorcycle.weight_kg}kg</span>
              </div>
            )}
          </div>

          {/* Additional Details */}
          {motorcycle.summary && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {motorcycle.summary}
            </p>
          )}

          {/* Action Buttons */}
          {onViewDetails && (
            <div className="flex justify-end pt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(motorcycle)}
              >
                <Eye className="h-4 w-4 mr-1" />
                View Details
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MotorcycleCard;
