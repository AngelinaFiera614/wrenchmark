
import { supabase } from "@/integrations/supabase/client";
import { ContentBlock } from "@/types/course";

export interface LessonTemplate {
  id: string;
  name: string;
  description?: string;
  category?: string;
  template_blocks: ContentBlock[];
  is_public: boolean;
  usage_count: number;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export async function getLessonTemplates(
  category?: string,
  isPublic?: boolean
): Promise<LessonTemplate[]> {
  let query = supabase
    .from('lesson_templates')
    .select('*')
    .order('usage_count', { ascending: false });

  if (category) {
    query = query.eq('category', category);
  }

  if (isPublic !== undefined) {
    query = query.eq('is_public', isPublic);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching lesson templates:', error);
    throw error;
  }

  return data || [];
}

export async function createLessonTemplate(template: {
  name: string;
  description?: string;
  category?: string;
  template_blocks: ContentBlock[];
  is_public?: boolean;
}): Promise<LessonTemplate> {
  const { data, error } = await supabase
    .from('lesson_templates')
    .insert(template)
    .select()
    .single();

  if (error) {
    console.error('Error creating lesson template:', error);
    throw error;
  }

  return data;
}

export async function updateLessonTemplate(
  id: string,
  updates: Partial<LessonTemplate>
): Promise<LessonTemplate> {
  const { data, error } = await supabase
    .from('lesson_templates')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating lesson template:', error);
    throw error;
  }

  return data;
}

export async function deleteLessonTemplate(id: string): Promise<void> {
  const { error } = await supabase
    .from('lesson_templates')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting lesson template:', error);
    throw error;
  }
}

export async function incrementTemplateUsage(id: string): Promise<void> {
  // First get the current usage count
  const { data: currentTemplate, error: fetchError } = await supabase
    .from('lesson_templates')
    .select('usage_count')
    .eq('id', id)
    .single();

  if (fetchError) {
    console.error('Error fetching current template usage:', fetchError);
    throw fetchError;
  }

  // Then increment it
  const { error } = await supabase
    .from('lesson_templates')
    .update({ 
      usage_count: (currentTemplate?.usage_count || 0) + 1
    })
    .eq('id', id);

  if (error) {
    console.error('Error incrementing template usage:', error);
    throw error;
  }
}
