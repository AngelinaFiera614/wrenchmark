
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Configuration } from "@/types/motorcycle";
import { Edit, Copy, Eye, FileText } from "lucide-react";

interface TrimLevelCardWithNotesProps {
  configuration: Configuration;
  onEdit: (config: Configuration) => void;
  onCopy: (config: Configuration) => void;
  onPreview: (config: Configuration) => void;
}

const TrimLevelCardWithNotes = ({
  configuration,
  onEdit,
  onCopy,
  onPreview
}: TrimLevelCardWithNotesProps) => {
  const hasNotes = configuration.description || configuration.notes;

  return (
    <Card className="bg-explorer-card border-explorer-chrome/30 hover:border-accent-teal/30 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-explorer-text">{configuration.name}</h3>
              {configuration.is_default && (
                <Badge className="bg-accent-teal text-black">Default</Badge>
              )}
              {hasNotes && (
                <Badge variant="outline" className="text-accent-teal border-accent-teal/30">
                  <FileText className="h-3 w-3 mr-1" />
                  Notes
                </Badge>
              )}
            </div>
            
            {configuration.description && (
              <p className="text-sm text-explorer-text-muted line-clamp-2">
                {configuration.description}
              </p>
            )}
            
            <div className="flex flex-wrap gap-1 mt-2">
              {configuration.trim_level && (
                <Badge variant="outline" className="text-xs">
                  {configuration.trim_level}
                </Badge>
              )}
              {configuration.market_region && (
                <Badge variant="outline" className="text-xs">
                  {configuration.market_region}
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPreview(configuration)}
              className="text-explorer-text-muted hover:text-explorer-text"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCopy(configuration)}
              className="text-explorer-text-muted hover:text-explorer-text"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(configuration)}
              className="text-explorer-text-muted hover:text-explorer-text"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Component Summary */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {configuration.engine && (
            <div className="text-explorer-text-muted">
              Engine: {configuration.engine.name}
            </div>
          )}
          {configuration.brakes && (
            <div className="text-explorer-text-muted">
              Brakes: {configuration.brakes.type}
            </div>
          )}
          {configuration.suspension && (
            <div className="text-explorer-text-muted">
              Suspension: {configuration.suspension.front_type}
            </div>
          )}
          {configuration.wheels && (
            <div className="text-explorer-text-muted">
              Wheels: {configuration.wheels.type}
            </div>
          )}
        </div>

        {/* Specifications */}
        <div className="grid grid-cols-3 gap-2 text-xs text-explorer-text-muted">
          {configuration.weight_kg && (
            <div>Weight: {configuration.weight_kg}kg</div>
          )}
          {configuration.seat_height_mm && (
            <div>Seat: {configuration.seat_height_mm}mm</div>
          )}
          {configuration.price_premium_usd && (
            <div>+${configuration.price_premium_usd}</div>
          )}
        </div>

        {/* Notes Preview */}
        {configuration.notes && (
          <div className="bg-explorer-dark/50 p-2 rounded text-xs">
            <div className="text-explorer-text-muted line-clamp-2 font-mono">
              {configuration.notes.split('\n')[0]}
              {configuration.notes.includes('\n') && '...'}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrimLevelCardWithNotes;
