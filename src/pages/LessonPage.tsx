
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getLessonBySlug, getNextLesson, getPreviousLesson, getQuizForLesson } from "@/services/lessonService";
import { getCourseBySlug } from "@/services/courseService";
import { Lesson, LessonQuiz, Course } from "@/types/course";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, ChevronLeft } from "lucide-react";
import LessonContent from "@/components/learning/LessonContent";
import QuizComponent from "@/components/learning/QuizComponent";
import CompleteLessonButton from "@/components/learning/CompleteLessonButton";
import { useLessonCompletion } from "@/hooks/useLessonCompletion";

const LessonPage: React.FC = () => {
  const { courseSlug, lessonSlug } = useParams<{ courseSlug: string; lessonSlug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [quiz, setQuiz] = useState<LessonQuiz | null>(null);
  const [nextLesson, setNextLesson] = useState<Lesson | null>(null);
  const [prevLesson, setPrevLesson] = useState<Lesson | null>(null);
  const [quizScore, setQuizScore] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  
  const { completedLessons, markLessonAsCompleted } = useLessonCompletion(course?.id || "");
  
  const isCompleted = lesson ? completedLessons.includes(lesson.id) : false;

  useEffect(() => {
    const loadLesson = async () => {
      if (!courseSlug || !lessonSlug) return;
      
      try {
        setLoading(true);
        
        // Load course details first
        const courseData = await getCourseBySlug(courseSlug);
        if (!courseData) {
          toast.error("Course not found");
          navigate("/courses");
          return;
        }
        setCourse(courseData);
        
        // Load lesson
        const lessonData = await getLessonBySlug(lessonSlug);
        if (!lessonData) {
          toast.error("Lesson not found");
          navigate(`/courses/${courseSlug}`);
          return;
        }
        setLesson(lessonData);
        
        // Verify lesson belongs to this course
        if (lessonData.course_id !== courseData.id) {
          toast.error("Lesson doesn't belong to this course");
          navigate(`/courses/${courseSlug}`);
          return;
        }
        
        // Load quiz if exists
        try {
          const quizData = await getQuizForLesson(lessonData.id);
          setQuiz(quizData);
        } catch (error) {
          console.error("Error loading quiz:", error);
          // Non-critical error, can continue without quiz
        }
        
        // Get next and previous lessons
        try {
          const nextLessonData = await getNextLesson(lessonData.id, courseData.id);
          setNextLesson(nextLessonData);
          
          const prevLessonData = await getPreviousLesson(lessonData.id, courseData.id);
          setPrevLesson(prevLessonData);
        } catch (error) {
          console.error("Error loading next/previous lessons:", error);
          // Non-critical error
        }
        
      } catch (error) {
        console.error("Error loading lesson:", error);
        toast.error("Failed to load lesson");
      } finally {
        setLoading(false);
      }
    };
    
    loadLesson();
    // Reset quiz score when navigating to a new lesson
    setQuizScore(undefined);
  }, [courseSlug, lessonSlug, navigate]);

  const handleQuizComplete = (score: number) => {
    setQuizScore(score);
  };
  
  const handleLessonComplete = () => {
    if (lesson) {
      markLessonAsCompleted(lesson.id);
    }
  };
  
  const navigateToNextLesson = () => {
    if (nextLesson) {
      navigate(`/courses/${courseSlug}/${nextLesson.slug}`);
    } else {
      // No next lesson, go back to course
      navigate(`/courses/${courseSlug}`);
    }
  };

  return (
    <>
      <Helmet>
        <title>{lesson?.title ? `${lesson.title} | ` : ""}Wrenchmark Courses</title>
      </Helmet>
      
      <div className="container py-8">
        {/* Breadcrumb navigation */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link to={`/courses/${courseSlug}`}>
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to {course?.title || 'Course'}
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {/* Lesson content */}
          <LessonContent lesson={lesson} loading={loading} />
          
          {/* Quiz if available */}
          {!loading && lesson && quiz && !isCompleted && (
            <div className="mt-6">
              <QuizComponent 
                quiz={quiz}
                onComplete={handleQuizComplete}
              />
            </div>
          )}
          
          {/* Navigation buttons */}
          {!loading && lesson && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
              <div className="flex-1 w-full sm:w-auto">
                {prevLesson ? (
                  <Button 
                    variant="outline" 
                    onClick={() => navigate(`/courses/${courseSlug}/${prevLesson.slug}`)}
                    className="w-full sm:w-auto"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous Lesson
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={() => navigate(`/courses/${courseSlug}`)}
                    className="w-full sm:w-auto"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Course
                  </Button>
                )}
              </div>
              
              <div className="flex-1 w-full sm:w-auto">
                <CompleteLessonButton
                  lessonId={lesson.id}
                  isCompleted={isCompleted}
                  onComplete={handleLessonComplete}
                  quizScore={quizScore}
                />
              </div>
              
              <div className="flex-1 w-full sm:w-auto">
                {nextLesson ? (
                  <Button 
                    onClick={() => navigate(`/courses/${courseSlug}/${nextLesson.slug}`)}
                    className="w-full sm:w-auto"
                  >
                    Next Lesson
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    onClick={() => navigate(`/courses/${courseSlug}`)}
                    className="w-full sm:w-auto"
                  >
                    Finish Course
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LessonPage;
