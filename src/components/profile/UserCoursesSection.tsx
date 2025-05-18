
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { CourseWithProgress } from '@/types/course'; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, CheckCircle2 } from 'lucide-react';
import { getCoursesWithProgress } from '@/services/courseService';

const UserCoursesSection: React.FC = () => {
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadCourses = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const coursesData = await getCoursesWithProgress();
        // Filter to only courses with progress
        const inProgressCourses = coursesData.filter(
          course => course.progress && (
            course.progress.progress_percentage > 0 || 
            course.progress.completed_lessons > 0
          )
        );
        setCourses(inProgressCourses);
      } catch (error) {
        console.error("Error loading courses:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Your Courses</CardTitle>
        <CardDescription>
          Continue where you left off
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {Array(2).fill(0).map((_, i) => (
              <div key={i} className="border rounded-md p-4 space-y-3">
                <Skeleton className="h-5 w-48" />
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-8" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
                <div className="pt-2 flex justify-end">
                  <Skeleton className="h-9 w-28" />
                </div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">
              You haven't started any courses yet
            </p>
            <Button asChild>
              <Link to="/courses">
                <BookOpen className="mr-2 h-4 w-4" />
                Browse Courses
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map((course) => (
              <div key={course.id} className="border rounded-md p-4 space-y-3">
                <h3 className="font-medium">{course.title}</h3>
                
                {course.progress && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>{course.progress.progress_percentage}%</span>
                    </div>
                    <Progress value={course.progress.progress_percentage} className="h-2" />
                    <p className="text-xs text-muted-foreground pt-1">
                      {course.progress.completed_lessons} of {course.progress.total_lessons} lessons completed
                    </p>
                  </div>
                )}
                
                <div className="pt-2 flex justify-end">
                  <Button asChild size="sm">
                    <Link to={`/courses/${course.slug}`}>
                      {course.progress && course.progress.progress_percentage === 100 ? (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Review
                        </>
                      ) : (
                        <>
                          <ArrowRight className="mr-2 h-4 w-4" />
                          Continue
                        </>
                      )}
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
            
            <div className="pt-2">
              <Button variant="outline" asChild className="w-full">
                <Link to="/courses">
                  View All Courses
                </Link>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserCoursesSection;
