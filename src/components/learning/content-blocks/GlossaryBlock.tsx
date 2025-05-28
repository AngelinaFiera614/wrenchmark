
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface GlossaryBlockProps {
  data: {
    title?: string;
    terms: Array<{
      slug: string;
      term: string;
      definition: string;
    }>;
  };
}

export default function GlossaryBlock({ data }: GlossaryBlockProps) {
  if (!data.terms || data.terms.length === 0) {
    return null;
  }

  return (
    <Card className="overflow-hidden animate-fade-in">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4 text-accent-teal">
          {data.title || 'Related Terms'}
        </h3>
        
        <div className="space-y-4">
          {data.terms.map((term, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-accent-teal mb-1">{term.term}</h4>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {term.definition}
                  </p>
                </div>
                
                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/glossary/${term.slug}`}>
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-6">
          <Button variant="outline" asChild>
            <Link to="/glossary">
              View All Glossary Terms
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
