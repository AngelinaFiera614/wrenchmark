import React from 'react';
import { Helmet } from 'react-helmet-async';

const Index: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Wrenchmark - Motorcycle Reference App</title>
      </Helmet>
      
      <div className="container py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to Wrenchmark</h1>
          <p className="text-xl text-muted-foreground">
            The motorcycle reference app built for riders, wrenchers, and learners.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Featured sections will go here */}
        </div>
      </div>
    </>
  );
};

export default Index;
