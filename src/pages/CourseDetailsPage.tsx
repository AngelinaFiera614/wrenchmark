
import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const CourseDetailsPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  
  const { data: course, isLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('slug', courseId)
        .eq('published', true)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!courseId
  });
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!course) {
    return <Navigate to="/courses" replace />;
  }

  return (
    <>
      <Helmet>
        <title>{course.title} | Wrenchmark</title>
      </Helmet>
      
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
        {course.description && (
          <p className="mb-8 text-muted-foreground">{course.description}</p>
        )}
        
        {/* Course content will go here */}
      </div>
    </>
  );
};

export default CourseDetailsPage;
