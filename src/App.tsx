
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Toaster } from "@/components/ui/toaster";

// Import pages
import IndexPage from './pages/Index';
import About from './pages/About';
import Motorcycles from './pages/Motorcycles';
import MotorcycleDetail from './pages/MotorcycleDetail';
import BrandsDirectory from './pages/BrandsDirectory';
import BrandDetail from './pages/BrandDetail';
import GlossaryPage from './pages/GlossaryPage';
import GlossaryTermPage from './pages/GlossaryTermPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import LessonPage from './pages/LessonPage';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Auth from './pages/Auth';
import ProfilePage from './pages/ProfilePage';
import RidingSkillsPage from './pages/RidingSkillsPage';
import RidingSkillDetailPage from './pages/RidingSkillDetailPage';
import ComparisonPage from './pages/ComparisonPage';
import ModelComparisonPage from './pages/ModelComparisonPage';

// Import admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMotorcycles from './pages/admin/AdminMotorcycles';
import AdminBrands from './pages/admin/AdminBrands';
import AdminCourses from './pages/admin/AdminCourses';
import AdminLessons from './pages/admin/AdminLessons';
import AdminManuals from './pages/admin/AdminManuals';
import AdminGlossary from './pages/admin/AdminGlossary';
import AdminUsers from './pages/admin/AdminUsers';
import AdminRidingSkills from './pages/admin/AdminRidingSkills';
import AdminRepairSkills from './pages/admin/AdminRepairSkills';
import AdminComponents from './pages/admin/AdminComponents';
import AdminAccessories from './pages/admin/AdminAccessories';

// Import components
import { Layout } from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Import context providers
import { ComparisonProvider } from './context/ComparisonContext';
import AdminLayout from './components/admin/AdminLayout';

function App() {
  return (
    <>
      <Helmet>
        <title>Wrenchmark - Motorcycle Reference</title>
        <meta name="description" content="Motorcycle reference app for riders and mechanics" />
      </Helmet>
      
      <ComparisonProvider>
        <div className="flex flex-col min-h-screen dark:bg-background text-foreground">
          <Routes>
            <Route path="/" element={<Layout children={null} />}>
              <Route index element={<IndexPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/motorcycles" element={<Motorcycles />} />
              <Route path="/motorcycles/:slug" element={<MotorcycleDetail />} />
              <Route path="/compare" element={<ComparisonPage />} />
              <Route path="/riding-skills" element={<RidingSkillsPage />} />
              <Route path="/riding-skills/:slug" element={<RidingSkillDetailPage />} />
              <Route path="/brands" element={<BrandsDirectory />} />
              <Route path="/brands/:slug" element={<BrandDetail />} />
              <Route path="/glossary" element={<GlossaryPage />} />
              <Route path="/glossary/:slug" element={<GlossaryTermPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/:slug" element={<CourseDetailPage />} />
              <Route path="/courses/:courseSlug/lessons/:lessonSlug" element={<LessonPage />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              
              {/* Model comparison page */}
              <Route path="/model-comparison" element={<ModelComparisonPage />} />
            </Route>
            
            {/* Admin routes */}
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="motorcycles" element={<AdminMotorcycles />} />
              <Route path="brands" element={<AdminBrands />} />
              <Route path="courses" element={<AdminCourses />} />
              <Route path="lessons" element={<AdminLessons />} />
              <Route path="components" element={<AdminComponents />} />
              <Route path="accessories" element={<AdminAccessories />} />
              <Route path="manuals" element={<AdminManuals />} />
              <Route path="glossary" element={<AdminGlossary />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="riding-skills" element={<AdminRidingSkills />} />
              <Route path="repair-skills" element={<AdminRepairSkills />} />
            </Route>
          </Routes>
          
          <Toaster />
        </div>
      </ComparisonProvider>
    </>
  );
}

export default App;
