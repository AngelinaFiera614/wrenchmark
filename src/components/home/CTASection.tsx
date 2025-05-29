
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import { Button } from '@/components/ui/button';

const CTASection: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-background to-background/95 z-0"></div>
      <div 
        className="absolute inset-0 z-[-1] opacity-20"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1525013066836-c6090f0ad9d8?q=80&w=1740&auto=format&fit=crop')", 
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      ></div>
      <div className="container max-w-6xl mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Improve Your Ride?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join Wrenchmark today for access to comprehensive motorcycle data, repair guides, and community knowledge.
          </p>
          {!user ? (
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" variant="teal">
                <Link to="/auth">Sign Up Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/motorcycles">Explore Motorcycles</Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" variant="teal">
                <Link to="/profile">Go to Profile</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/motorcycles">Explore Motorcycles</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CTASection;
