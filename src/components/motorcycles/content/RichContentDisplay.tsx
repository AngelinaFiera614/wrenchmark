
import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Code } from 'lucide-react';

interface RichContentDisplayProps {
  content: string;
  title?: string;
  allowEdit?: boolean;
  onEdit?: (newContent: string) => void;
}

export default function RichContentDisplay({
  content,
  title,
  allowEdit = false,
  onEdit
}: RichContentDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [renderedContent, setRenderedContent] = useState('');
  const [viewMode, setViewMode] = useState<'rendered' | 'markdown'>('rendered');

  useEffect(() => {
    const renderMarkdown = async () => {
      try {
        const html = await marked(content);
        setRenderedContent(html);
      } catch (error) {
        console.error('Error rendering markdown:', error);
        setRenderedContent(content);
      }
    };
    
    renderMarkdown();
  }, [content]);

  const handleSave = () => {
    onEdit?.(editContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditContent(content);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardContent className="p-6">
          {title && (
            <h3 className="text-lg font-semibold text-explorer-text mb-4">{title}</h3>
          )}
          <div className="space-y-4">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full h-64 bg-explorer-dark border border-explorer-chrome/30 rounded text-explorer-text p-3 resize-none focus:border-explorer-teal/50 focus:outline-none"
              placeholder="Enter markdown content..."
            />
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                className="bg-explorer-teal text-explorer-dark hover:bg-explorer-teal/80"
              >
                Save
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="border-explorer-chrome/30 text-explorer-text hover:border-explorer-teal/50"
              >
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          {title && (
            <h3 className="text-lg font-semibold text-explorer-text">{title}</h3>
          )}
          <div className="flex items-center gap-2">
            {content && (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode(viewMode === 'rendered' ? 'markdown' : 'rendered')}
                  className="text-explorer-text-muted hover:text-explorer-text"
                >
                  {viewMode === 'rendered' ? (
                    <>
                      <Code className="h-4 w-4 mr-1" />
                      Raw
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-1" />
                      Rendered
                    </>
                  )}
                </Button>
              </div>
            )}
            {allowEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="text-explorer-text-muted hover:text-explorer-text"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
          </div>
        </div>
        
        {content ? (
          <div className="prose prose-invert max-w-none">
            {viewMode === 'rendered' ? (
              <div
                className="text-explorer-text"
                dangerouslySetInnerHTML={{ __html: renderedContent }}
              />
            ) : (
              <pre className="bg-explorer-dark-light p-4 rounded border border-explorer-chrome/20 text-sm text-explorer-text whitespace-pre-wrap">
                {content}
              </pre>
            )}
          </div>
        ) : (
          <p className="text-explorer-text-muted italic">No content available</p>
        )}
      </CardContent>
    </Card>
  );
}
