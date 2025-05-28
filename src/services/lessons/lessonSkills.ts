
import { supabase } from "@/integrations/supabase/client";
import { LessonSkill } from "@/types/course";

export async function getLessonSkills(lessonId: string): Promise<LessonSkill[]> {
  const { data, error } = await supabase
    .from("lesson_skills")
    .select("*, skills(*)")
    .eq("lesson_id", lessonId);

  if (error) {
    console.error("Error fetching lesson skills:", error);
    throw error;
  }

  return data || [];
}
