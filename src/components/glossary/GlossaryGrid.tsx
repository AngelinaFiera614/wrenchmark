
import React from 'react';
import { GlossaryTerm } from '@/types/glossary';
import GlossaryCard from './GlossaryCard';
import { Loader } from 'lucide-react';

interface GlossaryGridProps {
  terms: GlossaryTerm[];
  isLoading: boolean;
  searchString?: string;
}

const GlossaryGrid: React.FC<GlossaryGridProps> = ({ terms, isLoading, searchString }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader className="h-8 w-8 animate-spin text-accent-teal" />
      </div>
    );
  }

  if (!terms || terms.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          {searchString
            ? `No terms found matching "${searchString}"`
            : "No glossary terms available yet"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {terms.map((term) => (
        <GlossaryCard key={term.id} term={term} />
      ))}
    </div>
  );
};

export default GlossaryGrid;
