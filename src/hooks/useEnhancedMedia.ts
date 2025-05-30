
import { useState, useEffect } from 'react';
import { enhancedMediaService, UploadResult } from '@/services/enhancedMediaService';
import { EnhancedMotorcycleImage, MediaUploadData } from '@/types/media';
import { useToast } from '@/hooks/use-toast';

export function useEnhancedMedia(motorcycleId?: string) {
  const [media, setMedia] = useState<EnhancedMotorcycleImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const { toast } = useToast();

  useEffect(() => {
    if (motorcycleId) {
      fetchMedia();
    }
  }, [motorcycleId]);

  const fetchMedia = async () => {
    if (!motorcycleId) return;
    
    setIsLoading(true);
    try {
      const mediaData = await enhancedMediaService.getMotorcycleMedia(motorcycleId);
      setMedia(mediaData);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch media"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const uploadFiles = async (files: MediaUploadData[]) => {
    if (!motorcycleId) return;

    const results: UploadResult[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const uploadData = files[i];
      const fileKey = `${uploadData.file.name}-${i}`;
      
      try {
        setUploadProgress(prev => ({ ...prev, [fileKey]: 0 }));
        
        const result = await enhancedMediaService.uploadFile(
          uploadData.file,
          motorcycleId,
          uploadData,
          (progress) => {
            setUploadProgress(prev => ({ ...prev, [fileKey]: progress.percentage }));
          }
        );
        
        results.push(result);
        
        if (result.success) {
          toast({
            title: "Upload successful",
            description: `${uploadData.file.name} uploaded successfully`
          });
        } else {
          toast({
            variant: "destructive",
            title: "Upload failed",
            description: result.error || `Failed to upload ${uploadData.file.name}`
          });
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Upload error",
          description: `Error uploading ${uploadData.file.name}`
        });
      } finally {
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[fileKey];
          return newProgress;
        });
      }
    }
    
    // Refresh media list
    await fetchMedia();
    return results;
  };

  const deleteMedia = async (mediaId: string) => {
    const success = await enhancedMediaService.deleteMedia(mediaId);
    if (success) {
      toast({
        title: "Media deleted",
        description: "Media has been successfully deleted"
      });
      await fetchMedia();
    } else {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: "Failed to delete media"
      });
    }
    return success;
  };

  const setPrimaryImage = async (mediaId: string) => {
    if (!motorcycleId) return false;
    
    const success = await enhancedMediaService.setPrimaryImage(mediaId, motorcycleId);
    if (success) {
      toast({
        title: "Primary image set",
        description: "Primary image has been updated"
      });
      await fetchMedia();
    } else {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Failed to set primary image"
      });
    }
    return success;
  };

  const initializeStorage = async () => {
    try {
      await enhancedMediaService.createStorageBuckets();
      toast({
        title: "Storage initialized",
        description: "Media storage buckets have been created"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Storage error",
        description: "Failed to initialize storage buckets"
      });
    }
  };

  return {
    media,
    isLoading,
    uploadProgress,
    uploadFiles,
    deleteMedia,
    setPrimaryImage,
    fetchMedia,
    initializeStorage
  };
}
