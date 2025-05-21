
import React, { useEffect, useState } from 'react';
import {
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { useAuth } from '@/context/auth';
import { AuthProvider } from '@/context/auth/AuthProvider';
import { ProfileProvider } from '@/context/profile/ProfileProvider';
import AdminLayout from '@/components/admin/AdminLayout';
import { Layout } from '@/components/layout';
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
import StateLawsPage from './pages/StateLawsPage';

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
      <Route path="/" element={<Layout><HomePage /></Layout>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/courses" element={<Layout><CoursesPage /></Layout>} />
      <Route path="/courses/:courseSlug" element={<Layout><CoursePage /></Layout>} />
      <Route path="/lessons/:courseSlug/:lessonSlug" element={<Layout><LessonPage /></Layout>} />
      <Route path="/glossary" element={<Layout><GlossaryPage /></Layout>} />
      <Route path="/glossary/:termSlug" element={<Layout><GlossaryTermPage /></Layout>} />
      <Route path="/motorcycles" element={<Layout><MotorcyclesPage /></Layout>} />
      <Route path="/motorcycles/:motorcycleSlug" element={<Layout><MotorcyclePage /></Layout>} />
      <Route path="/riding-skills" element={<Layout><RidingSkillsPage /></Layout>} />
      <Route path="/riding-skills/:skillSlug" element={<Layout><RidingSkillPage /></Layout>} />
      <Route path="/manuals" element={<Layout><ManualsPage /></Layout>} />
      <Route path="/manuals/:manualSlug" element={<Layout><ManualPage /></Layout>} />
      <Route path="/state-laws/:stateCode?" element={<Layout><StateLawsPage /></Layout>} />

      {/* Auth Protected Routes */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <ProfilePage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/courses"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout>
              <AdminCourses />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/lessons/:courseId?"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout>
              <AdminLessons />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/motorcycles"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout>
              <AdminMotorcycles />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/brands"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout>
              <AdminBrands />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/riding-skills"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout>
              <AdminRidingSkills />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/manuals"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout>
              <AdminManuals />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/glossary"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout>
              <AdminGlossary />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/state-rules"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout>
              <AdminStateRules />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch-all route for 404 Not Found */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
