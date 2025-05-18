
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/context/auth";

interface CompleteParams {
  lessonId: string;
  quizScore?: number;
}

export const useLessonCompletion = (courseId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Add a query to fetch completed lessons
  const { data: completedLessons = [], isLoading: loading } = useQuery({
    queryKey: ['lessonCompletion', courseId],
    queryFn: async () => {
      if (!user) return [];
      
      const query = supabase
        .from('user_progress')
        .select('lesson_id')
        .eq('user_id', user.id);
      
      // Add course filter if courseId is provided
      if (courseId) {
        const { data: lessons } = await supabase
          .from('lessons')
          .select('id')
          .eq('course_id', courseId);
        
        if (lessons && lessons.length > 0) {
          const lessonIds = lessons.map(l => l.id);
          query.in('lesson_id', lessonIds);
        }
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data ? data.map(item => item.lesson_id) : [];
    },
    enabled: !!user
  });

  const completeLesson = useMutation({
    mutationFn: async ({ lessonId, quizScore }: CompleteParams) => {
      if (!user) throw new Error("User must be logged in");

      const { data, error } = await supabase.rpc('complete_lesson', {
        lesson_id_param: lessonId,
        quiz_score_param: quizScore
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['lessonCompletion'] });
      queryClient.invalidateQueries({ queryKey: ['courseProgress'] });
      queryClient.invalidateQueries({ queryKey: ['userLessons'] });
      queryClient.invalidateQueries({ queryKey: ['userCourses'] });
      queryClient.invalidateQueries({ queryKey: ['userSkills'] });
      
      toast.success("Lesson completed successfully");
    },
    onError: (error) => {
      console.error("Error completing lesson:", error);
      toast.error("Failed to mark lesson as complete");
    }
  });

  return { completeLesson, completedLessons, loading };
};
