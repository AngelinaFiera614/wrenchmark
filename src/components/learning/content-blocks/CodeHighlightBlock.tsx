
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface CodeHighlightBlockProps {
  data: {
    code: string;
    language: string;
    title?: string;
    line_numbers?: boolean;
    highlight_lines?: number[];
  };
}

export default function CodeHighlightBlock({ data }: CodeHighlightBlockProps) {
  const { code, language = 'javascript', title, line_numbers = true, highlight_lines = [] } = data;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Code copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy code');
    }
  };

  const lines = code.split('\n');

  return (
    <Card>
      {title && (
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span>{title}</span>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                {language}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-8 w-8 p-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={title ? 'pt-0' : 'p-6'}>
        <div className="relative">
          {!title && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="absolute top-2 right-2 h-8 w-8 p-0 z-10"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          )}
          <pre className="bg-muted rounded-lg p-4 overflow-x-auto">
            <code className={`language-${language}`}>
              {line_numbers ? (
                <div className="flex">
                  <div className="select-none text-muted-foreground text-right pr-4 min-w-[3rem]">
                    {lines.map((_, index) => (
                      <div key={index + 1} className="leading-6">
                        {index + 1}
                      </div>
                    ))}
                  </div>
                  <div className="flex-1">
                    {lines.map((line, index) => (
                      <div
                        key={index}
                        className={`leading-6 ${
                          highlight_lines.includes(index + 1)
                            ? 'bg-accent-teal/10 -mx-2 px-2 rounded'
                            : ''
                        }`}
                      >
                        {line || '\u00A0'}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                code
              )}
            </code>
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}
