
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Motorcycles from "./pages/Motorcycles";
import MotorcycleDetail from "./pages/MotorcycleDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import { ComparisonProvider } from "./context/ComparisonContext";
import ComparisonPage from "./pages/ComparisonPage";
import BrandsDirectory from "./pages/BrandsDirectory";
import BrandDetail from "./pages/BrandDetail";
import { AuthProvider } from "./context/AuthContext";
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMotorcycles from "./pages/admin/AdminMotorcycles";
import AdminBrands from "./pages/admin/AdminBrands";
import AdminRepairSkills from "./pages/admin/AdminRepairSkills";
import AdminManuals from "./pages/admin/AdminManuals";
import ProfilePage from "./pages/ProfilePage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 300000, // 5 minutes
    },
  },
});

// Create a wrapper component for the redirect that can use the useLocation hook
const MotorcycleRedirect = () => {
  const location = useLocation();
  const id = location.pathname.split('/').pop();
  return <Navigate to={`/motorcycle/${id}`} replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ComparisonProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="dark min-h-screen bg-background">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/motorcycles" element={<Motorcycles />} />
                <Route path="/motorcycle/:id" element={<MotorcycleDetail />} />
                {/* Fixed redirect using a wrapper component */}
                <Route path="/motorcycles/:id" element={<MotorcycleRedirect />} />
                <Route path="/compare" element={<ComparisonPage />} />
                <Route path="/brands" element={<BrandsDirectory />} />
                <Route path="/brands/:brandId" element={<BrandDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/auth" element={<Auth />} />
                
                {/* Protected user profile route */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/profile" element={<ProfilePage />} />
                </Route>
                
                {/* Admin Routes - Protected and require admin */}
                <Route element={<ProtectedRoute requireAdmin={true} />}>
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="motorcycles" element={<AdminMotorcycles />} />
                    <Route path="brands" element={<AdminBrands />} />
                    <Route path="repair-skills" element={<AdminRepairSkills />} />
                    <Route path="manuals" element={<AdminManuals />} />
                  </Route>
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </ComparisonProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
