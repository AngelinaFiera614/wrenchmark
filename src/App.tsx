
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Outlet
} from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import { ComparisonProvider } from "@/context/ComparisonContext";
import { Layout } from "@/components/layout/Layout";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminMotorcycles from "@/pages/admin/AdminMotorcycles";
import AdminBrands from "@/pages/admin/AdminBrands";
import AdminRepairSkills from "@/pages/admin/AdminRepairSkills";
import AdminManuals from "@/pages/admin/AdminManuals";
import AdminParts from "@/pages/admin/AdminParts";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminRidingSkills from "@/pages/admin/AdminRidingSkills";
import AdminGlossary from "@/pages/admin/AdminGlossary";

// Import actual page components
import Index from "@/pages/Index";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Motorcycles from "@/pages/Motorcycles";
import MotorcycleDetail from "@/pages/MotorcycleDetail";
import BrandsDirectory from "@/pages/BrandsDirectory";
import BrandDetail from "@/pages/BrandDetail";
import ComparisonPage from "@/pages/ComparisonPage";
import ProfilePage from "@/pages/ProfilePage";
import RidingSkillDetailPage from "@/pages/RidingSkillDetailPage";
import RidingSkillsPage from "@/pages/RidingSkillsPage";
import Auth from "@/pages/Auth";
import GlossaryPage from "@/pages/GlossaryPage";
import GlossaryTermPage from "@/pages/GlossaryTermPage";

function App() {
  return (
    <AuthProvider>
      <ComparisonProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/auth" element={<Auth />} />
            
            {/* Routes wrapped with Layout */}
            <Route element={<Layout><Outlet /></Layout>}>
              <Route index element={<Index />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="motorcycles" element={<Motorcycles />} />
              <Route
                path="motorcycles/:motorcycleId"
                element={<MotorcycleDetail />}
              />
              <Route path="brands" element={<BrandsDirectory />} />
              <Route path="brands/:brandId" element={<BrandDetail />} />
              <Route path="compare" element={<ComparisonPage />} />
              <Route path="riding-skills" element={<RidingSkillsPage />} />
              <Route path="riding-skills/:id" element={<RidingSkillDetailPage />} />
              <Route path="glossary" element={<GlossaryPage />} />
              <Route path="glossary/:slug" element={<GlossaryTermPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Protected Routes - Requires Authentication */}
            <Route path="profile" element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* Admin Routes - Protected with isAdmin = true */}
            <Route path="admin" element={<ProtectedRoute requireAdmin />}>
              <Route element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="motorcycles" element={<AdminMotorcycles />} />
                <Route path="brands" element={<AdminBrands />} />
                <Route path="repair-skills" element={<AdminRepairSkills />} />
                <Route path="riding-skills" element={<AdminRidingSkills />} />
                <Route path="glossary" element={<AdminGlossary />} />
                <Route path="manuals" element={<AdminManuals />} />
                <Route path="parts" element={<AdminParts />} />
                <Route path="users" element={<AdminUsers />} />
              </Route>
            </Route>
          </Routes>
        </Router>
        <Toaster />
      </ComparisonProvider>
    </AuthProvider>
  );
}

// Helper component to scroll to top on route change
function ScrollToTop() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

export default App;
