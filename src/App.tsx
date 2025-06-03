
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Index from "@/pages/Index";
import Motorcycles from "@/pages/Motorcycles";
import MotorcycleDetail from "@/pages/MotorcycleDetail";
import BrandDetail from "@/pages/BrandDetail";
import BrandsDirectory from "@/pages/BrandsDirectory";
import CompareModels from "@/pages/CompareModels";
import NotFound from "@/pages/NotFound";
import AuthPage from "@/pages/AuthPage";
import ProfilePage from "@/pages/ProfilePage";
import ManualsPage from "@/pages/ManualsPage";
import RidingSkillsPage from "@/pages/RidingSkillsPage";
import RidingSkillDetailPage from "@/pages/RidingSkillDetailPage";
import CoursesPage from "@/pages/CoursesPage";
import CourseDetailsPage from "@/pages/CourseDetailsPage";
import LessonDetailsPage from "@/pages/LessonDetailsPage";
import GlossaryPage from "@/pages/GlossaryPage";
import GlossaryTermPage from "@/pages/GlossaryTermPage";
import AdminLayout from "@/components/layout/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminModels from "@/pages/admin/AdminModels";
import AdminBrands from "@/pages/admin/AdminBrands";
import AdminEngines from "@/pages/admin/AdminEngines";
import AdminBrakeSystems from "@/pages/admin/AdminBrakeSystems";
import AdminFrames from "@/pages/admin/AdminFrames";
import AdminSuspensions from "@/pages/admin/AdminSuspensions";
import AdminWheels from "@/pages/admin/AdminWheels";
import AdminImages from "@/pages/admin/AdminImages";
import AdminManuals from "@/pages/admin/AdminManuals";
import AdminRidingSkills from "@/pages/admin/AdminRidingSkills";
import AdminCourses from "@/pages/admin/AdminCourses";
import AdminGlossary from "@/pages/admin/AdminGlossary";
import AdminPartsAssignmentOptimized from "@/pages/admin/AdminPartsAssignmentOptimized";
import AdminAccessories from "@/pages/admin/AdminAccessories";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminEnhancedMedia from "@/pages/admin/AdminEnhancedMedia";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ModelDetailPage from "@/pages/admin/ModelDetailPage";

function App() {
  return (
    <div className="min-h-screen bg-explorer-dark">
      <TooltipProvider>
        <Routes>
          <Route path="/" element={<Layout><Outlet /></Layout>}>
            <Route index element={<Index />} />
            <Route path="motorcycles" element={<Motorcycles />} />
            <Route path="motorcycles/:slug" element={<MotorcycleDetail />} />
            <Route path="brands" element={<BrandsDirectory />} />
            <Route path="brands/:slug" element={<BrandDetail />} />
            <Route path="manuals" element={<ManualsPage />} />
            <Route path="riding-skills" element={<RidingSkillsPage />} />
            <Route path="riding-skills/:id" element={<RidingSkillDetailPage />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="courses/:courseId" element={<CourseDetailsPage />} />
            <Route path="courses/:courseId/:lessonId" element={<LessonDetailsPage />} />
            <Route path="glossary" element={<GlossaryPage />} />
            <Route path="glossary/:slug" element={<GlossaryTermPage />} />
            <Route path="compare" element={<CompareModels />} />
            <Route path="auth" element={<AuthPage />} />
            <Route path="login" element={<Navigate to="/auth" replace />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          
          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="models" element={<AdminModels />} />
            <Route path="models/:slug" element={<ModelDetailPage />} />
            <Route path="brands" element={<AdminBrands />} />
            <Route path="engines" element={<AdminEngines />} />
            <Route path="brake-systems" element={<AdminBrakeSystems />} />
            <Route path="frames" element={<AdminFrames />} />
            <Route path="suspensions" element={<AdminSuspensions />} />
            <Route path="wheels" element={<AdminWheels />} />
            <Route path="enhanced-media" element={<AdminEnhancedMedia />} />
            <Route path="images" element={<AdminImages />} />
            <Route path="manuals" element={<AdminManuals />} />
            <Route path="riding-skills" element={<AdminRidingSkills />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="glossary" element={<AdminGlossary />} />
            <Route path="parts" element={<AdminPartsAssignmentOptimized />} />
            <Route path="accessories" element={<AdminAccessories />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Routes>
        <Toaster />
      </TooltipProvider>
    </div>
  );
}

export default App;
