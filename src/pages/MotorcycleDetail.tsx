
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MotorcycleDetailComponent from "@/components/motorcycles/MotorcycleDetail";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { getMotorcycleById } from "@/services/motorcycleService";
import { Motorcycle } from "@/types";

export default function MotorcycleDetail() {
  const { id } = useParams<{ id: string }>();
  const [motorcycle, setMotorcycle] = useState<Motorcycle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchMotorcycle = async () => {
      if (!id) {
        setError("No motorcycle ID provided");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await getMotorcycleById(id);
        
        if (data) {
          setMotorcycle(data);
          document.title = `${data.make} ${data.model} | Wrenchmark`;
        } else {
          setError(`Motorcycle with ID ${id} not found`);
          toast.error(`Motorcycle with ID ${id} not found`);
        }
      } catch (err) {
        console.error("Error fetching motorcycle:", err);
        setError("Failed to load motorcycle data");
        toast.error("Failed to load motorcycle data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMotorcycle();
  }, [id]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col dark text-foreground bg-background">
        <Header />
        <main className="flex-1 container py-8 px-4 md:px-6 flex items-center justify-center">
          <div className="h-12 w-12 border-4 border-t-accent-teal border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !motorcycle) {
    return (
      <div className="min-h-screen flex flex-col dark text-foreground bg-background">
        <Header />
        <main className="flex-1 container py-8 px-4 md:px-6">
          <div className="flex flex-col items-center justify-center py-12">
            <h1 className="text-2xl font-bold mb-4 text-foreground">Motorcycle Not Found</h1>
            <p className="text-muted-foreground mb-6">
              {error || "The motorcycle you're looking for doesn't exist or has been removed."}
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
