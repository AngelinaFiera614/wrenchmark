
import React from 'react';
import { Helmet } from 'react-helmet-async';

const ManualsPage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <Helmet>
        <title>Motorcycle Manuals | Wrenchmark</title>
        <meta name="description" content="Browse our collection of motorcycle manuals and service guides" />
      </Helmet>
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-foreground">Motorcycle Manuals</h1>
        <p className="text-muted-foreground mb-8">
          Access owner's manuals, service guides, and wiring diagrams for your motorcycle.
        </p>

        {/* This is a placeholder. Will be replaced with actual manuals list */}
        <div className="bg-muted/30 border border-border rounded-lg p-8 text-center">
          <p className="text-muted-foreground">
            Manuals will be available soon.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManualsPage;
