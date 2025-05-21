
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const NotFoundPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found | Wrenchmark</title>
      </Helmet>
      
      <div className="container py-16 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl mb-8 text-muted-foreground">
          The page you're looking for couldn't be found.
        </p>
        <Link 
          to="/"
          className="bg-accent-teal hover:bg-accent-teal/90 text-black py-2 px-6 rounded-md"
        >
          Return to Home
        </Link>
      </div>
    </>
  );
};

export default NotFoundPage;
