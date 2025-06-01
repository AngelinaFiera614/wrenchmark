
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Code } from 'lucide-react';
import { SecureContentRenderer } from '@/components/security/SecureContentRenderer';
import { sanitizeUserInput } from '@/services/security/inputSanitizer';
import { useSecureForm, commonValidationRules } from '@/hooks/useSecureForm';

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
  const [viewMode, setViewMode] = useState<'rendered' | 'markdown'>('rendered');

  const { formData, errors, updateField, handleSubmit, resetForm } = useSecureForm({
    validationConfig: {
      content: {
        required: true,
        maxLength: 10000,
        sanitizer: (value: string) => sanitizeUserInput(value, 10000)
      }
    },
    onSubmit: async (data) => {
      onEdit?.(data.content);
      setIsEditing(false);
    },
    logFormActivity: false
  });

  const handleEdit = () => {
    updateField('content', content);
    setIsEditing(true);
  };

  const handleCancel = () => {
    resetForm();
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Card className="bg-card border-border/30">
        <CardContent className="p-6">
          {title && (
            <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <textarea
                value={formData.content || ''}
                onChange={(e) => updateField('content', e.target.value)}
                className="w-full h-64 bg-background border border-border rounded text-foreground p-3 resize-none focus:border-accent-teal/50 focus:outline-none"
                placeholder="Enter markdown content..."
                maxLength={10000}
              />
              {errors.content && (
                <p className="text-sm text-red-500 mt-1">{errors.content}</p>
              )}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {(formData.content || '').length}/10000 characters
              </span>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="bg-accent-teal text-background hover:bg-accent-teal/80"
                >
                  Save
                </Button>
                <Button
                  type="button"
                  onClick={handleCancel}
                  variant="outline"
                  className="border-border/30 text-foreground hover:border-accent-teal/50"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border/30">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          {title && (
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          )}
          <div className="flex items-center gap-2">
            {content && (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode(viewMode === 'rendered' ? 'markdown' : 'rendered')}
                  className="text-muted-foreground hover:text-foreground"
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
                onClick={handleEdit}
                className="text-muted-foreground hover:text-foreground"
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
              <SecureContentRenderer 
                content={content}
                type="markdown"
                className="text-foreground"
              />
            ) : (
              <pre className="bg-muted p-4 rounded border border-border/20 text-sm text-foreground whitespace-pre-wrap">
                {content}
              </pre>
            )}
          </div>
        ) : (
          <p className="text-muted-foreground italic">No content available</p>
        )}
      </CardContent>
    </Card>
  );
}
