
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
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
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

// Simple Layout component to wrap pages
const Layout = ({ children }) => (
  <>
    <Header />
    <main className="container mx-auto px-4 py-8 min-h-screen">
      {children}
    </main>
    <Footer />
  </>
);

function App() {
  return (
    <AuthProvider>
      <ComparisonProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/auth" element={<div>Auth Page</div>} />
            <Route element={<Layout />}>
              <Route index element={<div>Home Page</div>} />
              <Route path="about" element={<div>About Page</div>} />
              <Route path="contact" element={<div>Contact Page</div>} />
              <Route path="motorcycles" element={<div>Motorcycles Page</div>} />
              <Route
                path="motorcycles/:motorcycleId"
                element={<div>Motorcycle Detail Page</div>}
              />
              <Route path="brands" element={<div>Brands Page</div>} />
              <Route path="brands/:brandId" element={<div>Brand Detail Page</div>} />
              <Route path="compare" element={<div>Compare Page</div>} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Protected Routes - Requires Authentication */}
            <Route path="profile" element={<ProtectedRoute />}>
              <Route path="/profile" element={<div>Profile Page</div>} />
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
