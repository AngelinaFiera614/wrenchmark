
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export const useLessonCompletion = (courseId: string) => {
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCompletedLessons = async () => {
      if (!user || !courseId) {
        setCompletedLessons([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('user_progress')
          .select('lesson_id')
          .eq('user_id', user.id)
          .in('lesson_id', supabase
            .from('lessons')
            .select('id')
            .eq('course_id', courseId)
          );

        if (error) {
          console.error('Error fetching completed lessons:', error);
          throw error;
        }

        setCompletedLessons(data?.map(item => item.lesson_id) || []);
      } catch (error) {
        console.error('Error in useLessonCompletion hook:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedLessons();
  }, [user, courseId]);

  const markLessonAsCompleted = (lessonId: string) => {
    setCompletedLessons(prev => {
      if (prev.includes(lessonId)) return prev;
      return [...prev, lessonId];
    });
  };

  return {
    completedLessons,
    loading,
    markLessonAsCompleted
  };
};
