
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import { Button } from '@/components/ui/button';

const HeroSection: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/80 to-background z-0"></div>
      <div 
        className="absolute inset-0 z-[-1] opacity-20"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1558981285-6f0c94958bb6?q=80&w=1740&auto=format&fit=crop')", 
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      ></div>
      <div className="container max-w-6xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 space-y-6 text-center md:text-left mb-10 md:mb-0">
            <div className="flex justify-center md:justify-start mb-6">
              <img 
                src="/wrenchmark-logo-full-dark.png" 
                alt="Wrenchmark logo" 
                className="h-16 md:h-20 w-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = document.createElement('h1');
                  fallback.textContent = 'WRENCHMARK';
                  fallback.className = 'text-3xl md:text-4xl font-bold text-accent-teal';
                  target.parentNode?.appendChild(fallback);
                }}
              />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              <span className="text-gradient">Ride Farther.</span>
              <br />
              <span className="text-accent-teal">Build Smarter.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
              The ultimate motorcycle reference app built for riders, wrenchers, and learners. Access specs, manuals, and skills all in one place.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              {!user ? (
                <>
                  <Button asChild size="lg" variant="teal">
                    <Link to="/auth">Get Started</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link to="/motorcycles">Browse Motorcycles</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild size="lg" variant="teal">
                    <Link to="/motorcycles">Browse Motorcycles</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link to="/courses">Explore Courses</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center md:justify-end animate-fade-in">
            <div className="w-full max-w-md glass-morphism rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1622185135505-2d795003994a?q=80&w=1740&auto=format&fit=crop" 
                alt="Motorcycle"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
