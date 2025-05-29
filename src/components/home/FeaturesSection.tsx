
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { features } from './data/featuresData';

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Everything for Your Ride</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Wrenchmark helps riders, DIY mechanics, and motorcycle enthusiasts find the information they need.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-border bg-card shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="rounded-full bg-accent-teal/10 w-12 h-12 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-accent-teal" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" asChild className="p-0 text-accent-teal hover:text-accent-teal group gap-1">
                  <Link to={feature.link}>
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
