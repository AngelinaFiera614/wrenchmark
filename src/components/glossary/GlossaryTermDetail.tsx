
import React from 'react';
import { Link } from 'react-router-dom';
import { GlossaryTerm } from '@/types/glossary';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useGlossaryLearning } from '@/hooks/useGlossaryLearning';
import { Button } from '@/components/ui/button';
import { Check, BookOpen } from 'lucide-react';
import { useAuth } from '@/context/auth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface GlossaryTermDetailProps {
  term: GlossaryTerm;
}

const GlossaryTermDetail: React.FC<GlossaryTermDetailProps> = ({ term }) => {
  const { user } = useAuth();
  const { useTermLearningStatus, toggleTermLearned } = useGlossaryLearning();
  const { isLearned, isLoading: isLoadingLearningStatus } = useTermLearningStatus(term.slug);
  
  // Fetch lessons that refer to this term
  const { data: relatedLessons, isLoading: isLoadingLessons } = useQuery({
    queryKey: ['termLessons', term.slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('id, title, slug, course_id')
        .contains('glossary_terms', [term.slug])
        .eq('published', true)
        .order('title');
        
      if (error) throw error;
      return data || [];
    }
  });

  const handleToggleLearned = () => {
    toggleTermLearned.mutate({
      slug: term.slug,
      isLearned: !isLearned
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-2xl md:text-3xl font-bold">{term.term}</CardTitle>
              {user && (
                <Button 
                  variant={isLearned ? "default" : "outline"}
                  size="sm"
                  className={isLearned ? "bg-accent-teal text-black hover:bg-accent-teal/90" : "border-accent-teal text-accent-teal"}
                  disabled={isLoadingLearningStatus || toggleTermLearned.isPending}
                  onClick={handleToggleLearned}
                >
                  {isLearned ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Learned
                    </>
                  ) : (
                    <>
                      <BookOpen className="h-4 w-4 mr-1" />
                      Mark as Learned
                    </>
                  )}
                </Button>
              )}
            </div>
            <CardDescription className="mt-2 text-muted-foreground">
              {term.category && term.category.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {term.category.map((cat) => (
                    <Badge key={cat} variant="secondary">{cat}</Badge>
                  ))}
                </div>
              )}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {term.image_url && (
            <div className="mb-4">
              <AspectRatio ratio={16 / 9}>
                <img
                  src={term.image_url}
                  alt={term.term}
                  className="rounded-md object-cover w-full h-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1601517491080-28095259a0da?w=800&auto=format&fit=crop";
                  }}
                />
              </AspectRatio>
            </div>
          )}

          <div className="prose prose-invert max-w-none">
            <h3 className="text-lg font-medium">Definition</h3>
            <p className="text-base">{term.definition}</p>
          </div>

          {relatedLessons && relatedLessons.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Learn more in these lessons</h3>
              <ul className="space-y-2">
                {relatedLessons.map(lesson => (
                  <li key={lesson.id} className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2 text-accent-teal" />
                    <Link 
                      to={`/courses/${lesson.course_id}/${lesson.slug}`}
                      className="text-accent-teal hover:underline"
                    >
                      {lesson.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {term.related_terms && term.related_terms.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Related Terms</h3>
              <div className="flex flex-wrap gap-2">
                {term.related_terms.map((relatedSlug) => (
                  <Link key={relatedSlug} to={`/glossary/${relatedSlug}`}>
                    <Badge variant="outline" className="cursor-pointer hover:bg-accent-teal hover:text-black">
                      {relatedSlug.replace(/-/g, ' ')}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {term.video_url && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Video Explanation</h3>
              <AspectRatio ratio={16 / 9}>
                <iframe
                  src={term.video_url}
                  title={`${term.term} video`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full rounded-md"
                ></iframe>
              </AspectRatio>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GlossaryTermDetail;
