
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useGlossaryTerm } from '@/hooks/useGlossaryTerms';
import GlossaryTermDetail from '@/components/glossary/GlossaryTermDetail';
import { Loader } from 'lucide-react';

const GlossaryTermPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: term, isLoading, error } = useGlossaryTerm(slug || '');
  
  if (isLoading) {
    return (
      <div className="container py-12 flex justify-center">
        <Loader className="h-8 w-8 animate-spin text-accent-teal" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container py-12">
        <div className="text-center space-y-2">
          <h1 className="text-xl font-medium">Error</h1>
          <p className="text-muted-foreground">
            Failed to load term information. Please try again.
          </p>
        </div>
      </div>
    );
  }
  
  if (!term) {
    return <Navigate to="/glossary" replace />;
  }
  
  return (
    <div className="container py-8">
      <GlossaryTermDetail term={term} />
    </div>
  );
};

export default GlossaryTermPage;
