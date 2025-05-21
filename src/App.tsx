
import React, { useState, useEffect } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import { Layout } from '@/components/layout';
import AdminLayout from '@/components/admin/AdminLayout';
import Index from './pages/Index';
import Auth from './pages/Auth';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import Courses from './pages/CoursesPage';
import CourseDetails from './pages/CourseDetailsPage';
import LessonDetails from './pages/LessonDetailsPage';
import NotFound from './pages/NotFoundPage';
import Motorcycles from './pages/Motorcycles';
import ManualsPage from './pages/ManualsPage';
import GlossaryPage from './pages/GlossaryPage';

function App() {
  const { isLoading } = useAuth();
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
      <Route path="/admin/*" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        {/* Example nested admin routes */}
        {/* <Route path="users" element={<AdminUsers />} /> */}
        {/* <Route path="settings" element={<AdminSettings />} /> */}
      </Route>

      {/* Auth routes - without main layout */}
      <Route path="/auth" element={<Auth />} />

      {/* Main app routes */}
      <Route path="/" element={<Layout children={<Outlet />} />}>
        <Route index element={<Index />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/motorcycles" element={<Motorcycles />} />
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
