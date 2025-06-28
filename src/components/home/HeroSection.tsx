
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Wrench, Users, BookOpen } from "lucide-react";
import { useAuth } from "@/context/auth";

const HeroSection = () => {
  const { user } = useAuth();

  return (
    <section className="relative py-20 px-4 text-center bg-gradient-to-b from-explorer-dark to-background">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-6">
          <Wrench className="h-12 w-12 text-accent-teal mr-4" />
          <h1 className="text-5xl md:text-6xl font-bold text-explorer-text">
            WRENCHMARK
          </h1>
        </div>
        
        <p className="text-xl md:text-2xl text-accent-teal font-medium mb-4">
          Ride Farther. Build Smarter.
        </p>
        
        <p className="text-lg text-explorer-text-muted mb-8 max-w-2xl mx-auto">
          Your comprehensive motorcycle reference app. Discover specs, learn skills, 
          and master maintenance with confidence.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/motorcycles">
            <Button 
              size="lg" 
              className="bg-accent-teal hover:bg-accent-teal/80 text-black font-semibold px-8 py-3"
            >
              Explore Motorcycles
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          
          {!user && (
            <Link to="/login">
              <Button 
                variant="outline" 
                size="lg"
                className="border-accent-teal text-accent-teal hover:bg-accent-teal hover:text-black px-8 py-3"
              >
                Sign In
              </Button>
            </Link>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="bg-accent-teal/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Wrench className="h-8 w-8 text-accent-teal" />
            </div>
            <h3 className="text-lg font-semibold text-explorer-text mb-2">Comprehensive Specs</h3>
            <p className="text-explorer-text-muted">
              Detailed technical specifications and performance data for thousands of motorcycles.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-accent-teal/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-accent-teal" />
            </div>
            <h3 className="text-lg font-semibold text-explorer-text mb-2">Learn & Grow</h3>
            <p className="text-explorer-text-muted">
              Master riding skills and maintenance techniques with our structured learning paths.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-accent-teal/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Users className="h-8 w-8 text-accent-teal" />
            </div>
            <h3 className="text-lg font-semibold text-explorer-text mb-2">Community Driven</h3>
            <p className="text-explorer-text-muted">
              Built by riders, for riders. Join our community of motorcycle enthusiasts.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
