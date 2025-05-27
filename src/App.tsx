import React, { useState, useEffect } from 'react';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import { Layout } from '@/components/layout';
import AdminLayout from '@/components/admin/AdminLayout';
import Index from './pages/Index';
import Auth from './pages/Auth';
import ProfilePage from './pages/ProfilePage';
import Courses from './pages/CoursesPage';
import CourseDetails from './pages/CourseDetailsPage';
import LessonDetails from './pages/LessonDetailsPage';
import NotFound from './pages/NotFoundPage';
import Motorcycles from './pages/Motorcycles';
import MotorcycleDetail from './pages/MotorcycleDetail';
import ModelComparisonPage from './pages/ModelComparisonPage';
import ComparisonPage from './pages/ComparisonPage';
import ManualsPage from './pages/ManualsPage';
import GlossaryPage from './pages/GlossaryPage';
import AdminImages from './pages/admin/AdminImages';

// Import all admin page components
import {
  AdminDashboard,
  AdminCourses,
  AdminLessons,
  AdminMotorcycles,
  AdminBrands,
  AdminRidingSkills,
  AdminManuals,
  AdminGlossary,
  AdminStateRules,
  AdminMotorcycleModels
} from './pages/admin';

function App() {
  const { isLoading, isAdmin } = useAuth();
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      setIsAppLoading(false);
    }
  }, [isLoading]);

  if (isAppLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  }

  return (
    <Routes>
      {/* Admin routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="brands" element={<AdminBrands />} />
        <Route path="motorcycle-models" element={<AdminMotorcycleModels />} />
        <Route path="motorcycles" element={<AdminMotorcycles />} />
        <Route path="manuals" element={<AdminManuals />} />
        <Route path="glossary" element={<AdminGlossary />} />
        <Route path="riding-skills" element={<AdminRidingSkills />} />
        <Route path="courses" element={<AdminCourses />} />
        <Route path="images" element={<AdminImages />} />
      </Route>

      {/* Auth routes - without main layout */}
      <Route path="/auth" element={<Auth />} />

      {/* Main app routes */}
      <Route path="/" element={<Layout children={<Outlet />} />}>
        <Route index element={<Index />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/motorcycles" element={<Motorcycles />} />
        <Route path="/motorcycles/:slug" element={<MotorcycleDetail />} />
        <Route path="/compare" element={<ComparisonPage />} />
        <Route path="/model-comparison" element={<ModelComparisonPage />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:courseId" element={<CourseDetails />} />
        <Route path="/courses/:courseId/lessons/:lessonId" element={<LessonDetails />} />
        <Route path="/manuals" element={<ManualsPage />} />
        <Route path="/glossary" element={<GlossaryPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
