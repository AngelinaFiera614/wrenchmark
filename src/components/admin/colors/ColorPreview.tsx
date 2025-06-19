
import React from "react";
import { Label } from "@/components/ui/label";

interface ColorPreviewProps {
  hexCode: string;
  imageUrl: string;
}

const ColorPreview = ({ hexCode, imageUrl }: ColorPreviewProps) => {
  if (!hexCode && !imageUrl) return null;

  return (
    <div className="space-y-4">
      {hexCode && (
        <div className="flex gap-2 items-center">
          <div 
            className="w-10 h-10 rounded border-2 border-explorer-chrome/30 flex-shrink-0"
            style={{ backgroundColor: hexCode }}
          />
          <span className="text-sm text-explorer-text-muted">Color Preview</span>
        </div>
      )}
      
      {imageUrl && (
        <div className="space-y-2">
          <Label>Image Preview</Label>
          <img
            src={imageUrl}
            alt="Color preview"
            className="w-full h-32 object-cover rounded border border-explorer-chrome/30"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ColorPreview;
