
import { supabase } from "@/integrations/supabase/client";
import { ManualTag, TagAssociation } from "./types";

/**
 * Helper function to safely transform data into ManualTag format
 */
const transformToManualTag = (item: any): ManualTag => {
  return {
    id: String(item?.id || ''),
    name: String(item?.name || ''),
    description: item?.description ? String(item.description) : undefined,
    color: String(item?.color || '#00D2B4')
  };
};

/**
 * Get all manual tags
 */
export const getTags = async (): Promise<ManualTag[]> => {
  const { data, error } = await supabase
    .from('manual_tags' as any)
    .select('*')
    .order('name');

  if (error) {
    console.error("Error fetching manual tags:", error);
    throw error;
  }

  // Safely transform and validate the data
  return Array.isArray(data) 
    ? data.map(item => transformToManualTag(item))
    : [];
};

/**
 * Get tags for a specific manual
 */
export const getTagsForManual = async (manualId: string): Promise<ManualTag[]> => {
  try {
    // First try using the RPC function
    const { data, error } = await supabase
      .rpc('get_tags_for_manual' as any, { manual_id_param: manualId });
    
    if (error) {
      throw error;
    }
    
    // Safely transform and validate the data
    return Array.isArray(data)
      ? data.map(item => transformToManualTag(item))
      : [];
    
  } catch (error) {
    console.log("RPC method failed, using fallback query method", error);
    
    // Fallback method if RPC doesn't exist yet
    try {
      const { data: joinData, error: joinError } = await supabase
        .from('manual_tag_associations' as any)
        .select(`
          tag_id
        `)
        .eq('manual_id', manualId);
        
      if (joinError) {
        console.error("Error fetching tag associations for manual:", joinError);
        throw joinError;
      }
      
      if (!joinData || !Array.isArray(joinData) || joinData.length === 0) {
        return [];
      }
      
      // Extract tag IDs safely - Fix the null check here
      const tagIds = joinData
        .filter(item => item && typeof item === 'object' && 'tag_id' in item)
        .map((item: any) => item?.tag_id);
      
      if (tagIds.length === 0) {
        return [];
      }
      
      const { data: tagData, error: tagError } = await supabase
        .from('manual_tags' as any)
        .select('*')
        .in('id', tagIds);
        
      if (tagError) {
        console.error("Error fetching tags by IDs:", tagError);
        throw tagError;
      }
      
      // Safely transform and validate the data
      return Array.isArray(tagData)
        ? tagData.map(item => transformToManualTag(item))
        : [];
    } catch (fallbackError) {
      console.error("Fallback method also failed:", fallbackError);
      return [];
    }
  }
};

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
