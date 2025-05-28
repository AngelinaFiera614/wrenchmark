
import { supabase } from "@/integrations/supabase/client";
import { Lesson } from "@/types/course";

export async function getLessonsByCourseId(courseId: string): Promise<Lesson[]> {
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("course_id", courseId)
    .order("order", { ascending: true });

  if (error) {
    console.error("Error fetching lessons:", error);
    throw error;
  }

  return data || [];
}

export async function getPublishedLessonsByCourseId(courseId: string): Promise<Lesson[]> {
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("course_id", courseId)
    .eq("published", true)
    .order("order", { ascending: true });

  if (error) {
    console.error("Error fetching published lessons:", error);
    throw error;
  }

  return data || [];
}

export async function getLessonById(id: string): Promise<Lesson | null> {
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    console.error("Error fetching lesson by id:", error);
    throw error;
  }

  return data;
}

export async function getLessonBySlug(slug: string): Promise<Lesson | null> {
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    console.error("Error fetching lesson by slug:", error);
    throw error;
  }

  return data;
}

export async function createLesson(lesson: Partial<Lesson>): Promise<Lesson> {
  // Generate a slug if not provided
  if (!lesson.slug && lesson.title) {
    const { data: slugData } = await supabase.rpc(
      "generate_lesson_slug",
      { title_input: lesson.title }
    );
    lesson.slug = slugData;
  }

  // Fix: Ensure required properties are present
  if (!lesson.title || !lesson.slug || !lesson.course_id || lesson.order === undefined) {
    throw new Error("Lesson title, slug, course_id, and order are required");
  }

  const { data, error } = await supabase
    .from("lessons")
    .insert({
      title: lesson.title,
      slug: lesson.slug,
      course_id: lesson.course_id,
      order: lesson.order,
      content: lesson.content || null,
      content_blocks: lesson.content_blocks || [],
      estimated_time_minutes: lesson.estimated_time_minutes,
      difficulty_level: lesson.difficulty_level,
      skill_tags: lesson.skill_tags || [],
      published: lesson.published !== undefined ? lesson.published : false
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating lesson:", error);
    throw error;
  }

  return data;
}

export async function updateLesson(id: string, updates: Partial<Lesson>): Promise<Lesson> {
  const { data, error } = await supabase
    .from("lessons")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating lesson:", error);
    throw error;
  }

  return data;
}

export async function deleteLesson(id: string): Promise<void> {
  const { error } = await supabase
    .from("lessons")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting lesson:", error);
    throw error;
  }
}
