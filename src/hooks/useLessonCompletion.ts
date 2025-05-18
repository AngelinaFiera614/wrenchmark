
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
        
        // Fixed approach: First get lesson IDs belonging to course
        const { data: lessonData, error: lessonError } = await supabase
          .from('lessons')
          .select('id')
          .eq('course_id', courseId);
          
        if (lessonError) {
          console.error('Error fetching lesson IDs:', lessonError);
          throw lessonError;
        }
        
        // Then fetch progress for those lessons
        if (lessonData && lessonData.length > 0) {
          const lessonIdArray = lessonData.map(item => item.id);
          
          const { data: progressData, error: progressError } = await supabase
            .from('user_progress')
            .select('lesson_id')
            .eq('user_id', user.id)
            .in('lesson_id', lessonIdArray);
            
          if (progressError) {
            console.error('Error fetching lesson progress:', progressError);
            throw progressError;
          }
          
          setCompletedLessons(progressData?.map(item => item.lesson_id) || []);
        } else {
          setCompletedLessons([]);
        }
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
