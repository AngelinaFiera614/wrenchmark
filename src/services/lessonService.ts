
import { supabase } from "@/integrations/supabase/client";
import { Lesson, LessonQuiz, LessonSkill, QuizQuestion } from "@/types/course";

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
