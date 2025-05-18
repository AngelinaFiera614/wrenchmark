
import React from 'react';
import { Link } from 'react-router-dom';
import { useLessonCompletion } from '@/hooks/useLessonCompletion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, Circle, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LessonSidebarProps {
  courseId: string;
  courseSlug: string;
  currentLessonId: string;
}

const LessonSidebar: React.FC<LessonSidebarProps> = ({ 
  courseId, 
  courseSlug, 
  currentLessonId 
}) => {
  const { completedLessons, loading: loadingProgress } = useLessonCompletion(courseId);
  
  // Fetch all lessons for this course
  const { data: lessons, isLoading } = useQuery({
    queryKey: ['courseLessons', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order', { ascending: true });
        
      if (error) throw error;
      return data;
    }
  });

  if (isLoading || loadingProgress) {
    return (
      <div className="border rounded-lg p-4 flex justify-center">
        <Loader className="h-5 w-5 animate-spin text-accent-teal" />
      </div>
    );
  }

  if (!lessons || lessons.length === 0) {
    return (
      <div className="border rounded-lg p-4">
        <p className="text-sm text-center text-muted-foreground">
          No lessons available
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-background/50 p-3 border-b">
        <h3 className="font-medium">Course Lessons</h3>
      </div>
      
      <div className="p-2">
        {lessons.map(lesson => {
          const isCompleted = completedLessons.includes(lesson.id);
          const isCurrent = lesson.id === currentLessonId;
          
          return (
            <div 
              key={lesson.id} 
              className="mb-1"
            >
              <Button 
                variant={isCurrent ? "default" : "ghost"}
                asChild
                className={cn(
                  "w-full justify-start text-left", 
                  isCompleted ? "text-accent-teal" : ""
                )}
              >
                <Link to={`/courses/${courseSlug}/${lesson.slug}`}>
                  <div className="flex items-center gap-2 w-full">
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4 flex-shrink-0" />
                    ) : (
                      <Circle className="h-4 w-4 flex-shrink-0" />
                    )}
                    <span className="truncate">{lesson.title}</span>
                  </div>
                </Link>
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LessonSidebar;
