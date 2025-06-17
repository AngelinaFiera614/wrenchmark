
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SecureContentRenderer } from '@/components/security/SecureContentRenderer';

interface RichTextBlockProps {
  data: {
    content: string;
    title?: string;
    format?: 'html' | 'markdown';
  };
}

export default function RichTextBlock({ data }: RichTextBlockProps) {
  const { content, title, format = 'html' } = data;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        {title && (
          <h3 className="text-xl font-semibold text-foreground mb-4">
            {title}
          </h3>
        )}
        <div className="prose prose-invert max-w-none">
          <SecureContentRenderer 
            content={content}
            type={format}
            className="rich-text-content"
          />
        </div>
      </CardContent>
    </Card>
  );
}
