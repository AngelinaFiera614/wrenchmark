
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { BookOpen, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGlossaryLearning } from '@/hooks/useGlossaryLearning';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { GlossaryTerm } from '@/types/glossary';

interface LessonGlossaryTermsProps {
  termSlugs: string[];
}

export default function LessonGlossaryTerms({ termSlugs }: LessonGlossaryTermsProps) {
  const { user } = useAuth();
  const { toggleTermLearned } = useGlossaryLearning();
  
  // Fetch all glossary terms mentioned in this lesson
  const { data: terms, isLoading } = useQuery({
    queryKey: ['lessonGlossaryTerms', termSlugs],
    queryFn: async () => {
      if (!termSlugs?.length) return [];
      
      const { data, error } = await supabase
        .from('glossary_terms')
        .select('*')
        .in('slug', termSlugs);
        
      if (error) throw error;
      return data as GlossaryTerm[];
    },
    enabled: termSlugs?.length > 0
  });
  
  // Fetch learning status for each term
  const { data: learningStatus, isLoading: isLoadingStatus } = useQuery({
    queryKey: ['lessonTermsLearningStatus', user?.id, termSlugs],
    queryFn: async () => {
      if (!user || !termSlugs?.length) return {};
      
      const { data, error } = await supabase
        .from('user_glossary_terms')
        .select('term_slug, is_learned')
        .eq('user_id', user.id)
        .in('term_slug', termSlugs);
        
      if (error) throw error;
      
      // Convert to a map for easier lookup
      const statusMap: Record<string, boolean> = {};
      data.forEach(item => {
        statusMap[item.term_slug] = item.is_learned;
      });
      
      return statusMap;
    },
    enabled: !!user && termSlugs?.length > 0
  });
  
  if (isLoading || !terms || terms.length === 0) {
    return null;
  }
  
  const handleToggleLearned = (slug: string, currentStatus: boolean) => {
    toggleTermLearned.mutate({
      slug,
      isLearned: !currentStatus
    });
  };
  
  // Group terms by category
  const termsByCategory: Record<string, GlossaryTerm[]> = {};
  terms.forEach(term => {
    const categories = term.category?.length ? term.category : ['General'];
    categories.forEach(category => {
      if (!termsByCategory[category]) {
        termsByCategory[category] = [];
      }
      termsByCategory[category].push(term);
    });
  });
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <BookOpen className="h-5 w-5 mr-2 text-accent-teal" />
          Key Terminology in this Lesson
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(termsByCategory).map(([category, categoryTerms]) => (
            <div key={category} className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">{category}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {categoryTerms.map(term => {
                  const isLearned = learningStatus?.[term.slug] || false;
                  
                  return (
                    <div 
                      key={term.slug}
                      className="flex items-center justify-between p-2 rounded-md border border-border bg-card/50"
                    >
                      <Link 
                        to={`/glossary/${term.slug}`}
                        className="text-sm hover:text-accent-teal"
                      >
                        {term.term}
                      </Link>
                      
                      {user && (
                        <Button
                          size="sm"
                          variant={isLearned ? "default" : "outline"}
                          className={`h-7 ${isLearned ? 'bg-accent-teal text-black hover:bg-accent-teal/90' : 'border-accent-teal text-accent-teal'}`}
                          onClick={() => handleToggleLearned(term.slug, isLearned)}
                          disabled={toggleTermLearned.isPending}
                        >
                          {isLearned ? (
                            <>
                              <Check className="h-3 w-3 mr-1" />
                              <span className="text-xs">Learned</span>
                            </>
                          ) : (
                            <span className="text-xs">Mark Learned</span>
                          )}
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
