
import React from 'react';
import { Loader2, Image as ImageIcon } from "lucide-react";

interface UploadPlaceholderProps {
  isUploading: boolean;
  maxSizeMB: number;
  previewHeight?: number;
  previewWidth?: number;
}

const UploadPlaceholder = ({ 
  isUploading, 
  maxSizeMB,
  previewHeight = 150,
  previewWidth = 150
}: UploadPlaceholderProps) => {
  return (
    <div 
      className="border-2 border-dashed border-border rounded-md p-4 text-center"
      style={{ minHeight: previewHeight, minWidth: previewWidth }}
    >
      {isUploading ? (
        <div className="flex flex-col items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-accent-teal mb-2" />
          <p className="text-sm text-muted-foreground">Uploading...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            Drag & drop or click to upload
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Max size: {maxSizeMB}MB
          </p>
        </div>
      )}
    </div>
  );
};

export default UploadPlaceholder;
