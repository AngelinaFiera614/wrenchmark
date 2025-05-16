import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ArrowRight, Shield, Wrench, PanelTop } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
const Index = () => {
  const {
    isAdmin
  } = useAuth();
  const [motorcycle, setMotorcycle] = useState<string | null>(null);
  useEffect(() => {
    // Simulate fetching a motorcycle from local storage or an API
    const storedMotorcycle = localStorage.getItem("selectedMotorcycle");
    if (storedMotorcycle) {
      setMotorcycle(storedMotorcycle);
    }
  }, []);
  const handleMotorcycleSelect = (motorcycleName: string) => {
    setMotorcycle(motorcycleName);
    localStorage.setItem("selectedMotorcycle", motorcycleName);
  };
  return <>
      <Header />
      <main className="flex-grow">
        {/* Hero section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center opacity-20"></div>
          <div className="container relative z-10 px-4 py-12">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gradient">
                Ride Farther. Build Smarter.
              </h1>
              <p className="text-lg md:text-xl text-gray-300">
                Your reference guide to motorcycles, repair skills, and riding technique
              </p>
              <div className="flex flex-wrap gap-4 justify-center mt-8">
                <Link to="/motorcycles">
                  <Button variant="teal" size="lg">
                    Browse Motorcycles
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/brands">
                  <Button variant="outline" size="lg">
                    Explore Brands
                  </Button>
                </Link>
              </div>

              {/* Admin dashboard link if user is admin */}
              {isAdmin && <div className="mt-6 flex justify-center">
                  <Link to="/admin">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <PanelTop className="h-4 w-4" />
                      Admin Dashboard
                    </Button>
                  </Link>
                </div>}
            </div>
          </div>
        </section>

        {/* Features section */}
        <section className="py-16 bg-black/30">
          <div className="container px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-accent-teal">
              Everything you need to know
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="glass-morphism p-6 rounded-lg text-center space-y-4">
                <div className="mx-auto bg-accent-teal/20 w-12 h-12 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-accent-teal" />
                </div>
                <h3 className="text-xl font-semibold text-white">Motorcycle Specifications</h3>
                <p className="text-gray-300">
                  Comprehensive database of motorcycle specs, dimensions, and features.
                </p>
              </div>
              <div className="glass-morphism p-6 rounded-lg text-center space-y-4">
                <div className="mx-auto bg-accent-teal/20 w-12 h-12 rounded-full flex items-center justify-center">
                  <Wrench className="h-6 w-6 text-accent-teal" />
                </div>
                <h3 className="text-xl font-semibold text-white">DIY Repair Skills</h3>
                <p className="text-gray-300">
                  Step-by-step guides for common motorcycle maintenance and repairs.
                </p>
              </div>
              <div className="glass-morphism p-6 rounded-lg text-center space-y-4">
                <div className="mx-auto bg-accent-teal/20 w-12 h-12 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-accent-teal">
                    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 2a8 8 0 1 1-8 8 8 8 0 0 1 8-8z" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">Compare Models</h3>
                <p className="text-gray-300">
                  Side-by-side comparison of motorcycles to find your perfect match.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to action section */}
        <section className="py-24 bg-black/60">
          <div className="container px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-accent-teal mb-8">
              Ready to dive in?
            </h2>
            <p className="text-lg text-gray-300 mb-12">
              Explore our motorcycle database, learn new repair skills, and
              compare your favorite models.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/motorcycles">
                <Button variant="teal" size="lg">
                  View All Motorcycles
                </Button>
              </Link>
              <Link to="/brands">
                <Button variant="outline" size="lg">
                  Discover Brands
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>;
};
export default Index;