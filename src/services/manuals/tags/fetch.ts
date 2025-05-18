
import { supabase } from "@/integrations/supabase/client";
import { ManualTag } from './types';
import { transformToManualTag } from './utils';

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
      
      // Extract tag IDs safely with proper null checks
      const tagIds = joinData
        .filter(item => item !== null && typeof item === 'object' && 'tag_id' in item && item.tag_id !== null)
        .map(item => item.tag_id);
      
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
