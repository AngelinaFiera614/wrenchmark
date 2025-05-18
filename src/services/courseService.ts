
import { supabase } from '@/integrations/supabase/client';
import { Course, CourseWithProgress, CourseProgress } from '@/types/course';

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

  // Fix: Ensure required properties are present
  if (!course.title || !course.slug) {
    throw new Error("Course title and slug are required");
  }

  const { data, error } = await supabase
    .from("courses")
    .insert({
      title: course.title,
      slug: course.slug,
      description: course.description || null,
      image_url: course.image_url || null,
      published: course.published !== undefined ? course.published : false
    })
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

/**
 * Fetches user's courses with their progress
 */
export async function getCoursesWithProgress(): Promise<CourseWithProgress[]> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return [];
  }

  // First get all courses
  const { data: courses, error: coursesError } = await supabase
    .from('courses')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (coursesError) {
    console.error('Error fetching courses:', coursesError);
    return [];
  }

  if (!courses || courses.length === 0) {
    return [];
  }

  // For each course, get its lessons and user progress
  const coursesWithProgress: CourseWithProgress[] = await Promise.all(
    courses.map(async (course) => {
      // Get total lessons for this course
      const { count: totalLessons, error: countError } = await supabase
        .from('lessons')
        .select('*', { count: 'exact', head: true })
        .eq('course_id', course.id)
        .eq('published', true);

      if (countError) {
        console.error(`Error counting lessons for course ${course.id}:`, countError);
        return { ...course, progress: { completed_lessons: 0, total_lessons: 0, progress_percentage: 0 } };
      }

      // Get completed lessons for this course
      const { data: lessonIds, error: lessonsError } = await supabase
        .from('lessons')
        .select('id')
        .eq('course_id', course.id)
        .eq('published', true);

      if (lessonsError || !lessonIds) {
        console.error(`Error fetching lesson IDs for course ${course.id}:`, lessonsError);
        return { ...course, progress: { completed_lessons: 0, total_lessons: totalLessons || 0, progress_percentage: 0 } };
      }

      // If there are no lessons, return course with 0 progress
      if (lessonIds.length === 0) {
        return { ...course, progress: { completed_lessons: 0, total_lessons: 0, progress_percentage: 0 } };
      }

      // Get user progress for these lessons
      const { data: completedLessons, error: progressError } = await supabase
        .from('user_progress')
        .select('lesson_id')
        .eq('user_id', userData.user.id)
        .in('lesson_id', lessonIds.map(lesson => lesson.id));

      if (progressError) {
        console.error(`Error fetching user progress for course ${course.id}:`, progressError);
        return { ...course, progress: { completed_lessons: 0, total_lessons: totalLessons || 0, progress_percentage: 0 } };
      }

      const completed = completedLessons?.length || 0;
      const total = totalLessons || 0;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        ...course,
        progress: {
          completed_lessons: completed,
          total_lessons: total,
          progress_percentage: percentage
        }
      };
    })
  );

  return coursesWithProgress;
}
