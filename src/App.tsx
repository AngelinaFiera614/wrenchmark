
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import Motorcycles from "./pages/Motorcycles";
import MotorcycleDetail from "./pages/MotorcycleDetail";
import Brands from "./pages/Brands";
import BrandDetail from "./pages/BrandDetail";
import Compare from "./pages/Compare";
import Glossary from "./pages/Glossary";
import Courses from "./pages/Courses";
import LessonDetail from "./pages/LessonDetail";
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
import NewPartsManagementLayout from "./components/admin/parts/NewPartsManagementLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="motorcycles" element={<Motorcycles />} />
            <Route path="motorcycles/:slug" element={<MotorcycleDetail />} />
            <Route path="brands" element={<Brands />} />
            <Route path="brands/:slug" element={<BrandDetail />} />
            <Route path="compare" element={<Compare />} />
            <Route path="glossary" element={<Glossary />} />
            <Route path="courses" element={<Courses />} />
            <Route path="courses/:courseSlug/lessons/:lessonSlug" element={<LessonDetail />} />
            
            {/* Admin Routes */}
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/brands" element={<AdminBrands />} />
            <Route path="admin/system" element={<AdminSystemSettings />} />
            <Route path="admin/motorcycle-management" element={<AdminMotorcycleManagement />} />
            <Route path="admin/parts/*" element={<NewPartsManagementLayout />} />
            <Route path="admin/glossary" element={<AdminGlossary />} />
            <Route path="admin/courses" element={<AdminCourses />} />
            <Route path="admin/lessons" element={<AdminLessons />} />
            <Route path="admin/riding-skills" element={<AdminRidingSkills />} />
            <Route path="admin/manuals" element={<AdminManuals />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
