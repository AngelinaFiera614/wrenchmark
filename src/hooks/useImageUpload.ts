
import { useState } from 'react';
import { uploadFileToStorage } from '@/utils/storage';
import { useToast } from "@/hooks/use-toast";

interface UseImageUploadProps {
  bucketName: string;
  folderPath?: string;
  maxSizeMB?: number;
  acceptedFileTypes?: string;
  onSuccess?: (url: string) => void;
  onError?: (error: Error) => void;
}

export const useImageUpload = ({
  bucketName,
  folderPath = '',
  maxSizeMB = 2,
  acceptedFileTypes = 'image/jpeg, image/png, image/webp',
  onSuccess,
  onError
}: UseImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const maxSizeBytes = maxSizeMB * 1024 * 1024; // Convert MB to bytes

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSizeBytes) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: `Maximum file size is ${maxSizeMB}MB`
      });
      return false;
    }

    // Check file type
    if (!acceptedFileTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: `Accepted file types: ${acceptedFileTypes}`
      });
      return false;
    }

    return true;
  };

  const handleFileUpload = async (file: File): Promise<string | null> => {
    if (!validateFile(file)) return null;
    
    setIsUploading(true);
    try {
      const { publicUrl, error } = await uploadFileToStorage(
        file,
        bucketName,
        folderPath,
        maxSizeBytes
      );
      
      if (error) throw error;
      
      toast({
        title: "Upload successful",
        description: "Your image has been uploaded."
      });
      
      onSuccess?.(publicUrl);
      return publicUrl;
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
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    handleFileUpload
  };
};
