
import React from 'react';
import { Link } from 'react-router-dom';
import { Bike, Wrench, BookOpen, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Home = () => {
  return (
    <div className="min-h-screen bg-explorer-dark text-explorer-text">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-accent-teal">WRENCH</span>MARK
          </h1>
          <p className="text-xl md:text-2xl text-explorer-text-muted mb-4">
            Ride Farther. Build Smarter.
          </p>
          <p className="text-lg text-explorer-text-muted mb-8 max-w-2xl mx-auto">
            Your comprehensive motorcycle reference app. Explore specs, learn maintenance, 
            and master riding skills - all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-accent-teal text-black hover:bg-accent-teal/80">
              <Link to="/motorcycles">
                <Bike className="mr-2 h-5 w-5" />
                Explore Motorcycles
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-accent-teal text-accent-teal hover:bg-accent-teal/10">
              <Link to="/about">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need for Your Motorcycle Journey
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-explorer-card border-explorer-chrome/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-explorer-text">
                  <Bike className="h-6 w-6 text-accent-teal" />
                  Motorcycle Database
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-explorer-text-muted">
                  Comprehensive specs and data for thousands of motorcycle models.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-explorer-card border-explorer-chrome/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-explorer-text">
                  <Wrench className="h-6 w-6 text-accent-teal" />
                  Repair Guides
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-explorer-text-muted">
                  Step-by-step maintenance and repair instructions for DIY enthusiasts.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-explorer-card border-explorer-chrome/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-explorer-text">
                  <BookOpen className="h-6 w-6 text-accent-teal" />
                  Learning Modules
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-explorer-text-muted">
                  Interactive courses to improve your riding skills and mechanical knowledge.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-explorer-card border-explorer-chrome/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-explorer-text">
                  <Users className="h-6 w-6 text-accent-teal" />
                  Community
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-explorer-text-muted">
                  Connect with fellow riders and share your motorcycle journey.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-explorer-chrome/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-lg text-explorer-text-muted mb-8">
            Join the Wrenchmark community and take your motorcycle knowledge to the next level.
          </p>
          <Button asChild size="lg" className="bg-accent-teal text-black hover:bg-accent-teal/80">
            <Link to="/motorcycles">
              Start Exploring
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
