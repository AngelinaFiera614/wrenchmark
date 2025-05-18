
import { supabase } from "@/integrations/supabase/client";

/**
 * Checks if a slug already exists in the glossary_terms table
 */
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

/**
 * Generates a unique slug for a glossary term
 */
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
