
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/auth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, PlayCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CourseProgressData {
  id: string;
  title: string;
  slug: string;
  image_url: string | null;
  total_lessons: number;
  completed_lessons: number;
  progress_percentage: number;
}

const CourseProgress: React.FC = () => {
  const { user } = useAuth();

  const { data: courseProgress, isLoading } = useQuery({
    queryKey: ['course-progress', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // Get all courses with lesson counts and user progress
      const { data: courses, error: coursesError } = await supabase
        .from('courses')
        .select(`
          id,
          title,
          slug,
          image_url,
          lessons!inner (
            id,
            published
          )
        `)
        .eq('published', true)
        .eq('lessons.published', true);

      if (coursesError) throw coursesError;

      // Get user progress for each course
      const progressData: CourseProgressData[] = [];
      
      for (const course of courses || []) {
        const totalLessons = course.lessons.length;
        
        // Get completed lessons count
        const { data: completedLessons, error: progressError } = await supabase
          .from('user_progress')
          .select('lesson_id')
          .eq('user_id', user.id)
          .in('lesson_id', course.lessons.map(l => l.id));

        if (progressError) throw progressError;

        const completedCount = completedLessons?.length || 0;
        const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

        // Only include courses with progress or recently started
        if (completedCount > 0 || progressData.length < 3) {
          progressData.push({
            id: course.id,
            title: course.title,
            slug: course.slug,
            image_url: course.image_url,
            total_lessons: totalLessons,
            completed_lessons: completedCount,
            progress_percentage: progressPercentage
          });
        }
      }

      return progressData.sort((a, b) => b.progress_percentage - a.progress_percentage);
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="animate-pulse bg-muted h-24 rounded"></div>
        ))}
      </div>
    );
  }

  if (!courseProgress || courseProgress.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p className="mb-4">Start your learning journey</p>
        <Link to="/courses">
          <Button variant="outline" className="border-accent-teal text-accent-teal hover:bg-accent-teal/10">
            Browse Courses
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {courseProgress.slice(0, 3).map((course) => (
        <Card key={course.id} className="border-l-4 border-l-accent-teal/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                {course.image_url && (
                  <img
                    src={course.image_url}
                    alt={course.title}
                    className="w-10 h-10 object-cover rounded"
                  />
                )}
                <div>
                  <h4 className="font-medium">{course.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {course.completed_lessons} of {course.total_lessons} lessons
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {course.progress_percentage === 100 ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <PlayCircle className="h-5 w-5 text-accent-teal" />
                )}
                <Link to={`/courses/${course.slug}`}>
                  <Button variant="ghost" size="sm">
                    {course.progress_percentage === 100 ? 'Review' : 'Continue'}
                  </Button>
                </Link>
              </div>
            </div>
            <div className="space-y-2">
              <Progress value={course.progress_percentage} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{course.progress_percentage}% complete</span>
                <span>{course.total_lessons - course.completed_lessons} lessons left</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      <div className="text-center pt-2">
        <Link to="/courses">
          <Button variant="ghost" className="text-accent-teal">
            View All Courses
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CourseProgress;
