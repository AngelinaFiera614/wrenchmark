
// If this file doesn't exist already, we'll create it with the needed functions
import { supabase } from "@/integrations/supabase/client";
import { GlossaryTerm, GlossaryFormValues } from "@/types/glossary";
import { toast } from "sonner";
import { queryClient } from "@/main";

export async function fetchGlossaryTerms(): Promise<GlossaryTerm[]> {
  const { data, error } = await supabase
    .from('glossary_terms')
    .select('*')
    .order('term');

  if (error) {
    throw new Error(`Error fetching glossary terms: ${error.message}`);
  }

  return data || [];
}

export async function fetchGlossaryTermBySlug(slug: string): Promise<GlossaryTerm | null> {
  const { data, error } = await supabase
    .from('glossary_terms')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // No rows returned
      return null;
    }
    throw new Error(`Error fetching glossary term: ${error.message}`);
  }

  return data;
}

export async function generateUniqueSlug(term: string, existingId?: string): Promise<string> {
  // Convert term to slug format
  let slug = term.toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  // Check if slug exists
  const exists = await checkSlugExists(slug, existingId);
  
  // If slug exists, add a suffix
  if (exists) {
    let counter = 1;
    let newSlug = `${slug}-${counter}`;
    
    while (await checkSlugExists(newSlug, existingId)) {
      counter++;
      newSlug = `${slug}-${counter}`;
    }
    
    slug = newSlug;
  }
  
  return slug;
}

export async function checkSlugExists(slug: string, existingId?: string): Promise<boolean> {
  let query = supabase
    .from('glossary_terms')
    .select('id')
    .eq('slug', slug);
  
  if (existingId) {
    query = query.neq('id', existingId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    throw new Error(`Error checking slug existence: ${error.message}`);
  }
  
  return data.length > 0;
}

export async function createGlossaryTerm(values: GlossaryFormValues): Promise<GlossaryTerm> {
  // Generate a slug first
  const slug = await generateUniqueSlug(values.term);
  
  // Now we have the actual string value for the slug
  const termWithSlug = {
    ...values,
    slug
  };
  
  const { data, error } = await supabase
    .from('glossary_terms')
    .insert(termWithSlug)
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating glossary term: ${error.message}`);
  }

  // Invalidate queries to refresh data
  queryClient.invalidateQueries({ queryKey: ['glossaryTerms'] });
  
  return data;
}

export async function updateGlossaryTerm(
  id: string, 
  values: GlossaryFormValues
): Promise<GlossaryTerm> {
  // If term was changed, generate a new slug
  let slug = values.slug;
  if (values.term) {
    // Make sure to await the Promise to get the string value
    slug = await generateUniqueSlug(values.term, id);
  }
  
  const termWithSlug = {
    ...values,
    slug
  };

  const { data, error } = await supabase
    .from('glossary_terms')
    .update(termWithSlug)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error updating glossary term: ${error.message}`);
  }

  // Invalidate queries to refresh data
  queryClient.invalidateQueries({ queryKey: ['glossaryTerms'] });
  queryClient.invalidateQueries({ queryKey: ['glossaryTerm', slug] });
  
  return data;
}

export async function deleteTerm(id: string): Promise<void> {
  const { error } = await supabase
    .from('glossary_terms')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Error deleting glossary term: ${error.message}`);
  }

  // Invalidate queries to refresh data
  queryClient.invalidateQueries({ queryKey: ['glossaryTerms'] });
}

export async function markTermAsLearned(slug: string): Promise<void> {
  const { error } = await supabase.rpc('mark_term_as_learned', { term_slug_param: slug });
  
  if (error) {
    throw error;
  }

  // Invalidate user glossary stats queries
  queryClient.invalidateQueries({ queryKey: ['userGlossaryStats'] });
  queryClient.invalidateQueries({ queryKey: ['userLearnedTerms'] });
}

export async function markTermAsUnlearned(slug: string): Promise<void> {
  const { error } = await supabase.rpc('mark_term_as_unlearned', { term_slug_param: slug });
  
  if (error) {
    throw error;
  }
  
  // Invalidate user glossary stats queries
  queryClient.invalidateQueries({ queryKey: ['userGlossaryStats'] });
  queryClient.invalidateQueries({ queryKey: ['userLearnedTerms'] });
}

export async function getUserGlossaryStats() {
  const { data, error } = await supabase.rpc('get_user_glossary_stats');
  
  if (error) {
    throw error;
  }
  
  return data;
}

export async function getUserLearnedTerms(limit: number = 100) {
  const { data, error } = await supabase.rpc('get_user_learned_terms', { 
    limit_param: limit 
  });
  
  if (error) {
    throw error;
  }
  
  return data || [];
}

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
