
import { supabase } from "@/integrations/supabase/client";

export interface MotorcycleImage {
  id: string;
  motorcycle_id?: string;
  model_year_id?: string;
  configuration_id?: string;
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
      return { url: '', error: error instanceof Error ? error : new Error('Upload failed') };
    }
  },

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

  async getModelYearImages(modelYearId: string): Promise<MotorcycleImage[]> {
    try {
      const { data, error } = await supabase
        .from('motorcycle_images')
        .select('*')
        .eq('model_year_id', modelYearId)
        .order('is_primary', { ascending: false })
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching model year images:', error);
      return [];
    }
  },

  async getConfigurationImages(configurationId: string): Promise<MotorcycleImage[]> {
    try {
      const { data, error } = await supabase
        .from('motorcycle_images')
        .select('*')
        .eq('configuration_id', configurationId)
        .order('is_primary', { ascending: false })
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching configuration images:', error);
      return [];
    }
  },

  async searchImagesByTags(tags: string[], brand?: string, model?: string): Promise<MotorcycleImage[]> {
    try {
      let query = supabase
        .from('motorcycle_images')
        .select(`
          *,
          image_tag_associations!inner(
            tag_id,
            image_tags!inner(name)
          )
        `);

      if (brand) query = query.eq('brand', brand);
      if (model) query = query.ilike('model', `%${model}%`);
      
      if (tags.length > 0) {
        query = query.in('image_tag_associations.image_tags.name', tags);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching images by tags:', error);
      return [];
    }
  },

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

  async associateImageTags(imageId: string, tagIds: string[]): Promise<boolean> {
    try {
      await supabase
        .from('image_tag_associations')
        .delete()
        .eq('image_id', imageId);

      if (tagIds.length > 0) {
        const associations = tagIds.map(tagId => ({
          image_id: imageId,
          tag_id: tagId
        }));

        const { error } = await supabase
          .from('image_tag_associations')
          .insert(associations);

        if (error) throw error;
      }

      return true;
    } catch (error) {
      console.error('Error associating image tags:', error);
      return false;
    }
  },

  async setPrimaryImage(imageId: string, scope: {
    motorcycleId?: string;
    modelYearId?: string;
    configurationId?: string;
  }): Promise<boolean> {
    try {
      let unsetQuery = supabase
        .from('motorcycle_images')
        .update({ is_primary: false });

      if (scope.motorcycleId) {
        unsetQuery = unsetQuery.eq('motorcycle_id', scope.motorcycleId);
      }
      if (scope.modelYearId) {
        unsetQuery = unsetQuery.eq('model_year_id', scope.modelYearId);
      }
      if (scope.configurationId) {
        unsetQuery = unsetQuery.eq('configuration_id', scope.configurationId);
      }

      await unsetQuery;

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
  },

  async updateMotorcyclePrimaryImage(motorcycleId: string, imageUrl: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('motorcycle_models')
        .update({ default_image_url: imageUrl })
        .eq('id', motorcycleId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating motorcycle primary image:', error);
      return false;
    }
  },

  async deleteImage(imageId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('motorcycle_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  }
};
