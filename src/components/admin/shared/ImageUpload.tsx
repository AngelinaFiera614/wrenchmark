
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Upload, X, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();
  const maxSizeBytes = maxSizeMB * 1024 * 1024; // Convert MB to bytes

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const fileId = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '-')}`;
    const filePath = folderPath ? `${folderPath}/${fileId}` : fileId;

    // Check file size
    if (file.size > maxSizeBytes) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: `Maximum file size is ${maxSizeMB}MB`
      });
      return;
    }

    // Check file type
    if (!acceptedFileTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: `Accepted file types: ${acceptedFileTypes}`
      });
      return;
    }

    try {
      setIsUploading(true);
      
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });
        
      if (error) throw error;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(data.path);
      
      onChange(publicUrl);
      
      toast({
        title: "Upload successful",
        description: "Your image has been uploaded."
      });
      
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was an error uploading your image."
      });
      if (onError && error instanceof Error) {
        onError(error);
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemove = () => {
    onChange(null);
  };

  const renderPreview = () => {
    if (!value) return null;
    
    return (
      <div className="relative group">
        <div 
          className="relative rounded overflow-hidden bg-black border border-border"
          style={{ height: previewHeight, width: previewWidth }}
        >
          <img 
            src={value} 
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
              onClick={handleRemove} 
              type="button"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {value ? (
        renderPreview()
      ) : (
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
      )}

      <div>
        <input 
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
          onClick={() => document.getElementById('file-upload')?.click()}
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
