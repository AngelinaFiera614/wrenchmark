import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "@/context/auth/AuthProvider";
import Layout from "./components/layout/Layout";
import AdminLayout from "./components/admin/AdminLayout";
import AdminAuthGuard from "./components/admin/shared/AdminAuthGuard";
import Index from "./pages/Index";
import Motorcycles from "./pages/Motorcycles";
import MotorcycleDetail from "./pages/MotorcycleDetail";
import BrandsPage from "./pages/BrandsPage";
import BrandDetail from "./pages/BrandDetail";
import ComparisonPage from "./pages/ComparisonPage";
import GlossaryPage from "./pages/GlossaryPage";
import CoursesPage from "./pages/CoursesPage";
import LessonDetailsPage from "./pages/LessonDetailsPage";
import Auth from "./pages/Auth";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import DashboardPage from "./pages/DashboardPage";
import AdminAuth from "./pages/AdminAuth";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBrands from "./pages/admin/AdminBrands";
import AdminSystemSettings from "./pages/admin/AdminSystemSettings";
import AdminMotorcycleManagement from "./pages/admin/AdminMotorcycleManagement";
import AdminPartsHub from "./pages/admin/AdminPartsHub";
import AdminGlossary from "./pages/admin/AdminGlossary";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminLessons from "./pages/admin/AdminLessons";
import AdminRidingSkills from "./pages/admin/AdminRidingSkills";
import AdminManuals from "./pages/admin/AdminManuals";
import AdminRepairSkills from "./pages/admin/AdminRepairSkills";
import AdminTestingSuite from "./pages/admin/AdminTestingSuite";
import AdminUsers from "./pages/admin/AdminUsers";
import NewPartsManagementLayout from "./components/admin/parts/NewPartsManagementLayout";
import ColorOptionsManager from "./components/admin/colors/ColorOptionsManager";
import AdminSecurity from "./pages/admin/AdminSecurity";
import AdminErrorBoundary from "./components/admin/shared/AdminErrorBoundary";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout><Outlet /></Layout>}>
            <Route index element={<Index />} />
            <Route path="motorcycles" element={<Motorcycles />} />
            <Route path="motorcycles/:slug" element={<MotorcycleDetail />} />
            <Route path="brands" element={<BrandsPage />} />
            <Route path="brands/:slug" element={<BrandDetail />} />
            <Route path="compare" element={<ComparisonPage />} />
            <Route path="glossary" element={<GlossaryPage />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="courses/:courseSlug/lessons/:lessonSlug" element={<LessonDetailsPage />} />
          </Route>
          
          {/* Authentication Routes */}
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          
          {/* Admin Authentication Route */}
          <Route path="/admin/auth" element={<AdminAuth />} />
          
          {/* Protected Admin Routes */}
          <Route path="/admin" element={
            <AdminAuthGuard>
              <AdminErrorBoundary>
                <AdminLayout />
              </AdminErrorBoundary>
            </AdminAuthGuard>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="brands" element={<AdminBrands />} />
            <Route path="system" element={<AdminSystemSettings />} />
            <Route path="motorcycle-management" element={
              <AdminErrorBoundary>
                <AdminMotorcycleManagement />
              </AdminErrorBoundary>
            } />
            <Route path="parts-hub" element={<AdminPartsHub />} />
            <Route path="parts/*" element={<NewPartsManagementLayout />} />
            <Route path="glossary" element={<AdminGlossary />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="lessons" element={<AdminLessons />} />
            <Route path="riding-skills" element={<AdminRidingSkills />} />
            <Route path="repair-skills" element={<AdminRepairSkills />} />
            <Route path="manuals" element={<AdminManuals />} />
            <Route path="testing" element={<AdminTestingSuite />} />
            <Route path="colors" element={<ColorOptionsManager />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="security" element={<AdminSecurity />} />
          </Route>
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
