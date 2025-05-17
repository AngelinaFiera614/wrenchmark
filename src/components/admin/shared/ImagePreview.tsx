
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { X, AlertTriangle } from "lucide-react";

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
  const [loadError, setLoadError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageError = () => {
    setLoadError(true);
    setIsLoading(false);
    console.error(`Failed to load image from URL: ${imageUrl}`);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative group">
      <div 
        className="relative rounded overflow-hidden bg-black border border-border"
        style={{ height: previewHeight, width: previewWidth }}
      >
        {isLoading && !loadError && (
          <div className="h-full w-full flex items-center justify-center bg-gray-900 text-gray-400">
            <span className="animate-pulse">Loading...</span>
          </div>
        )}
        
        {loadError ? (
          <div className="h-full w-full flex flex-col items-center justify-center bg-gray-900 text-gray-400 p-2">
            <AlertTriangle className="h-8 w-8 mb-1" />
            <p className="text-xs text-center">Image failed to load</p>
            <p className="text-xs text-center break-all mt-1 max-h-20 overflow-auto">{imageUrl}</p>
          </div>
        ) : (
          <img 
            src={imageUrl} 
            alt="Preview" 
            className="h-full w-full object-contain"
            onError={handleImageError}
            onLoad={handleImageLoad}
            style={{ display: isLoading ? 'none' : 'block' }}
          />
        )}
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
