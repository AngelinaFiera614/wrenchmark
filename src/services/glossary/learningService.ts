
import { supabase } from "@/integrations/supabase/client";
import { queryClient } from "@/main";

/**
 * Marks a glossary term as learned by the current user
 */
export async function markTermAsLearned(slug: string): Promise<void> {
  const { error } = await supabase.rpc('mark_term_as_learned', { term_slug_param: slug });
  
  if (error) {
    throw error;
  }

  // Invalidate user glossary stats queries
  queryClient.invalidateQueries({ queryKey: ['userGlossaryStats'] });
  queryClient.invalidateQueries({ queryKey: ['userLearnedTerms'] });
}

/**
 * Marks a glossary term as unlearned by the current user
 */
export async function markTermAsUnlearned(slug: string): Promise<void> {
  const { error } = await supabase.rpc('mark_term_as_unlearned', { term_slug_param: slug });
  
  if (error) {
    throw error;
  }
  
  // Invalidate user glossary stats queries
  queryClient.invalidateQueries({ queryKey: ['userGlossaryStats'] });
  queryClient.invalidateQueries({ queryKey: ['userLearnedTerms'] });
}

/**
 * Gets the user's glossary learning statistics
 */
export async function getUserGlossaryStats() {
  const { data, error } = await supabase.rpc('get_user_glossary_stats');
  
  if (error) {
    throw error;
  }
  
  return data;
}

/**
 * Gets the user's learned glossary terms
 */
export async function getUserLearnedTerms(limit: number = 100) {
  const { data, error } = await supabase.rpc('get_user_learned_terms', { 
    limit_param: limit 
  });
  
  if (error) {
    throw error;
  }
  
  return data || [];
}

/**
 * Checks if a term is marked as learned by the current user
 */
export async function isTermLearnedByUser(slug: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('user_glossary_terms')
    .select('is_learned')
    .eq('term_slug', slug)
    .eq('user_id', supabase.auth.getUser().then(res => res.data.user?.id))
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // No rows returned
      return false;
    }
    throw error;
  }

  return data?.is_learned || false;
}
