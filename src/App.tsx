
import React, { useEffect } from 'react';
import {
  Route,
  Routes,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { useAuth } from './context/auth';
import About from './pages/About';
import Contact from './pages/Contact';
import Motorcycles from './pages/Motorcycles';
import MotorcycleDetail from './pages/MotorcycleDetail';
import CompareModels from './pages/CompareModels';
import NotFound from './pages/NotFound';
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPartsAssignment from './pages/admin/AdminPartsAssignment';
import AdminModels from './pages/admin/AdminModels';
import AdminRepairSkills from './pages/admin/AdminRepairSkills';
import AdminManuals from './pages/admin/AdminManuals';
import AdminColors from './pages/admin/AdminColors';
import AdminBrands from './pages/admin/AdminBrands';
import AdminCourses from './pages/admin/AdminCourses';
import AdminLessons from './pages/admin/AdminLessons';
import AdminRidingSkills from './pages/admin/AdminRidingSkills';
import AdminUsers from './pages/admin/AdminUsers';
import { Toaster } from 'sonner';
import { ThemeProvider } from './components/theme/theme-provider';
import { cn } from './lib/utils';
import AdminPartsAssignmentEnhanced from './pages/admin/AdminPartsAssignmentEnhanced';
import AdminPartsAssignmentPhase3 from './pages/admin/AdminPartsAssignmentPhase3';
import AdminPartsConsolidated from './pages/admin/AdminPartsConsolidated';

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-react-theme">
      <ScrollToTop />
      <Routes>
        {/* Public Routes - Accessible to everyone */}
        <Route path="/" element={<div className="min-h-screen bg-explorer-dark text-explorer-text flex items-center justify-center"><h1 className="text-4xl font-bold">Welcome to Wrenchmark</h1></div>} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/motorcycles" element={<Motorcycles />} />
        <Route path="/motorcycles/:slug" element={<MotorcycleDetail />} />
        <Route path="/compare" element={<CompareModels />} />

        {/* Admin Routes - Protected */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="parts" element={<AdminPartsConsolidated />} />
          <Route path="parts-legacy" element={<AdminPartsAssignment />} />
          <Route path="parts-enhanced" element={<AdminPartsAssignmentEnhanced />} />
          <Route path="parts-phase3" element={<AdminPartsAssignmentPhase3 />} />
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
