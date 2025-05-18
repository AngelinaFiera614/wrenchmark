
import { supabase } from "@/integrations/supabase/client";
import { Course, CourseProgress, CourseWithProgress } from "@/types/course";

export async function getCourses(): Promise<Course[]> {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }

  return data || [];
}

export async function getPublishedCourses(): Promise<Course[]> {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching published courses:", error);
    throw error;
  }

  return data || [];
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // PGRST116 means no rows returned
      return null;
    }
    console.error("Error fetching course by slug:", error);
    throw error;
  }

  return data;
}

export async function getCourseById(id: string): Promise<Course | null> {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    console.error("Error fetching course by id:", error);
    throw error;
  }

  return data;
}

export async function createCourse(course: Partial<Course>): Promise<Course> {
  // Generate a slug if not provided
  if (!course.slug && course.title) {
    const { data: slugData } = await supabase.rpc(
      "generate_course_slug",
      { title_input: course.title }
    );
    course.slug = slugData;
  }

  const { data, error } = await supabase
    .from("courses")
    .insert([course])
    .select()
    .single();

  if (error) {
    console.error("Error creating course:", error);
    throw error;
  }

  return data;
}

export async function updateCourse(id: string, updates: Partial<Course>): Promise<Course> {
  const { data, error } = await supabase
    .from("courses")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating course:", error);
    throw error;
  }

  return data;
}

export async function deleteCourse(id: string): Promise<void> {
  const { error } = await supabase
    .from("courses")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting course:", error);
    throw error;
  }
}

export async function getCourseProgress(courseId: string): Promise<CourseProgress> {
  const { data, error } = await supabase
    .rpc("get_course_progress", { course_id_param: courseId });

  if (error) {
    console.error("Error getting course progress:", error);
    throw error;
  }

  return data && data.length > 0 ? data[0] : {
    total_lessons: 0,
    completed_lessons: 0,
    progress_percentage: 0
  };
}

export async function getCoursesWithProgress(): Promise<CourseWithProgress[]> {
  // Get authenticated user's courses with progress
  const { data: courses, error: coursesError } = await supabase
    .from("courses")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (coursesError) {
    console.error("Error fetching courses:", coursesError);
    throw coursesError;
  }

  const coursesWithProgress: CourseWithProgress[] = [];
  
  for (const course of courses || []) {
    try {
      const progress = await getCourseProgress(course.id);
      coursesWithProgress.push({
        ...course,
        progress
      });
    } catch (error) {
      console.error(`Error getting progress for course ${course.id}:`, error);
      coursesWithProgress.push(course);
    }
  }

  return coursesWithProgress;
}
