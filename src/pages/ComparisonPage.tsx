
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useComparison } from "@/context/ComparisonContext";
import { motorcyclesData } from "@/data/motorcycles";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X } from "lucide-react";
import ComparisonGrid from "@/components/comparison/ComparisonGrid";

export default function ComparisonPage() {
  const { motorcyclesToCompare, addToComparison, clearComparison } = useComparison();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Handle URL parameters for pre-filled comparison
  useEffect(() => {
    // Only try to load from URL if there are no motorcycles in comparison yet
    if (motorcyclesToCompare.length === 0) {
      const bikeIds = searchParams.get("bikes")?.split(",") || [];
      
      if (bikeIds.length) {
        bikeIds.forEach(id => {
          const motorcycle = motorcyclesData.find(m => m.id === id);
          if (motorcycle) {
            addToComparison(motorcycle);
          }
        });
      }
    }
  }, [searchParams, addToComparison, motorcyclesToCompare.length]);
  
  // Redirect to motorcycles page if nothing to compare
  useEffect(() => {
    if (motorcyclesToCompare.length === 0) {
      navigate("/motorcycles");
    }
  }, [motorcyclesToCompare.length, navigate]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex flex-col dark">
      <Header />
      
      <main className="flex-1 bg-background">
        <div className="container px-4 md:px-6 py-8">
          {/* Header with controls */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleBack} className="text-foreground">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Comparison</h1>
                <p className="text-muted-foreground">
                  Comparing {motorcyclesToCompare.length} {motorcyclesToCompare.length === 1 ? 'motorcycle' : 'motorcycles'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                className="text-red-500 border-red-500/30 hover:bg-red-500/10"
                onClick={clearComparison}
              >
                <X className="h-4 w-4 mr-1" />
                Clear Comparison
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate("/motorcycles")}
                className="border-accent-teal/30 hover:bg-accent-teal/10 text-accent-teal"
              >
                Add More Motorcycles
              </Button>
            </div>
          </div>
          
          {/* Comparison grid */}
          <ComparisonGrid motorcycles={motorcyclesToCompare} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
