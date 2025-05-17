
import React from 'react';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ImagePreviewProps {
  imageUrl: string;
  onRemove: () => void;
  previewHeight?: number;
  previewWidth?: number;
}

const ImagePreview = ({ 
  imageUrl, 
  onRemove, 
  previewHeight = 150, 
  previewWidth = 150 
}: ImagePreviewProps) => {
  return (
    <div className="relative group">
      <div 
        className="relative rounded overflow-hidden bg-black border border-border"
        style={{ height: previewHeight, width: previewWidth }}
      >
        <img 
          src={imageUrl} 
          alt="Preview" 
          className="h-full w-full object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={onRemove} 
            type="button"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;
