
import { supabase } from "@/integrations/supabase/client";
import { Lesson } from "@/types/course";
import { getLessonById } from "./lessonOperations";

export async function getNextLesson(currentLessonId: string, courseId: string): Promise<Lesson | null> {
  // First get the current lesson to find its order
  const currentLesson = await getLessonById(currentLessonId);
  if (!currentLesson) return null;

  // Then find the next lesson with a higher order in the same course
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("course_id", courseId)
    .eq("published", true)
    .gt("order", currentLesson.order)
    .order("order", { ascending: true })
    .limit(1)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null; // No next lesson
    }
    console.error("Error fetching next lesson:", error);
    throw error;
  }

  return data;
}

export async function getPreviousLesson(currentLessonId: string, courseId: string): Promise<Lesson | null> {
  // First get the current lesson to find its order
  const currentLesson = await getLessonById(currentLessonId);
  if (!currentLesson) return null;

  // Then find the previous lesson with a lower order in the same course
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("course_id", courseId)
    .eq("published", true)
    .lt("order", currentLesson.order)
    .order("order", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null; // No previous lesson
    }
    console.error("Error fetching previous lesson:", error);
    throw error;
  }

  return data;
}
