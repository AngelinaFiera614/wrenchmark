
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from "@/components/theme/theme-provider";
import { MeasurementProvider } from "@/context/MeasurementContext";
import { ComparisonProvider } from "@/context/ComparisonContext";
import { AuthProvider } from "@/context/auth/AuthProvider";
import { ProfileProvider } from "@/context/profile/ProfileProvider";
import Layout from "@/components/layout/Layout";
import Index from "@/pages/Index";
import Motorcycles from "@/pages/Motorcycles";
import MotorcycleDetail from "@/pages/MotorcycleDetail";
import BrandDetail from "@/pages/BrandDetail";
import CompareModels from "@/pages/CompareModels";
import NotFound from "@/pages/NotFound";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminModels from "@/pages/admin/AdminModels";
import AdminBrands from "@/pages/admin/AdminBrands";
import AdminImages from "@/pages/admin/AdminImages";
import AdminManuals from "@/pages/admin/AdminManuals";
import AdminRidingSkills from "@/pages/admin/AdminRidingSkills";
import AdminCourses from "@/pages/admin/AdminCourses";
import AdminGlossary from "@/pages/admin/AdminGlossary";
import AdminComponents from "@/pages/admin/AdminComponents";
import AdminParts from "@/pages/admin/AdminParts";
import AdminAccessories from "@/pages/admin/AdminAccessories";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminEnhancedMedia from "@/pages/admin/AdminEnhancedMedia";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthProvider>
          <ProfileProvider>
            <MeasurementProvider>
              <ComparisonProvider>
                <TooltipProvider>
                  <Toaster />
                  <BrowserRouter>
                    <Routes>
                      <Route path="/" element={<Layout><Outlet /></Layout>}>
                        <Route index element={<Index />} />
                        <Route path="motorcycles" element={<Motorcycles />} />
                        <Route path="motorcycles/:slug" element={<MotorcycleDetail />} />
                        <Route path="brands/:slug" element={<BrandDetail />} />
                        <Route path="compare" element={<CompareModels />} />
                        <Route path="*" element={<NotFound />} />
                      </Route>
                      
                      {/* Admin Routes */}
                      <Route path="/admin/*" element={<AdminLayout />}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="models" element={<AdminModels />} />
                        <Route path="brands" element={<AdminBrands />} />
                        <Route path="enhanced-media" element={<AdminEnhancedMedia />} />
                        <Route path="images" element={<AdminImages />} />
                        <Route path="manuals" element={<AdminManuals />} />
                        <Route path="riding-skills" element={<AdminRidingSkills />} />
                        <Route path="courses" element={<AdminCourses />} />
                        <Route path="glossary" element={<AdminGlossary />} />
                        <Route path="components" element={<AdminComponents />} />
                        <Route path="parts" element={<AdminParts />} />
                        <Route path="accessories" element={<AdminAccessories />} />
                        <Route path="users" element={<AdminUsers />} />
                      </Route>
                    </Routes>
                  </BrowserRouter>
                </TooltipProvider>
              </ComparisonProvider>
            </MeasurementProvider>
          </ProfileProvider>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
