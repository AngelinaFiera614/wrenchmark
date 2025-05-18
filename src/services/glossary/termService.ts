
import { supabase } from "@/integrations/supabase/client";
import { GlossaryTerm, GlossaryFormValues } from "@/types/glossary";
import { toast } from "sonner";
import { queryClient } from "@/main";
import { generateUniqueSlug } from "./slugService";

/**
 * Fetches all glossary terms from the database
 */
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

/**
 * Fetches a specific glossary term by its slug
 */
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

/**
 * Creates a new glossary term
 */
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

/**
 * Updates an existing glossary term
 */
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

/**
 * Deletes a glossary term by ID
 */
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
