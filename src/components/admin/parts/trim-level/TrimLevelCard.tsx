
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Copy, Trash, RefreshCw } from "lucide-react";
import { Configuration } from "@/types/motorcycle";

interface TrimLevelCardProps {
  config: Configuration;
  isSelected: boolean;
  isDeleting: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onClone: () => void;
  onDelete: () => void;
}

const TrimLevelCard = ({
  config,
  isSelected,
  isDeleting,
  onSelect,
  onEdit,
  onClone,
  onDelete
}: TrimLevelCardProps) => {
  const getComponentCompleteness = (config: Configuration) => {
    const components = [
      config.engine_id,
      config.brake_system_id,
      config.frame_id,
      config.suspension_id,
      config.wheel_id
    ];
    const filledComponents = components.filter(Boolean).length;
    return {
      filled: filledComponents,
      total: components.length,
      percentage: Math.round((filledComponents / components.length) * 100)
    };
  };

  const completeness = getComponentCompleteness(config);

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-lg ${
        isSelected
          ? 'border-accent-teal bg-accent-teal/10 shadow-lg'
          : 'border-explorer-chrome/30 hover:border-accent-teal/50'
      } ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}
      onClick={() => !isDeleting && onSelect()}
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg text-explorer-text">
                {config.name || "Base"}
              </h3>
              {config.price_premium_usd && (
                <p className="text-green-400 font-medium">
                  +${config.price_premium_usd.toLocaleString()}
                </p>
              )}
            </div>
            <div className="flex gap-1">
              {config.is_default && (
                <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-400">
                  Base Model
                </Badge>
              )}
            </div>
          </div>

          {/* Key Specs Preview */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {config.weight_kg && (
              <div className="text-explorer-text-muted">
                <span className="font-medium">{config.weight_kg}kg</span>
              </div>
            )}
            {config.seat_height_mm && (
              <div className="text-explorer-text-muted">
                <span className="font-medium">{config.seat_height_mm}mm</span> seat
              </div>
            )}
          </div>

          {/* Component Completeness */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-explorer-text-muted">Components</span>
              <span className="text-explorer-text font-medium">
                {completeness.filled}/{completeness.total}
              </span>
            </div>
            <div className="w-full bg-explorer-chrome/20 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  completeness.percentage === 100
                    ? 'bg-green-500'
                    : completeness.percentage >= 60
                    ? 'bg-accent-teal'
                    : 'bg-orange-500'
                }`}
                style={{ width: `${completeness.percentage}%` }}
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="flex-1 text-xs"
              disabled={isDeleting}
            >
              <Edit className="mr-1 h-3 w-3" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onClone();
              }}
              className="flex-1 text-xs"
              disabled={isDeleting}
            >
              <Copy className="mr-1 h-3 w-3" />
              Clone
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-xs text-red-400 hover:text-red-300 hover:bg-red-950/30"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <RefreshCw className="h-3 w-3 animate-spin" />
              ) : (
                <Trash className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrimLevelCard;
