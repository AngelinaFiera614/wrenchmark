
import React, { useEffect, useState } from 'react';
import { marked } from 'marked';
import { useGlossaryTerms } from '@/hooks/useGlossaryTerms';
import GlossaryTermTooltip from './GlossaryTermTooltip';
import StateRulesSection from './StateRulesSection';

interface LessonContentProps {
  content: string;
  glossaryTermSlugs?: string[];
  lessonId?: string;
  stateRules?: any[]; // Simplified for now
}

const LessonContent: React.FC<LessonContentProps> = ({ 
  content, 
  glossaryTermSlugs = [],
  lessonId,
  stateRules = []
}) => {
  const [htmlContent, setHtmlContent] = useState('');
  const { terms, isLoading } = useGlossaryTerms(glossaryTermSlugs);

  useEffect(() => {
    if (!content) return;

    // Process markdown content
    const processMarkdown = async () => {
      try {
        // Use marked to convert markdown to HTML
        const processedContent = marked.parse(content);
        
        // Enhance with glossary terms if available
        let enhancedContent = processedContent;
        
        if (terms && terms.length > 0) {
          terms.forEach(term => {
            if (!term.term) return;
            
            // Create regex to find the term in the content (case insensitive, whole word)
            const regex = new RegExp(`\\b${term.term}\\b`, 'gi');
            
            // Replace with span that will be enhanced with tooltip
            enhancedContent = enhancedContent.replace(regex, 
              `<span class="glossary-term" data-term="${term.slug}">${term.term}</span>`
            );
          });
        }
        
        setHtmlContent(enhancedContent);
      } catch (error) {
        console.error("Error processing markdown:", error);
        setHtmlContent("<p>Error rendering content</p>");
      }
    };
    
    processMarkdown();
  }, [content, terms]);

  if (isLoading) {
    return <div className="animate-pulse h-64 bg-muted rounded"></div>;
  }

  return (
    <div className="lesson-content">
      <div 
        className="prose dark:prose-invert prose-headings:text-foreground prose-a:text-accent-teal max-w-none"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
      
      {/* Add state rules section if the lesson has associated state rules */}
      {stateRules && stateRules.length > 0 && (
        <StateRulesSection stateRules={stateRules} />
      )}
      
      {/* Render tooltips for all glossary terms */}
      {terms && terms.map(term => (
        <GlossaryTermTooltip 
          key={term.slug} 
          term={term}
          termSelector={`[data-term="${term.slug}"]`}
        />
      ))}
    </div>
  );
};

export default LessonContent;
