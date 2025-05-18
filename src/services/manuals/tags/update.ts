
import { supabase } from "@/integrations/supabase/client";
import { ManualTag } from './types';
import { transformToManualTag } from './utils';

/**
 * Update an existing tag
 */
export const updateTag = async (id: string, updates: Partial<Omit<ManualTag, 'id'>>): Promise<ManualTag> => {
  const { data, error } = await supabase
    .from('manual_tags' as any)
    .update(updates as any)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error("Error updating tag:", error);
    throw error;
  }

  // Safely transform and validate the data
  return transformToManualTag(data);
};

/**
 * Delete a tag
 */
export const deleteTag = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('manual_tags' as any)
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
    .from('manual_tag_associations' as any)
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
      .from('manual_tag_associations' as any)
      .insert(associations as any);

    if (insertError) {
      console.error("Error creating tag associations:", insertError);
      throw insertError;
    }
  }
};
