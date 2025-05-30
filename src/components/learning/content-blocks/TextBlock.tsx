
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SecureContentRenderer } from '@/components/security/SecureContentRenderer';

interface TextBlockProps {
  data: {
    content?: string;
    title?: string;
    [key: string]: any;
  };
}

export default function TextBlock({ data }: TextBlockProps) {
  // Get content from data, fallback to empty string
  const content = data?.content || '';

  if (!content) {
    return (
      <Card className="overflow-hidden animate-fade-in">
        <CardContent className="p-6">
          <p className="text-muted-foreground">No content available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden animate-fade-in">
      <CardContent className="p-6">
        {data.title && (
          <h3 className="text-xl font-semibold mb-4 text-accent-teal">{data.title}</h3>
        )}
        <SecureContentRenderer 
          content={content}
          type="markdown"
          className="prose prose-invert max-w-none"
        />
      </CardContent>
    </Card>
  );
}
