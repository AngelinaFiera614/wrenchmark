
import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const ManualPage = () => {
  const { manualSlug } = useParams<{ manualSlug: string }>();

  return (
    <div className="container mx-auto py-8 px-4">
      <Helmet>
        <title>Manual Details | Wrenchmark</title>
        <meta name="description" content="View motorcycle manual details" />
      </Helmet>
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-foreground">Manual: {manualSlug}</h1>

        {/* This is a placeholder. Will be replaced with actual manual details */}
        <div className="bg-muted/30 border border-border rounded-lg p-8 text-center">
          <p className="text-muted-foreground">
            Manual details will be available soon.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManualPage;
