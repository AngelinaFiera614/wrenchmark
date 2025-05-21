
import React, { useEffect, useState } from 'react';
import {
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useAuth } from '@/context/auth';
import { Layout } from '@/components/layout';
import AdminLayout from '@/components/layout/AdminLayout';
import {
  HomePage,
  LoginPage,
  RegisterPage,
  ProfilePage,
  CoursesPage,
  CoursePage,
  LessonPage,
  GlossaryPage,
  GlossaryTermPage,
  MotorcyclesPage,
  MotorcyclePage,
  RidingSkillsPage,
  RidingSkillPage,
  ManualsPage,
  ManualPage,
} from '@/pages';
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
} from '@/pages/admin';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

function App() {
  const [isCourseSetup, setIsCourseSetup] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const checkCourseSetup = async () => {
      // Basic check if the course is setup (can be improved)
      setIsCourseSetup(!!user);
    };

    checkCourseSetup();
  }, [user]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<Layout>{/* The Layout component needs children */}</Layout>}>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:courseSlug" element={<CoursePage />} />
        <Route path="/lessons/:courseSlug/:lessonSlug" element={<LessonPage />} />
        <Route path="/glossary" element={<GlossaryPage />} />
        <Route path="/glossary/:termSlug" element={<GlossaryTermPage />} />
        <Route path="/motorcycles" element={<MotorcyclesPage />} />
        <Route path="/motorcycles/:motorcycleSlug" element={<MotorcyclePage />} />
        <Route path="/riding-skills" element={<RidingSkillsPage />} />
        <Route path="/riding-skills/:skillSlug" element={<RidingSkillPage />} />
        <Route path="/manuals" element={<ManualsPage />} />
        <Route path="/manuals/:manualSlug" element={<ManualPage />} />
        
        {/* Auth Protected Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="courses" element={<AdminCourses />} />
        <Route path="lessons/:courseId?" element={<AdminLessons />} />
        <Route path="motorcycles" element={<AdminMotorcycles />} />
        <Route path="brands" element={<AdminBrands />} />
        <Route path="riding-skills" element={<AdminRidingSkills />} />
        <Route path="manuals" element={<AdminManuals />} />
        <Route path="glossary" element={<AdminGlossary />} />
        <Route path="state-rules" element={<AdminStateRules />} />
      </Route>

      {/* Catch-all route for 404 Not Found */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
