
import { useParams, Link } from "react-router-dom";
import { motorcyclesData } from "@/data/motorcycles";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MotorcycleDetailComponent from "@/components/motorcycles/MotorcycleDetail";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function MotorcycleDetail() {
  const { id } = useParams<{ id: string }>();
  const motorcycle = motorcyclesData.find(m => m.id === id);

  if (!motorcycle) {
    return (
      <div className="min-h-screen flex flex-col dark">
        <Header />
        <main className="flex-1 container py-8 px-4 md:px-6">
          <div className="flex flex-col items-center justify-center py-12">
            <h1 className="text-2xl font-bold mb-4">Motorcycle Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The motorcycle you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/motorcycles">
              <Button>
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
    <div className="min-h-screen flex flex-col dark">
      <Header />
      
      <main className="flex-1">
        <div className="container px-4 md:px-6 py-8">
          <div className="mb-6">
            <Link to="/motorcycles">
              <Button variant="ghost" className="pl-0">
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
