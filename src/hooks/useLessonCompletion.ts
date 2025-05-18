
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/context/auth";

interface CompleteParams {
  lessonId: string;
  quizScore?: number;
}

export const useLessonCompletion = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

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

  return { completeLesson };
};
