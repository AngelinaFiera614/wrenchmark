
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Eye, 
  FileText, 
  Edit, 
  Trash2, 
  Calendar,
  Zap,
  Gauge,
  Weight,
  Settings
} from "lucide-react";
import { Motorcycle } from "@/types";
import { calculateMotorcycleCompleteness } from "@/utils/motorcycleCompleteness";
import MotorcycleCompletenessIndicator from "./MotorcycleCompletenessIndicator";

interface EnhancedMotorcycleCardProps {
  motorcycle: Motorcycle;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onEdit: (motorcycle: Motorcycle) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onManageComponents?: (motorcycle: Motorcycle) => void;
}

const EnhancedMotorcycleCard = ({
  motorcycle,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onToggleStatus,
  onManageComponents
}: EnhancedMotorcycleCardProps) => {
  // Get brand name from the relationship
  const brandName = motorcycle.brand?.name || motorcycle.brands?.name || 'Unknown Brand';
  
  // Generate a readable display name instead of showing ID
  const displayReference = `${motorcycle.type}-${motorcycle.production_start_year || 'Unknown'}-${motorcycle.name.substring(0, 8)}`;
  
  // Calculate completion data
  const completeness = calculateMotorcycleCompleteness(motorcycle);
  
  return (
    <Card className={`hover:shadow-md transition-shadow ${isSelected ? 'ring-2 ring-accent-teal' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onSelect(motorcycle.id)}
            className="mt-1"
          />
          
          <div className="flex-1 space-y-3">
            {/* Header Section */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-lg">
                  {brandName} {motorcycle.name}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {motorcycle.type} • {displayReference}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge 
                  variant={motorcycle.is_draft ? "secondary" : "default"}
                  className={motorcycle.is_draft ? "bg-orange-100 text-orange-800" : "bg-green-100 text-green-800"}
                >
                  {motorcycle.is_draft ? (
                    <>
                      <FileText className="mr-1 h-3 w-3" />
                      Draft
                    </>
                  ) : (
                    <>
                      <Eye className="mr-1 h-3 w-3" />
                      Published
                    </>
                  )}
                </Badge>
              </div>
            </div>

            {/* Data Completeness Section */}
            <div className="bg-muted/30 p-3 rounded-lg">
              <h5 className="text-sm font-medium mb-2">Data Completeness</h5>
              <MotorcycleCompletenessIndicator completeness={completeness} />
            </div>

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
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(motorcycle)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                
                {onManageComponents && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onManageComponents(motorcycle)}
                    className="text-accent-teal border-accent-teal/30 hover:bg-accent-teal/10"
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    Components
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onToggleStatus(motorcycle.id)}
                  className={motorcycle.is_draft ? "text-green-600 border-green-200" : "text-orange-600 border-orange-200"}
                >
                  {motorcycle.is_draft ? (
                    <>
                      <Eye className="h-4 w-4 mr-1" />
                      Publish
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-1" />
                      Draft
                    </>
                  )}
                </Button>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(motorcycle.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedMotorcycleCard;
