
import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader } from 'lucide-react';
import LessonContent from '@/components/learning/LessonContent';
import LessonSidebar from '@/components/learning/LessonSidebar';
import QuizComponent from '@/components/learning/QuizComponent';
import { getQuizForLesson, isLessonCompleted } from '@/services/lessonService';
import CompleteLessonButton from '@/components/learning/CompleteLessonButton';
import { useAuth } from '@/context/auth';
import LessonGlossaryTerms from '@/components/learning/LessonGlossaryTerms';
import { useLessonStateRules } from '@/hooks/useStateRules';
import StateSelector from '@/components/learning/StateSelector';

const LessonPage: React.FC = () => {
  const { courseSlug, lessonSlug } = useParams<{ courseSlug: string; lessonSlug: string }>();
  const [showQuiz, setShowQuiz] = useState(false);
  const { user } = useAuth();

  // Fetch course information
  const { data: course, isLoading: isLoadingCourse } = useQuery({
    queryKey: ['course', courseSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('slug', courseSlug)
        .eq('published', true)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!courseSlug
  });

  // Fetch lesson details
  const { data: lesson, isLoading: isLoadingLesson } = useQuery({
    queryKey: ['lesson', lessonSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('slug', lessonSlug)
        .eq('published', true)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!lessonSlug
  });

  // Fetch quiz for this lesson if it exists
  const { data: quiz, isLoading: isLoadingQuiz } = useQuery({
    queryKey: ['lessonQuiz', lesson?.id],
    queryFn: () => getQuizForLesson(lesson.id),
    enabled: !!lesson?.id
  });

  // Check if user has completed this lesson
  const { data: isCompleted, isLoading: isCheckingCompletion } = useQuery({
    queryKey: ['lessonCompletion', lesson?.id, user?.id],
    queryFn: () => isLessonCompleted(lesson.id),
    enabled: !!lesson?.id && !!user?.id
  });

  // Get state rules for this lesson if applicable
  const { stateRules } = useLessonStateRules(lesson?.state_code);

  // Wait for everything to load
  if (isLoadingCourse || isLoadingLesson) {
    return (
      <div className="h-[50vh] flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-accent-teal" />
      </div>
    );
  }

  // Handle invalid course or lesson
  if (!course || !lesson) {
    return <Navigate to="/courses" replace />;
  }

  // Check if lesson belongs to the course
  if (lesson.course_id !== course.id) {
    return <Navigate to={`/courses/${courseSlug}`} replace />;
  }

  return (
    <>
      <Helmet>
        <title>{lesson.title} | {course.title} | Wrenchmark</title>
      </Helmet>

      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <h1 className="text-2xl font-bold mb-4">{lesson.title}</h1>

            {/* Only show state selector for permit course and only if the lesson has a state_code */}
            {course.slug === 'motorcycle-permit-essentials' && lesson.state_code && (
              <div className="mb-6">
                <StateSelector
                  selectedState={lesson.state_code}
                  onStateChange={() => {}}
                  label="This lesson applies to"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  This lesson contains state-specific information
                </p>
              </div>
            )}

            {/* Show course glossary terms if available */}
            {lesson.glossary_terms && lesson.glossary_terms.length > 0 && (
              <LessonGlossaryTerms termSlugs={lesson.glossary_terms} />
            )}

            {/* Lesson content */}
            {showQuiz && quiz ? (
              <QuizComponent
                quiz={quiz}
                lessonId={lesson.id}
                onComplete={() => setShowQuiz(false)}
              />
            ) : (
              <>
                <LessonContent 
                  content={lesson.content || ''} 
                  stateRules={stateRules}
                />
                
                {/* Complete lesson button */}
                {user && !isCheckingCompletion && (
                  <div className="mt-8 flex justify-center">
                    {quiz ? (
                      <CompleteLessonButton
                        lessonId={lesson.id}
                        isCompleted={!!isCompleted}
                        hasQuiz={true}
                        onStartQuiz={() => setShowQuiz(true)}
                      />
                    ) : (
                      <CompleteLessonButton
                        lessonId={lesson.id}
                        isCompleted={!!isCompleted}
                        hasQuiz={false}
                      />
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            <LessonSidebar
              courseId={course.id}
              courseSlug={courseSlug || ''}
              currentLessonId={lesson.id}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default LessonPage;
