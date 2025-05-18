
import { supabase } from "@/integrations/supabase/client";
import { ManualTag } from './types';
import { transformToManualTag, getRandomColor } from './utils';

/**
 * Create a new tag
 */
export const createTag = async (tag: Omit<ManualTag, 'id'>): Promise<ManualTag> => {
  const { data, error } = await supabase
    .from('manual_tags' as any)
    .insert([tag as any])
    .select()
    .single();

  if (error) {
    console.error("Error creating tag:", error);
    throw error;
  }

  // Safely transform and validate the data
  return transformToManualTag(data);
};

/**
 * Get or create tags by name
 * Useful for auto-tagging based on file analysis
 */
export const getOrCreateTagsByNames = async (tagNames: string[]): Promise<ManualTag[]> => {
  if (!tagNames.length) return [];
  
  // First try to find existing tags
  const { data: existingTags, error: fetchError } = await supabase
    .from('manual_tags' as any)
    .select('*')
    .in('name', tagNames);

  if (fetchError) {
    console.error("Error fetching existing tags:", fetchError);
    throw fetchError;
  }

  // Safely transform and validate existing tags
  const validExistingTags = Array.isArray(existingTags)
    ? existingTags.map(item => transformToManualTag(item))
    : [];

  const existingTagNames = validExistingTags.map(tag => tag.name.toLowerCase());
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
      .from('manual_tags' as any)
      .insert(newTags as any)
      .select();

    if (createError) {
      console.error("Error creating new tags:", createError);
      throw createError;
    }

    // Safely transform and validate created tags
    const validCreatedTags = Array.isArray(createdTags)
      ? createdTags.map(item => transformToManualTag(item))
      : [];

    // Combine existing and newly created tags
    return [...validExistingTags, ...validCreatedTags];
  }

  return validExistingTags;
};
