
import { supabase } from "@/integrations/supabase/client";
import { LessonQuiz, QuizQuestion } from "@/types/course";

export async function getQuizForLesson(lessonId: string): Promise<LessonQuiz | null> {
  const { data, error } = await supabase
    .from("lesson_quizzes")
    .select("*")
    .eq("lesson_id", lessonId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null; // No quiz found
    }
    console.error("Error fetching quiz for lesson:", error);
    throw error;
  }

  // Parse JSONB questions to strongly typed QuizQuestion array
  if (data && data.questions) {
    return {
      ...data,
      questions: data.questions as unknown as QuizQuestion[]
    };
  }

  return null;
}

export async function createQuizForLesson(quiz: { 
  lesson_id: string; 
  passing_score: number;
  questions: QuizQuestion[];
}): Promise<LessonQuiz> {
  // Convert QuizQuestion[] to JSON-compatible object for Supabase
  const { data, error } = await supabase
    .from("lesson_quizzes")
    .insert({
      lesson_id: quiz.lesson_id,
      passing_score: quiz.passing_score,
      // Explicitly cast questions to a JSON-compatible format
      questions: quiz.questions as any
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating quiz:", error);
    throw error;
  }

  // Parse JSONB questions to strongly typed QuizQuestion array
  return {
    ...data,
    questions: data.questions as unknown as QuizQuestion[]
  };
}

export async function updateQuiz(id: string, updates: {
  passing_score?: number;
  questions?: QuizQuestion[];
  lesson_id: string;
}): Promise<LessonQuiz> {
  // Create an updates object that only includes properties that are provided
  const updateData: any = { lesson_id: updates.lesson_id };
  if (updates.passing_score !== undefined) updateData.passing_score = updates.passing_score;
  if (updates.questions !== undefined) updateData.questions = updates.questions as any;

  const { data, error } = await supabase
    .from("lesson_quizzes")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating quiz:", error);
    throw error;
  }

  // Parse JSONB questions to strongly typed QuizQuestion array
  return {
    ...data,
    questions: data.questions as unknown as QuizQuestion[]
  };
}

export async function deleteQuiz(id: string): Promise<void> {
  const { error } = await supabase
    .from("lesson_quizzes")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting quiz:", error);
    throw error;
  }
}
