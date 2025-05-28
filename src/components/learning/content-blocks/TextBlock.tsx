
import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import { Card, CardContent } from '@/components/ui/card';
import { useGlossaryTerms } from '@/hooks/useGlossaryTerms';

interface TextBlockProps {
  data: {
    content: string;
    title?: string;
  };
}

export default function TextBlock({ data }: TextBlockProps) {
  const [renderedContent, setRenderedContent] = useState('');
  const { terms, isLoading } = useGlossaryTerms();

  useEffect(() => {
    if (!data.content || isLoading || terms.length === 0) return;
    
    const processContent = async () => {
      let processedContent = data.content;

      // Process glossary term highlights
      if (terms && terms.length > 0) {
        terms.forEach(term => {
          if (!term.term) return;
          
          const regex = new RegExp(`\\b${term.term}\\b`, 'gi');
          processedContent = processedContent.replace(regex, 
            `<span class="glossary-term border-b border-dotted border-accent-teal cursor-help" data-term-id="${term.id}">${term.term}</span>`
          );
        });
      }

      try {
        const htmlContent = await marked(processedContent);
        setRenderedContent(htmlContent);
      } catch (error) {
        console.error('Error parsing markdown:', error);
        setRenderedContent(data.content);
      }
    };

    processContent();
  }, [data.content, terms, isLoading]);

  if (!data.content) {
    return null;
  }

  return (
    <Card className="overflow-hidden animate-fade-in">
      <CardContent className="p-6">
        {data.title && (
          <h3 className="text-xl font-semibold mb-4 text-accent-teal">{data.title}</h3>
        )}
        <div 
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: renderedContent }}
        />
      </CardContent>
    </Card>
  );
}
