
import { supabase } from "@/integrations/supabase/client";

export interface MotorcycleImage {
  id: string;
  motorcycle_id?: string;
  file_url: string;
  file_name: string;
  file_size_bytes?: number;
  mime_type?: string;
  brand?: string;
  model?: string;
  year?: number;
  color?: string;
  style?: string;
  angle?: 'front' | 'side' | 'rear' | '3/4-front' | '3/4-rear' | 'interior' | 'engine' | 'detail';
  is_primary?: boolean;
  is_featured?: boolean;
  width_px?: number;
  height_px?: number;
  alt_text?: string;
  caption?: string;
  version?: number;
  replaced_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ImageTag {
  id: string;
  name: string;
  category: string;
  description?: string;
  color_hex?: string;
  created_at?: string;
}

export const imageManagementService = {
  // Upload image to storage
  async uploadImage(file: File, path: string): Promise<{ url: string; error?: Error }> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${path}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('motorcycles')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('motorcycles')
        .getPublicUrl(data.path);

      return { url: publicUrl };
    } catch (error) {
      console.error('Error uploading image:', error);
      return { url: '', error: error instanceof Error ? error : new Error('Upload failed') };
    }
  },

  // Create image metadata record
  async createImageRecord(imageData: Omit<MotorcycleImage, 'id' | 'created_at' | 'updated_at'>): Promise<MotorcycleImage | null> {
    try {
      const { data, error } = await supabase
        .from('motorcycle_images')
        .insert([imageData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating image record:', error);
      return null;
    }
  },

  // Get images for a motorcycle
  async getMotorcycleImages(motorcycleId: string): Promise<MotorcycleImage[]> {
    try {
      const { data, error } = await supabase
        .from('motorcycle_images')
        .select('*')
        .eq('motorcycle_id', motorcycleId)
        .order('is_primary', { ascending: false })
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching motorcycle images:', error);
      return [];
    }
  },

  // Search images by tags
  async searchImagesByTags(tags: string[], brand?: string, model?: string): Promise<MotorcycleImage[]> {
    try {
      let query = supabase
        .from('motorcycle_images')
        .select('*');

      if (brand) query = query.eq('brand', brand);
      if (model) query = query.ilike('model', `%${model}%`);

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching images:', error);
      return [];
    }
  },

  // Get all image tags
  async getImageTags(): Promise<ImageTag[]> {
    try {
      const { data, error } = await supabase
        .from('image_tags')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching image tags:', error);
      return [];
    }
  },

  // Create new tag
  async createTag(tag: Omit<ImageTag, 'id' | 'created_at'>): Promise<ImageTag | null> {
    try {
      const { data, error } = await supabase
        .from('image_tags')
        .insert([tag])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating tag:', error);
      return null;
    }
  },

  // Update motorcycle primary image
  async updateMotorcyclePrimaryImage(motorcycleId: string, imageUrl: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('motorcycles')
        .update({ image_url: imageUrl })
        .eq('id', motorcycleId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating motorcycle primary image:', error);
      return false;
    }
  },

  // Set image as primary for motorcycle
  async setPrimaryImage(imageId: string, motorcycleId: string): Promise<boolean> {
    try {
      // First, unset all other primary images for this motorcycle
      await supabase
        .from('motorcycle_images')
        .update({ is_primary: false })
        .eq('motorcycle_id', motorcycleId);

      // Then set this image as primary
      const { error } = await supabase
        .from('motorcycle_images')
        .update({ is_primary: true })
        .eq('id', imageId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error setting primary image:', error);
      return false;
    }
  }
};
