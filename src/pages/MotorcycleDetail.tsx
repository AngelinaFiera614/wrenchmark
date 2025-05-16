
import { useParams, Link, useNavigate } from "react-router-dom";
import { motorcyclesData } from "@/data/motorcycles";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MotorcycleDetailComponent from "@/components/motorcycles/MotorcycleDetail";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

export default function MotorcycleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const motorcycle = motorcyclesData.find(m => m.id === id);
  
  useEffect(() => {
    console.log("MotorcycleDetail page rendered with:", {
      currentRoute: window.location.pathname,
      id,
      motorcycleFound: !!motorcycle,
      allIds: motorcyclesData.map(m => m.id)
    });
    
    if (!motorcycle && id) {
      console.error(`Motorcycle with ID ${id} not found`);
      toast.error(`Motorcycle with ID ${id} not found`);
    }
  }, [motorcycle, id]);

  if (!motorcycle) {
    return (
      <div className="min-h-screen flex flex-col dark text-foreground bg-background">
        <Header />
        <main className="flex-1 container py-8 px-4 md:px-6">
          <div className="flex flex-col items-center justify-center py-12">
            <h1 className="text-2xl font-bold mb-4 text-foreground">Motorcycle Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The motorcycle you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/motorcycles">
              <Button variant="default">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Motorcycles
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col dark bg-background text-foreground">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-6 pt-4 pb-12">
          <div className="mb-4">
            <Link to="/motorcycles">
              <Button variant="ghost" className="pl-0 text-foreground hover:text-accent-teal hover:bg-background/5">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Motorcycles
              </Button>
            </Link>
          </div>
          
          <MotorcycleDetailComponent motorcycle={motorcycle} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
