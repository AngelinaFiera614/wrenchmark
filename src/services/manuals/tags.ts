
import { supabase } from "@/integrations/supabase/client";
import { ManualTag, TagAssociation } from "./types";

/**
 * Get all manual tags
 */
export const getTags = async (): Promise<ManualTag[]> => {
  const { data, error } = await supabase
    .from('manual_tags')
    .select('*')
    .order('name');

  if (error) {
    console.error("Error fetching manual tags:", error);
    throw error;
  }

  return data || [];
};

/**
 * Get tags for a specific manual
 */
export const getTagsForManual = async (manualId: string): Promise<ManualTag[]> => {
  const { data, error } = await supabase
    .from('manual_tag_associations')
    .select(`
      tag_id,
      manual_tags:tag_id (
        id,
        name,
        description,
        color
      )
    `)
    .eq('manual_id', manualId);

  if (error) {
    console.error("Error fetching tags for manual:", error);
    throw error;
  }

  // Extract the tag details from the joined results
  return data?.map(item => item.manual_tags as ManualTag) || [];
};

/**
 * Create a new tag
 */
export const createTag = async (tag: Omit<ManualTag, 'id'>): Promise<ManualTag> => {
  const { data, error } = await supabase
    .from('manual_tags')
    .insert([tag])
    .select()
    .single();

  if (error) {
    console.error("Error creating tag:", error);
    throw error;
  }

  return data;
};

/**
 * Update an existing tag
 */
export const updateTag = async (id: string, updates: Partial<Omit<ManualTag, 'id'>>): Promise<ManualTag> => {
  const { data, error } = await supabase
    .from('manual_tags')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error("Error updating tag:", error);
    throw error;
  }

  return data;
};

/**
 * Delete a tag
 */
export const deleteTag = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('manual_tags')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting tag:", error);
    throw error;
  }
};

/**
 * Associate tags with a manual
 */
export const associateTagsWithManual = async (manualId: string, tagIds: string[]): Promise<void> => {
  // First, delete existing associations
  const { error: deleteError } = await supabase
    .from('manual_tag_associations')
    .delete()
    .eq('manual_id', manualId);

  if (deleteError) {
    console.error("Error removing existing tag associations:", deleteError);
    throw deleteError;
  }

  // Then, add new associations if there are any tags
  if (tagIds.length > 0) {
    const associations = tagIds.map(tagId => ({
      manual_id: manualId,
      tag_id: tagId
    }));

    const { error: insertError } = await supabase
      .from('manual_tag_associations')
      .insert(associations);

    if (insertError) {
      console.error("Error creating tag associations:", insertError);
      throw insertError;
    }
  }
};

/**
 * Get or create tags by name
 * Useful for auto-tagging based on file analysis
 */
export const getOrCreateTagsByNames = async (tagNames: string[]): Promise<ManualTag[]> => {
  if (!tagNames.length) return [];
  
  // First try to find existing tags
  const { data: existingTags, error: fetchError } = await supabase
    .from('manual_tags')
    .select('*')
    .in('name', tagNames);

  if (fetchError) {
    console.error("Error fetching existing tags:", fetchError);
    throw fetchError;
  }

  const existingTagNames = existingTags?.map(tag => tag.name.toLowerCase()) || [];
  const newTagNames = tagNames.filter(name => 
    !existingTagNames.includes(name.toLowerCase())
  );

  // Create any new tags that don't exist yet
  if (newTagNames.length > 0) {
    const newTags = newTagNames.map(name => ({
      name,
      description: `Auto-generated tag for ${name}`,
      color: getRandomColor()
    }));

    const { data: createdTags, error: createError } = await supabase
      .from('manual_tags')
      .insert(newTags)
      .select();

    if (createError) {
      console.error("Error creating new tags:", createError);
      throw createError;
    }

    // Combine existing and newly created tags
    return [...(existingTags || []), ...(createdTags || [])];
  }

  return existingTags || [];
};

// Helper function to generate random colors for auto-generated tags
const getRandomColor = (): string => {
  const colors = [
    '#00D2B4', // Brand teal
    '#3B82F6', // Blue
    '#F59E0B', // Amber
    '#10B981', // Emerald
    '#8B5CF6', // Violet
    '#EC4899', // Pink
    '#F97316', // Orange
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};
