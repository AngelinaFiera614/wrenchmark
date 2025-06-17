
import React, { useEffect } from 'react';
import {
  Route,
  Routes,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { useAuth } from './context/auth';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Motorcycles from './pages/Motorcycles';
import MotorcycleDetail from './pages/MotorcycleDetail';
import CompareModels from './pages/CompareModels';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import BrandsPage from './pages/BrandsPage';
import ManualsPage from './pages/ManualsPage';
import RidingSkillsPage from './pages/RidingSkillsPage';
import CoursesPage from './pages/CoursesPage';
import GlossaryPage from './pages/GlossaryPage';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminModels from './pages/admin/AdminModels';
import AdminRepairSkills from './pages/admin/AdminRepairSkills';
import AdminManuals from './pages/admin/AdminManuals';
import AdminColors from './pages/admin/AdminColors';
import AdminBrands from './pages/admin/AdminBrands';
import AdminCourses from './pages/admin/AdminCourses';
import AdminLessons from './pages/admin/AdminLessons';
import AdminRidingSkills from './pages/admin/AdminRidingSkills';
import AdminUsers from './pages/admin/AdminUsers';
import AdminMotorcycles from './pages/admin/AdminMotorcycles';
import AdminParts from './pages/admin/AdminParts';
import AdminTestingSuite from './pages/admin/AdminTestingSuite';
import { Toaster } from 'sonner';
import { ThemeProvider } from './components/theme/theme-provider';

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-react-theme">
      <ScrollToTop />
      <Routes>
        {/* Public Routes - Accessible to everyone */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/motorcycles" element={<Motorcycles />} />
        <Route path="/motorcycles/:slug" element={<MotorcycleDetail />} />
        <Route path="/compare" element={<CompareModels />} />
        <Route path="/brands" element={<BrandsPage />} />
        <Route path="/manuals" element={<ManualsPage />} />
        <Route path="/riding-skills" element={<RidingSkillsPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/glossary" element={<GlossaryPage />} />

        {/* Authentication Routes */}
        <Route path="/login" element={<AuthPage />} />
        <Route path="/auth" element={<Navigate to="/login" replace />} />

        {/* Protected User Routes */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />

        {/* Admin Routes - Protected */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="motorcycles" element={<AdminMotorcycles />} />
          <Route path="parts" element={<AdminParts />} />
          <Route path="models" element={<AdminModels />} />
          <Route path="repair-skills" element={<AdminRepairSkills />} />
          <Route path="manuals" element={<AdminManuals />} />
          <Route path="colors" element={<AdminColors />} />
          <Route path="brands" element={<AdminBrands />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="lessons" element={<AdminLessons />} />
          <Route path="riding-skills" element={<AdminRidingSkills />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="testing" element={<AdminTestingSuite />} />
          <Route path="system" element={<AdminSystemSettings />} />
        </Route>

        {/* Catch-all route for 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster richColors closeButton />
    </ThemeProvider>
  );
};

// Scroll To Top Component
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Create a simple system settings component for now
const AdminSystemSettings = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-explorer-text mb-4">System Settings</h1>
      <p className="text-explorer-text-muted">System configuration and settings will be available here.</p>
    </div>
  );
};

export default App;
