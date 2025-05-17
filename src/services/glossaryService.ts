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
 * Check if a slug already exists
 */
export async function checkSlugExists(slug: string, excludeId?: string): Promise<boolean> {
  let query = supabase
    .from('glossary_terms')
    .select('id')
    .eq('slug', slug);
    
  // If we're updating an existing term, exclude it from the check
  if (excludeId) {
    query = query.neq('id', excludeId);
  }
  
  const { data, error } = await query;

  if (error) {
    console.error(`Error checking if slug ${slug} exists:`, error);
    throw error;
  }

  return data && data.length > 0;
}

/**
 * Create a new glossary term
 */
export async function createGlossaryTerm(termData: GlossaryFormValues): Promise<GlossaryTerm> {
  // Check if slug already exists before creating
  const slugExists = await checkSlugExists(termData.slug);
  
  if (slugExists) {
    throw new Error(`A glossary term with the slug "${termData.slug}" already exists`);
  }
  
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
  // If updating slug, check if it already exists for another term
  if (termData.slug) {
    const slugExists = await checkSlugExists(termData.slug, id);
    
    if (slugExists) {
      throw new Error(`A glossary term with the slug "${termData.slug}" already exists`);
    }
  }
  
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
  // Fix: The RPC function expects an unnamed parameter, not a named parameter
  const { data, error } = await supabase
    .rpc('generate_slug', { "": term });

  if (error) {
    console.error("Error generating slug:", error);
    throw error;
  }

  return data as string;
}

/**
 * Generate a unique slug from a term
 * If the generated slug already exists, append a number
 */
export async function generateUniqueSlug(term: string, existingId?: string): Promise<string> {
  let baseSlug = await generateSlugFromTerm(term);
  let slug = baseSlug;
  let counter = 1;
  
  // Keep checking if the slug exists and appending a number until we find a unique slug
  let slugExists = await checkSlugExists(slug, existingId);
  while (slugExists) {
    slug = `${baseSlug}-${counter}`;
    counter++;
    slugExists = await checkSlugExists(slug, existingId);
  }
  
  return slug;
}
