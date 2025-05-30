
import { supabase } from "@/integrations/supabase/client";
import { MediaUploadData, EnhancedMotorcycleImage, MediaType, PhotoContext } from "@/types/media";

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  imageRecord?: EnhancedMotorcycleImage;
}

export class EnhancedMediaService {
  private getBucketName(mediaType: MediaType): string {
    switch (mediaType) {
      case 'image':
        return 'motorcycle-images';
      case 'video':
        return 'motorcycle-videos';
      case 'document':
      case 'brochure':
      case 'manual':
        return 'motorcycle-documents';
      default:
        return 'motorcycle-images';
    }
  }

  private generateFilePath(
    motorcycleId: string,
    file: File,
    mediaType: MediaType,
    metadata?: Partial<MediaUploadData>
  ): string {
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    let folder: string = mediaType;
    if (metadata?.yearCaptured) {
      folder = `${mediaType}/${metadata.yearCaptured}`;
    }
    
    return `${motorcycleId}/${folder}/${timestamp}_${sanitizedName}`;
  }

  async createStorageBuckets(): Promise<void> {
    const buckets = [
      { id: 'motorcycle-images', name: 'motorcycle-images', public: true },
      { id: 'motorcycle-videos', name: 'motorcycle-videos', public: true },
      { id: 'motorcycle-documents', name: 'motorcycle-documents', public: true }
    ];

    for (const bucket of buckets) {
      const { error } = await supabase.storage.createBucket(bucket.id, {
        public: bucket.public,
        fileSizeLimit: bucket.id === 'motorcycle-videos' ? 104857600 : 10485760,
        allowedMimeTypes: this.getAllowedMimeTypes(bucket.id)
      });

      if (error && !error.message.includes('already exists')) {
        console.error(`Error creating bucket ${bucket.id}:`, error);
      }
    }
  }

  private getAllowedMimeTypes(bucketId: string): string[] {
    switch (bucketId) {
      case 'motorcycle-images':
        return ['image/jpeg', 'image/png', 'image/webp'];
      case 'motorcycle-videos':
        return ['video/mp4', 'video/webm', 'video/mov'];
      case 'motorcycle-documents':
        return ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      default:
        return [];
    }
  }

  async uploadFile(
    file: File,
    motorcycleId: string,
    uploadData: MediaUploadData,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResult> {
    try {
      const bucketName = this.getBucketName(uploadData.mediaType);
      const filePath = this.generateFilePath(motorcycleId, file, uploadData.mediaType, uploadData);

      // Upload to Supabase Storage
      const { data: storageData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(storageData.path);

      // Create database record
      const imageRecord: Omit<EnhancedMotorcycleImage, 'id' | 'created_at' | 'updated_at'> = {
        motorcycle_id: motorcycleId,
        file_name: file.name,
        file_url: publicUrl,
        alt_text: `${uploadData.mediaType} for motorcycle`,
        angle: uploadData.angle,
        color_code: uploadData.colorCode,
        year_captured: uploadData.yearCaptured,
        photo_context: uploadData.context,
        media_type: uploadData.mediaType,
        is_primary: uploadData.isPrimary || false,
        is_featured: uploadData.isFeatured || false,
        file_size_bytes: file.size,
        mime_type: file.type,
        historical_significance: uploadData.historicalSignificance
      };

      const { data: dbRecord, error: dbError } = await supabase
        .from('motorcycle_images')
        .insert([imageRecord])
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        throw dbError;
      }

      return {
        success: true,
        url: publicUrl,
        imageRecord: dbRecord as EnhancedMotorcycleImage
      };

    } catch (error) {
      console.error('Upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      };
    }
  }

  async getMotorcycleMedia(motorcycleId: string): Promise<EnhancedMotorcycleImage[]> {
    const { data, error } = await supabase
      .from('motorcycle_images')
      .select('*')
      .eq('motorcycle_id', motorcycleId)
      .order('is_primary', { ascending: false })
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching media:', error);
      return [];
    }

    return data || [];
  }

  async deleteMedia(mediaId: string): Promise<boolean> {
    try {
      // Get the media record first
      const { data: media, error: fetchError } = await supabase
        .from('motorcycle_images')
        .select('*')
        .eq('id', mediaId)
        .single();

      if (fetchError || !media) {
        throw new Error('Media not found');
      }

      // Delete from storage
      const bucketName = this.getBucketName(media.media_type as MediaType);
      const urlParts = media.file_url.split('/');
      const filePath = urlParts.slice(-3).join('/'); // Get the last 3 parts: motorcycleId/folder/filename
      
      if (filePath) {
        await supabase.storage
          .from(bucketName)
          .remove([filePath]);
      }

      // Delete from database
      const { error: deleteError } = await supabase
        .from('motorcycle_images')
        .delete()
        .eq('id', mediaId);

      if (deleteError) {
        throw deleteError;
      }

      return true;
    } catch (error) {
      console.error('Delete error:', error);
      return false;
    }
  }

  async setPrimaryImage(mediaId: string, motorcycleId: string): Promise<boolean> {
    try {
      // First, unset all primary images for this motorcycle
      await supabase
        .from('motorcycle_images')
        .update({ is_primary: false })
        .eq('motorcycle_id', motorcycleId);

      // Set the selected image as primary
      const { error } = await supabase
        .from('motorcycle_images')
        .update({ is_primary: true })
        .eq('id', mediaId);

      return !error;
    } catch (error) {
      console.error('Error setting primary image:', error);
      return false;
    }
  }
}

export const enhancedMediaService = new EnhancedMediaService();
