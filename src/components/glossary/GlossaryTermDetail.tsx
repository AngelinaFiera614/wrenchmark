
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { GlossaryTerm } from '@/types/glossary';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { fetchGlossaryTermBySlug } from '@/services/glossaryService';

interface GlossaryTermDetailProps {
  term: GlossaryTerm;
}

const GlossaryTermDetail: React.FC<GlossaryTermDetailProps> = ({ term }) => {
  // Fetch related terms if any are specified
  const { data: relatedTerms } = useQuery({
    queryKey: ['relatedTerms', term.id],
    queryFn: async () => {
      if (!term.related_terms || term.related_terms.length === 0) return [];
      
      const termsPromises = term.related_terms.map(async (slug) => {
        try {
          return await fetchGlossaryTermBySlug(slug);
        } catch (error) {
          console.error(`Error fetching related term ${slug}:`, error);
          return null;
        }
      });
      
      const results = await Promise.all(termsPromises);
      return results.filter(Boolean) as GlossaryTerm[];
    },
    enabled: !!(term.related_terms && term.related_terms.length > 0),
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/glossary" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Glossary
          </Link>
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{term.term}</h1>
          
          {term.category && term.category.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {term.category.map((cat) => (
                <Badge 
                  key={cat} 
                  className="bg-accent-teal text-background"
                >
                  {cat}
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          {term.image_url && (
            <div className="relative aspect-video overflow-hidden rounded-md">
              <img 
                src={term.image_url} 
                alt={term.term}
                className="object-cover w-full h-full"
              />
            </div>
          )}

          <div className="prose prose-invert max-w-none">
            {term.definition.split('\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </div>
        
        {term.video_url && (
          <div className="space-y-2">
            <h3 className="text-xl font-medium">Video Reference</h3>
            <div className="relative aspect-video rounded-md overflow-hidden">
              <iframe 
                src={term.video_url.replace('watch?v=', 'embed/')}
                title={`${term.term} video`}
                className="absolute top-0 left-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
        
        {relatedTerms && relatedTerms.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xl font-medium">Related Terms</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {relatedTerms.map((relatedTerm) => (
                <Card 
                  key={relatedTerm.id} 
                  className="p-3 hover:border-accent-teal transition-colors"
                >
                  <Link 
                    to={`/glossary/${relatedTerm.slug}`}
                    className="flex justify-between items-center"
                  >
                    <span className="font-medium">{relatedTerm.term}</span>
                    <ExternalLink className="h-4 w-4 text-accent-teal" />
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-end text-xs text-muted-foreground">
          <Calendar className="h-3 w-3 mr-1" />
          <span>
            Updated {format(new Date(term.updated_at), 'PPP')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GlossaryTermDetail;
