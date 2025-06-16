import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { useAuth } from './context/auth';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Motorcycles from './pages/Motorcycles';
import MotorcycleDetail from './pages/MotorcycleDetail';
import CompareModels from './pages/CompareModels';
import Maintenance from './pages/Maintenance';
import NotFound from './pages/NotFound';
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMotorcycles from './pages/admin/AdminMotorcycles';
import AdminMotorcycleForm from './pages/admin/AdminMotorcycleForm';
import AdminPartsAssignment from './pages/admin/AdminPartsAssignment';
import AdminModels from './pages/admin/AdminModels';
import AdminModelDetail from './pages/admin/AdminModelDetail';
import AdminRepairSkills from './pages/admin/AdminRepairSkills';
import AdminManuals from './pages/admin/AdminManuals';
import AdminTags from './pages/admin/AdminTags';
import AdminColors from './pages/admin/AdminColors';
import AdminBrands from './pages/admin/AdminBrands';
import AdminBrandDetail from './pages/admin/AdminBrandDetail';
import AdminBrandForm from './pages/admin/AdminBrandForm';
import AdminCourses from './pages/admin/AdminCourses';
import AdminCourseForm from './pages/admin/AdminCourseForm';
import AdminLessons from './pages/admin/AdminLessons';
import AdminLessonForm from './pages/admin/AdminLessonForm';
import AdminRidingSkills from './pages/admin/AdminRidingSkills';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSystemSettings from './pages/admin/AdminSystemSettings';
import PublicLayout from './components/layout/PublicLayout';
import { Toaster } from 'sonner';
import { ThemeProvider } from './components/ui/theme-provider';
import { cn } from './lib/utils';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import AdminPartsAssignmentEnhanced from './pages/admin/AdminPartsAssignmentEnhanced';
import AdminPartsAssignmentPhase3 from './pages/admin/AdminPartsAssignmentPhase3';
import OptimizedAdminPartsLayout from './components/admin/parts/enhanced/OptimizedAdminPartsLayout';
import AdminPartsConsolidated from './pages/admin/AdminPartsConsolidated';

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-react-theme">
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Routes - Accessible to everyone */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/motorcycles" element={<Motorcycles />} />
            <Route path="/motorcycles/:slug" element={<MotorcycleDetail />} />
            <Route path="/compare" element={<CompareModels />} />
            <Route path="/maintenance" element={<Maintenance />} />
          </Route>

          {/* Authentication Routes - No layout, full page */}
          <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
          <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
          <Route path="/forgot-password" element={<AuthRoute><ForgotPassword /></AuthRoute>} />
          <Route path="/reset-password/:token" element={<AuthRoute><ResetPassword /></AuthRoute>} />

          {/* Admin Routes - Protected */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="motorcycles" element={<AdminMotorcycles />} />
            <Route path="motorcycles/add" element={<AdminMotorcycleForm />} />
            <Route path="motorcycles/:id/edit" element={<AdminMotorcycleForm />} />
            <Route path="parts" element={<AdminPartsConsolidated />} />
            <Route path="parts-legacy" element={<AdminPartsAssignment />} />
            <Route path="parts-enhanced" element={<AdminPartsAssignmentEnhanced />} />
            <Route path="parts-phase3" element={<AdminPartsAssignmentPhase3 />} />
            <Route path="component-library" element={<OptimizedAdminPartsLayout />} />
            <Route path="models" element={<AdminModels />} />
            <Route path="models/:id" element={<AdminModelDetail />} />
            <Route path="repair-skills" element={<AdminRepairSkills />} />
            <Route path="manuals" element={<AdminManuals />} />
            <Route path="tags" element={<AdminTags />} />
            <Route path="colors" element={<AdminColors />} />
            <Route path="brands" element={<AdminBrands />} />
            <Route path="brands/:id" element={<AdminBrandDetail />} />
            <Route path="brands/add" element={<AdminBrandForm />} />
            <Route path="brands/:id/edit" element={<AdminBrandForm />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="courses/add" element={<AdminCourseForm />} />
            <Route path="courses/:id/edit" element={<AdminCourseForm />} />
            <Route path="lessons" element={<AdminLessons />} />
            <Route path="lessons/add" element={<AdminLessonForm />} />
            <Route path="lessons/:id/edit" element={<AdminLessonForm />} />
            <Route path="riding-skills" element={<AdminRidingSkills />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="system" element={<AdminSystemSettings />} />
          </Route>

          {/* Catch-all route for 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster richColors closeButton />
        <Analytics />
        <SpeedInsights />
      </Router>
    </ThemeProvider>
  );
};

// Authentication Route Wrapper
const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  return user ? (
    <Navigate to="/" state={{ from: location }} replace />
  ) : (
    <div className={cn("flex-1")}>
      {children}
    </div>
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
