
import { Link } from "react-router-dom";
import { motorcyclesData } from "@/data/motorcycles";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MotorcycleCard from "@/components/motorcycles/MotorcycleCard";
import { Motorcycle } from "@/types";
import { ArrowRight } from "lucide-react";
import { ComparisonIndicator } from "@/components/comparison/ComparisonIndicator";

// Group motorcycles by category for the quick links section
const groupByCategory = (motorcycles: Motorcycle[]) => {
  const grouped = motorcycles.reduce((acc, motorcycle) => {
    if (!acc[motorcycle.category]) {
      acc[motorcycle.category] = [];
    }
    acc[motorcycle.category].push(motorcycle);
    return acc;
  }, {} as Record<string, Motorcycle[]>);

  return Object.entries(grouped);
};

const categories = groupByCategory(motorcyclesData);
const featuredMotorcycles = motorcyclesData.slice(0, 3);

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col dark">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-24 lg:py-32 bg-charcoal neo-blur">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-mono font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-gradient">
                  WRENCHMARK
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
                  Your definitive motorcycle reference database. Browse, compare, and learn about motorcycles from around the world.
                </p>
              </div>
              <div className="space-x-4">
                <Link to="/motorcycles">
                  <Button className="bg-accent-teal text-black hover:bg-accent-teal-hover">
                    Browse Motorcycles
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Motorcycles */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row mb-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Featured Motorcycles</h2>
                <p className="text-muted-foreground">Check out these popular rides</p>
              </div>
              <Link to="/motorcycles" className="flex items-center text-accent-teal">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredMotorcycles.map((motorcycle) => (
                <MotorcycleCard key={motorcycle.id} motorcycle={motorcycle} />
              ))}
            </div>
          </div>
        </section>

        {/* Quick Category Links */}
        <section className="py-12 md:py-16 bg-graphite">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold tracking-tight mb-8">Browse by Category</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {categories.map(([category, motorcycles]) => (
                <Card key={category} className="hover:bg-muted/20 transition-colors">
                  <CardContent className="p-6">
                    <Link to={`/motorcycles?category=${category}`}>
                      <h3 className="text-lg font-semibold mb-1">{category}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {motorcycles.length} {motorcycles.length === 1 ? 'motorcycle' : 'motorcycles'}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-accent-teal text-sm font-medium">Browse {category}</span>
                        <ArrowRight className="h-4 w-4 text-accent-teal" />
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Future Features Teaser */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Coming Soon</h2>
              <p className="text-muted-foreground max-w-[700px]">
                We're working on exciting new features including user accounts, saved motorcycles, and maintenance logs.
              </p>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mt-8 max-w-4xl">
                <Card className="glass-morphism">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-medium mb-2">User Accounts</h3>
                    <p className="text-sm text-muted-foreground">
                      Create an account to save your favorite bikes and track maintenance.
                    </p>
                  </CardContent>
                </Card>
                <Card className="glass-morphism">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-medium mb-2">Saved Motorcycles</h3>
                    <p className="text-sm text-muted-foreground">
                      Build a collection of your dream bikes or bikes you own.
                    </p>
                  </CardContent>
                </Card>
                <Card className="glass-morphism">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-medium mb-2">Maintenance Logs</h3>
                    <p className="text-sm text-muted-foreground">
                      Keep track of services, repairs, and modifications.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <ComparisonIndicator />
    </div>
  );
}
