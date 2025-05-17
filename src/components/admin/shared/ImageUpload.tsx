
import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";
import ImagePreview from './ImagePreview';
import UploadPlaceholder from './UploadPlaceholder';
import { useImageUpload } from '@/hooks/useImageUpload';

interface ImageUploadProps {
  bucketName: string;
  folderPath?: string;
  value: string | null;
  onChange: (url: string | null) => void;
  onError?: (error: Error) => void;
  className?: string;
  maxSizeMB?: number;
  acceptedFileTypes?: string;
  previewHeight?: number;
  previewWidth?: number;
}

const ImageUpload = ({
  bucketName,
  folderPath = '',
  value,
  onChange,
  onError,
  className = '',
  maxSizeMB = 2,
  acceptedFileTypes = 'image/jpeg, image/png, image/webp',
  previewHeight = 150,
  previewWidth = 150
}: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { isUploading, handleFileUpload } = useImageUpload({
    bucketName,
    folderPath,
    maxSizeMB,
    acceptedFileTypes,
    onSuccess: onChange,
    onError
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    await handleFileUpload(file);
  };

  const handleRemove = () => {
    onChange(null);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {value ? (
        <ImagePreview
          imageUrl={value}
          onRemove={handleRemove}
          previewHeight={previewHeight}
          previewWidth={previewWidth}
        />
      ) : (
        <UploadPlaceholder 
          isUploading={isUploading}
          maxSizeMB={maxSizeMB}
          previewHeight={previewHeight}
          previewWidth={previewWidth}
        />
      )}

      <div>
        <input 
          ref={fileInputRef}
          type="file" 
          id="file-upload" 
          className="hidden" 
          onChange={handleFileChange}
          accept={acceptedFileTypes}
          disabled={isUploading}
        />
        <Button
          type="button"
          variant={value ? "outline" : "teal"}
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : value ? (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Change Image
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Image
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ImageUpload;
