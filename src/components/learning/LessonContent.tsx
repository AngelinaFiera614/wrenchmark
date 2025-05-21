
import React, { useEffect, useState } from 'react';
import { marked } from 'marked';
import { useGlossaryTerms } from '@/hooks/useGlossaryTerms';
import GlossaryTermTooltip from './GlossaryTermTooltip';
import StateRulesSection from './StateRulesSection';
import { useLessonStateRules } from '@/hooks/useStateRules';

interface LessonContentProps {
  content: string;
  glossaryTermSlugs?: string[];
  lessonId?: string;
}

interface GlossaryTermTooltipProps {
  term: any;
  selector: string;
}

const LessonContent: React.FC<LessonContentProps> = ({ 
  content, 
  glossaryTermSlugs = [],
  lessonId
}) => {
  const [htmlContent, setHtmlContent] = useState('');
  const { stateRules } = useLessonStateRules(lessonId);
  const { terms, isLoading } = useGlossaryTerms(glossaryTermSlugs);

  useEffect(() => {
    if (!content) return;

    // Process markdown content
    let processedContent = marked(content);
    
    // Enhance with glossary terms if available
    if (terms && terms.length > 0) {
      terms.forEach(term => {
        if (!term.term) return;
        
        // Create regex to find the term in the content (case insensitive, whole word)
        const regex = new RegExp(`\\b${term.term}\\b`, 'gi');
        
        // Replace with span that will be enhanced with tooltip
        processedContent = processedContent.replace(regex, 
          `<span class="glossary-term" data-term="${term.slug}">${term.term}</span>`
        );
      });
    }
    
    setHtmlContent(processedContent);
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
          selector={`[data-term="${term.slug}"]`}
        />
      ))}
    </div>
  );
};

export default LessonContent;
