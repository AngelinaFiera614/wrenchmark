
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Star } from "lucide-react";
import { ColorOption } from "@/types/colors";

interface ColorOptionCardProps {
  color: ColorOption;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

const ColorOptionCard = ({ color, onEdit, onDelete, isDeleting }: ColorOptionCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Color Preview */}
          <div className="flex items-center gap-3">
            {color.hex_code && (
              <div
                className="w-8 h-8 rounded-full border-2 border-gray-300 flex-shrink-0"
                style={{ backgroundColor: color.hex_code }}
                title={color.hex_code}
              />
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate">{color.name}</h4>
              {color.hex_code && (
                <p className="text-sm text-muted-foreground">{color.hex_code}</p>
              )}
            </div>
          </div>

          {/* Color Image */}
          {color.image_url && (
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={color.image_url}
                alt={color.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {color.is_limited && (
              <Badge variant="outline" className="text-xs">
                <Star className="w-3 h-3 mr-1" />
                Limited Edition
              </Badge>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="flex-1"
              disabled={isDeleting}
            >
              <Edit className="w-3 h-3 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              disabled={isDeleting}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ColorOptionCard;
