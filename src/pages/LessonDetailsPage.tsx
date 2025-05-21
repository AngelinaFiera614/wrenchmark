
import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import LessonPage from './LessonPage';

const LessonDetailsPage: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  
  if (!courseId || !lessonId) {
    return <Navigate to="/courses" replace />;
  }
  
  return <LessonPage />;
};

export default LessonDetailsPage;
