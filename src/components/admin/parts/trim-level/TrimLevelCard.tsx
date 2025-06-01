import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Copy, Layers, Loader2 } from "lucide-react";
import { Configuration } from "@/types/motorcycle";

interface TrimLevelCardProps {
  config: Configuration;
  isSelected: boolean;
  isDeleting: boolean;
  onClick: () => void;
  onEdit: (config: Configuration) => void;
  onClone: (config: Configuration) => void;
  onDelete: (config: Configuration) => void;
  onCopy: (config: Configuration) => void;
}

const TrimLevelCard = ({
  config,
  isSelected,
  isDeleting,
  onClick,
  onEdit,
  onClone,
  onDelete,
  onCopy
}: TrimLevelCardProps) => {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isSelected 
          ? 'ring-2 ring-accent-teal bg-accent-teal/5' 
          : 'hover:border-accent-teal/50'
      } ${isDeleting ? 'opacity-50' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-explorer-text">
                {config.name || 'Unnamed Configuration'}
              </h3>
              {config.is_default && (
                <Badge className="bg-accent-teal text-black text-xs">
                  Base Model
                </Badge>
              )}
            </div>
            
            {/* Configuration details */}
            <div className="space-y-1 text-sm text-muted-foreground">
              {config.market_region && (
                <p>Market: {config.market_region}</p>
              )}
              {config.price_premium_usd && (
                <p>Price Premium: ${config.price_premium_usd}</p>
              )}
              
              {/* Component summary */}
              <div className="flex flex-wrap gap-1 mt-2">
                {config.engine && (
                  <Badge variant="outline" className="text-xs">
                    {config.engine.name}
                  </Badge>
                )}
                {config.brakes && (
                  <Badge variant="outline" className="text-xs">
                    {config.brakes.type}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(config);
              }}
              disabled={isDeleting}
              title="Edit"
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onCopy(config);
              }}
              disabled={isDeleting}
              title="Copy to other years"
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onClone(config);
              }}
              disabled={isDeleting}
              title="Clone"
            >
              <Layers className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(config);
              }}
              disabled={isDeleting}
              title="Delete"
              className="hover:text-red-600"
            >
              {isDeleting ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Trash2 className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrimLevelCard;
