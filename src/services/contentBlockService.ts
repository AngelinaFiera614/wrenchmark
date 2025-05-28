
import { supabase } from "@/integrations/supabase/client";
import { ContentBlockType, MediaLibraryItem } from "@/types/course";

export async function getContentBlockTypes(): Promise<ContentBlockType[]> {
  const { data, error } = await supabase
    .from("content_block_types")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching content block types:", error);
    throw error;
  }

  return data || [];
}

export async function createContentBlockType(blockType: Partial<ContentBlockType>): Promise<ContentBlockType> {
  const { data, error } = await supabase
    .from("content_block_types")
    .insert(blockType)
    .select()
    .single();

  if (error) {
    console.error("Error creating content block type:", error);
    throw error;
  }

  return data;
}

export async function updateContentBlockType(id: string, updates: Partial<ContentBlockType>): Promise<ContentBlockType> {
  const { data, error } = await supabase
    .from("content_block_types")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating content block type:", error);
    throw error;
  }

  return data;
}

export async function deleteContentBlockType(id: string): Promise<void> {
  const { error } = await supabase
    .from("content_block_types")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting content block type:", error);
    throw error;
  }
}

export async function getMediaLibraryItems(): Promise<MediaLibraryItem[]> {
  const { data, error } = await supabase
    .from("media_library")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching media library items:", error);
    throw error;
  }

  return data || [];
}

export async function uploadToMediaLibrary(mediaItem: Partial<MediaLibraryItem>): Promise<MediaLibraryItem> {
  const { data, error } = await supabase
    .from("media_library")
    .insert(mediaItem)
    .select()
    .single();

  if (error) {
    console.error("Error uploading to media library:", error);
    throw error;
  }

  return data;
}

export async function updateMediaLibraryItem(id: string, updates: Partial<MediaLibraryItem>): Promise<MediaLibraryItem> {
  const { data, error } = await supabase
    .from("media_library")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating media library item:", error);
    throw error;
  }

  return data;
}

export async function deleteMediaLibraryItem(id: string): Promise<void> {
  const { error } = await supabase
    .from("media_library")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting media library item:", error);
    throw error;
  }
}
