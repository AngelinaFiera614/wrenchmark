
import { supabase } from "@/integrations/supabase/client";

export async function completeLesson(lessonId: string, quizScore?: number): Promise<boolean> {
  const { data, error } = await supabase
    .rpc("complete_lesson", {
      lesson_id_param: lessonId,
      quiz_score_param: quizScore || null
    });

  if (error) {
    console.error("Error marking lesson as complete:", error);
    throw error;
  }

  return data || false;
}

export async function isLessonCompleted(lessonId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("user_progress")
    .select("*")
    .eq("lesson_id", lessonId)
    .maybeSingle();

  if (error) {
    console.error("Error checking lesson completion:", error);
    throw error;
  }

  return !!data;
}
