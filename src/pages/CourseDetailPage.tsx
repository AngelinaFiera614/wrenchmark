import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getCourseBySlug, getCourseProgress } from "@/services/courseService";
import { getPublishedLessonsByCourseId } from "@/services/lessonService";
import { Course, Lesson, CourseProgress } from "@/types/course";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, BookOpen, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useAuth } from '@/context/auth';
import { useLessonCompletion } from "@/hooks/useLessonCompletion";
import { Skeleton } from "@/components/ui/skeleton";

const CourseDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  const { completedLessons } = useLessonCompletion(course?.id || "");

  useEffect(() => {
    const loadCourse = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        
        // Load course details
        const courseData = await getCourseBySlug(slug);
        if (!courseData) {
          toast.error("Course not found");
          navigate("/courses");
          return;
        }
        
        setCourse(courseData);
        
        // Load lessons
        const lessonsData = await getPublishedLessonsByCourseId(courseData.id);
        setLessons(lessonsData);
        
        // Load progress if user is logged in
        if (user) {
          try {
            const progressData = await getCourseProgress(courseData.id);
            setProgress(progressData);
          } catch (error) {
            console.error("Error loading progress:", error);
          }
        }
        
      } catch (error) {
        console.error("Error loading course:", error);
        toast.error("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };
    
    loadCourse();
  }, [slug, navigate, user]);

  const startOrContinueCourse = () => {
    // If no lessons, do nothing
    if (lessons.length === 0) {
      toast.info("This course doesn't have any lessons yet");
      return;
    }
    
    // Find first incomplete lesson or first lesson
    if (completedLessons.length > 0 && completedLessons.length < lessons.length) {
      // Find first lesson that's not completed
      const nextLesson = lessons.find(lesson => !completedLessons.includes(lesson.id));
      if (nextLesson) {
        navigate(`/courses/${course?.slug}/${nextLesson.slug}`);
        return;
      }
    }
    
    // Default to first lesson
    navigate(`/courses/${course?.slug}/${lessons[0].slug}`);
  };
  
  if (loading) {
    return (
      <div className="container py-8">
        <div className="mb-6">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-full max-w-2xl" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Skeleton className="h-40 w-full mb-4" />
            <div className="space-y-3">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-5 w-5/6" />
            </div>
          </div>
          
          <div>
            <Skeleton className="h-12 w-full mb-4" />
            <div className="space-y-2">
              {Array(5).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Course Not Found</h2>
            <p className="mb-6">The course you're looking for doesn't exist or isn't available.</p>
            <Button asChild>
              <Link to="/courses">Back to Courses</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{course.title} | Wrenchmark Courses</title>
      </Helmet>
      
      <div className="container py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/courses">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Courses
            </Link>
          </Button>
          
          <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
          {course.description && (
            <p className="text-muted-foreground">{course.description}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {course.image_url && (
              <div className="rounded-lg overflow-hidden mb-6">
                <img 
                  src={course.image_url} 
                  alt={course.title} 
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
            
            {progress && (
              <Card className="mb-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Your Progress</CardTitle>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Completion</span>
                    <span>{progress.progress_percentage}%</span>
                  </div>
                  <Progress 
                    value={progress.progress_percentage} 
                    className="h-2"
                  />
                  <p className="mt-3 text-sm">
                    You've completed {progress.completed_lessons} of {progress.total_lessons} lessons
                  </p>
                </CardContent>
                <CardFooter>
                  <Button onClick={startOrContinueCourse} className="w-full">
                    {progress.progress_percentage === 0 && (
                      <>
                        <BookOpen className="mr-2 h-4 w-4" /> 
                        Start Course
                      </>
                    )}
                    {progress.progress_percentage > 0 && progress.progress_percentage < 100 && (
                      <>
                        <ArrowRight className="mr-2 h-4 w-4" /> 
                        Continue Learning
                      </>
                    )}
                    {progress.progress_percentage === 100 && (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" /> 
                        Review Course
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )}
            
            {!progress && (
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <Button onClick={startOrContinueCourse} className="w-full">
                    <BookOpen className="mr-2 h-4 w-4" /> 
                    Start Course
                  </Button>
                </CardContent>
              </Card>
            )}
            
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4">About This Course</h2>
              {course.description ? (
                <p className="text-muted-foreground">{course.description}</p>
              ) : (
                <p className="text-muted-foreground italic">No additional details available for this course.</p>
              )}
            </div>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Course Lessons</CardTitle>
                <CardDescription>
                  {lessons.length} {lessons.length === 1 ? 'lesson' : 'lessons'} in this course
                </CardDescription>
              </CardHeader>
              <CardContent>
                {lessons.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No lessons available yet
                  </p>
                ) : (
                  <div className="space-y-2">
                    {lessons.map((lesson, index) => {
                      const isCompleted = completedLessons.includes(lesson.id);
                      
                      return (
                        <Button
                          key={lesson.id}
                          variant="outline"
                          className="w-full justify-start"
                          asChild
                        >
                          <Link to={`/courses/${course.slug}/${lesson.slug}`}>
                            <div className="flex items-center w-full">
                              <div className="mr-2 flex-shrink-0">
                                {isCompleted ? (
                                  <CheckCircle2 className="h-4 w-4 text-accent-teal" />
                                ) : (
                                  <span className="inline-flex items-center justify-center h-5 w-5 rounded-full border text-xs">
                                    {index + 1}
                                  </span>
                                )}
                              </div>
                              <span className="truncate">{lesson.title}</span>
                            </div>
                          </Link>
                        </Button>
                      );
                    })}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button onClick={startOrContinueCourse} className="w-full">
                  {progress && progress.progress_percentage > 0 ? (
                    <>Continue Learning</>
                  ) : (
                    <>Start Course</>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseDetailPage;
