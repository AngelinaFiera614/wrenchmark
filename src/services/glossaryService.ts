
import { supabase } from "@/integrations/supabase/client";
import { GlossaryTerm, GlossaryFormValues } from "@/types/glossary";

/**
 * Fetch all glossary terms
 */
export async function fetchGlossaryTerms(): Promise<GlossaryTerm[]> {
  const { data, error } = await supabase
    .from('glossary_terms')
    .select('*')
    .order('term');

  if (error) {
    console.error("Error fetching glossary terms:", error);
    throw error;
  }

  return data as GlossaryTerm[];
}

/**
 * Fetch a glossary term by slug
 */
export async function fetchGlossaryTermBySlug(slug: string): Promise<GlossaryTerm | null> {
  const { data, error } = await supabase
    .from('glossary_terms')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching glossary term with slug ${slug}:`, error);
    throw error;
  }

  return data as GlossaryTerm | null;
}

/**
 * Create a new glossary term
 */
export async function createGlossaryTerm(termData: GlossaryFormValues): Promise<GlossaryTerm> {
  const { data, error } = await supabase
    .from('glossary_terms')
    .insert([termData])
    .select()
    .single();

  if (error) {
    console.error("Error creating glossary term:", error);
    throw error;
  }

  return data as GlossaryTerm;
}

/**
 * Update a glossary term
 */
export async function updateGlossaryTerm(id: string, termData: Partial<GlossaryFormValues>): Promise<GlossaryTerm> {
  const { data, error } = await supabase
    .from('glossary_terms')
    .update(termData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating glossary term with id ${id}:`, error);
    throw error;
  }

  return data as GlossaryTerm;
}

/**
 * Delete a glossary term
 */
export async function deleteGlossaryTerm(id: string): Promise<void> {
  const { error } = await supabase
    .from('glossary_terms')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting glossary term with id ${id}:`, error);
    throw error;
  }
}

/**
 * Search glossary terms
 */
export async function searchGlossaryTerms(query: string): Promise<GlossaryTerm[]> {
  const { data, error } = await supabase
    .from('glossary_terms')
    .select('*')
    .ilike('term', `%${query}%`)
    .order('term');

  if (error) {
    console.error("Error searching glossary terms:", error);
    throw error;
  }

  return data as GlossaryTerm[];
}

/**
 * Filter glossary terms by category
 */
export async function filterGlossaryTermsByCategory(categories: string[]): Promise<GlossaryTerm[]> {
  const { data, error } = await supabase
    .from('glossary_terms')
    .select('*')
    .contains('category', categories)
    .order('term');

  if (error) {
    console.error("Error filtering glossary terms:", error);
    throw error;
  }

  return data as GlossaryTerm[];
}

/**
 * Generate a slug from a term using the database function
 */
export async function generateSlugFromTerm(term: string): Promise<string> {
  const { data, error } = await supabase
    .rpc('generate_slug', { input_text: term });

  if (error) {
    console.error("Error generating slug:", error);
    throw error;
  }

  return data as string;
}
