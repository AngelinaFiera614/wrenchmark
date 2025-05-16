
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
              <Route path="/compare" element={<ComparisonPage />} />
              <Route path="/brands" element={<BrandsDirectory />} />
              <Route path="/brands/:brandId" element={<BrandDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </ComparisonProvider>
  </QueryClientProvider>
);

export default App;
