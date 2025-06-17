
import { supabase } from "@/integrations/supabase/client";

export interface MediaLibraryItem {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size_bytes?: number;
  mime_type?: string;
  alt_text?: string;
  caption?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export async function getMediaLibraryItems(
  fileType?: string,
  tags?: string[],
  searchQuery?: string
): Promise<MediaLibraryItem[]> {
  let query = supabase
    .from('media_library')
    .select('*')
    .order('created_at', { ascending: false });

  if (fileType) {
    query = query.eq('file_type', fileType);
  }

  if (tags && tags.length > 0) {
    query = query.overlaps('tags', tags);
  }

  if (searchQuery) {
    query = query.or(`file_name.ilike.%${searchQuery}%,alt_text.ilike.%${searchQuery}%,caption.ilike.%${searchQuery}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching media library items:', error);
    throw error;
  }

  return data || [];
}

export async function uploadMediaItem(file: File, metadata: {
  alt_text?: string;
  caption?: string;
  tags?: string[];
}): Promise<MediaLibraryItem> {
  // Upload to Supabase Storage first (you'll need to create a bucket)
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('media-library')
    .upload(fileName, file);

  if (uploadError) {
    throw uploadError;
  }

  // Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from('media-library')
    .getPublicUrl(uploadData.path);

  // Create database record
  const { data, error } = await supabase
    .from('media_library')
    .insert({
      file_name: file.name,
      file_url: publicUrl,
      file_type: file.type.split('/')[0], // 'image', 'video', 'audio', etc.
      file_size_bytes: file.size,
      mime_type: file.type,
      alt_text: metadata.alt_text,
      caption: metadata.caption,
      tags: metadata.tags || []
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating media library item:', error);
    throw error;
  }

  return data;
}

export async function updateMediaItem(
  id: string, 
  updates: Partial<Pick<MediaLibraryItem, 'alt_text' | 'caption' | 'tags'>>
): Promise<MediaLibraryItem> {
  const { data, error } = await supabase
    .from('media_library')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating media library item:', error);
    throw error;
  }

  return data;
}

export async function deleteMediaItem(id: string): Promise<void> {
  // First get the item to find the file path
  const { data: item } = await supabase
    .from('media_library')
    .select('file_url')
    .eq('id', id)
    .single();

  if (item) {
    // Extract file path from URL and delete from storage
    const filePath = item.file_url.split('/').pop();
    if (filePath) {
      await supabase.storage
        .from('media-library')
        .remove([filePath]);
    }
  }

  // Delete database record
  const { error } = await supabase
    .from('media_library')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting media library item:', error);
    throw error;
  }
}
