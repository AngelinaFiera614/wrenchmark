
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
import NotFound from './pages/NotFound';
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

        {/* Admin Routes - Protected */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
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

export default App;
