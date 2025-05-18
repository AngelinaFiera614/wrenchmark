
import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent } from '@/components/ui/card';
import GlossaryTermTooltip from './GlossaryTermTooltip';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { GlossaryTerm } from '@/types/glossary';

interface LessonContentProps {
  content: string;
  glossaryTermSlugs?: string[];
}

const LessonContent: React.FC<LessonContentProps> = ({ content, glossaryTermSlugs = [] }) => {
  // Fetch glossary terms if they were provided
  const { data: glossaryTerms = [] } = useQuery({
    queryKey: ['lessonContentGlossaryTerms', glossaryTermSlugs],
    queryFn: async () => {
      if (!glossaryTermSlugs.length) return [];
      
      const { data, error } = await supabase
        .from('glossary_terms')
        .select('*')
        .in('slug', glossaryTermSlugs);
        
      if (error) throw error;
      return data as GlossaryTerm[];
    },
    enabled: glossaryTermSlugs.length > 0
  });
  
  // Create a map of terms for easy lookup
  const termsMap = useMemo(() => {
    const map: Record<string, GlossaryTerm> = {};
    glossaryTerms.forEach(term => {
      map[term.term.toLowerCase()] = term;
    });
    return map;
  }, [glossaryTerms]);
  
  // Process the markdown content to highlight glossary terms
  const processedContent = useMemo(() => {
    if (!glossaryTerms.length) return content;
    
    let result = content;
    
    // Sort terms by length (descending) to avoid issues with terms that are substrings of others
    const sortedTerms = glossaryTerms
      .map(term => term.term)
      .sort((a, b) => b.length - a.length);
    
    // Replace term occurrences with marked version
    sortedTerms.forEach(term => {
      const regex = new RegExp(`\\b${escapeRegExp(term)}\\b`, 'gi');
      result = result.replace(regex, `[[TERM:${term}]]`);
    });
    
    return result;
  }, [content, glossaryTerms]);

  // Helper function to escape special characters in regex
  function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  return (
    <Card>
      <CardContent className="prose prose-invert max-w-none p-6">
        <ReactMarkdown
          components={{
            p: ({ children }) => {
              if (typeof children === 'string') {
                return <p>{children}</p>;
              }

              // Process any paragraph that might contain our term markers
              return (
                <p>
                  {React.Children.map(children, child => {
                    if (typeof child !== 'string') return child;
                    
                    // Split by term markers and replace with tooltips
                    const parts = child.split(/\[\[TERM:([^\]]+)\]\]/g);
                    return parts.map((part, i) => {
                      // Even indices are regular text, odd indices are term references
                      if (i % 2 === 0) return part;
                      
                      const term = termsMap[part.toLowerCase()];
                      return term ? (
                        <GlossaryTermTooltip key={i} term={term}>
                          {part}
                        </GlossaryTermTooltip>
                      ) : part;
                    });
                  })}
                </p>
              );
            }
          }}
        >
          {processedContent}
        </ReactMarkdown>
      </CardContent>
    </Card>
  );
};

export default LessonContent;
