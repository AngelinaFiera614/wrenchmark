import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import { ComparisonProvider } from "@/context/ComparisonContext";
import { Layout } from "@/components/layout/Layout";
import AuthPage from "@/pages/AuthPage";
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import MotorcyclesPage from "@/pages/MotorcyclesPage";
import MotorcycleDetailPage from "@/pages/MotorcycleDetailPage";
import BrandsPage from "@/pages/BrandsPage";
import BrandDetailPage from "@/pages/BrandDetailPage";
import ComparePage from "@/pages/ComparePage";
import ProfilePage from "@/pages/ProfilePage";
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

function App() {
  return (
    <AuthProvider>
      <ComparisonProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="motorcycles" element={<MotorcyclesPage />} />
              <Route
                path="motorcycles/:motorcycleId"
                element={<MotorcycleDetailPage />}
              />
              <Route path="brands" element={<BrandsPage />} />
              <Route path="brands/:brandId" element={<BrandDetailPage />} />
              <Route path="compare" element={<ComparePage />} />
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
