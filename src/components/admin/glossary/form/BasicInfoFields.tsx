
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { GlossaryFormValues } from '@/types/glossary';
import { generateUniqueSlug } from '@/services/glossaryService';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, Sparkles } from 'lucide-react';
import { RichTextEditor } from '../RichTextEditor';
import { TermSuggestions } from '../TermSuggestions';
import { useTermSuggestions } from '@/hooks/useTermSuggestions';
import { GlossaryTerm } from '@/types/glossary';
import { Card, CardContent } from '@/components/ui/card';

interface BasicInfoFieldsProps {
  isEditing: boolean;
  availableTerms: GlossaryTerm[];
  currentTermId?: string;
}

export function BasicInfoFields({ 
  isEditing, 
  availableTerms, 
  currentTermId 
}: BasicInfoFieldsProps) {
  const { watch, setValue, getValues } = useFormContext<GlossaryFormValues>();
  const [isGeneratingSlug, setIsGeneratingSlug] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  
  const termValue = watch('term') || '';
  const definitionValue = watch('definition') || '';

  // Use suggestions hook
  const {
    suggestions,
    categorySuggestions,
    duplicates,
    definitionTemplate
  } = useTermSuggestions(termValue, definitionValue, availableTerms, currentTermId);

  // Generate slug from term on initial creation
  useEffect(() => {
    if (termValue && !isEditing && !getValues('slug')) {
      // Simple client-side slug generation for immediate feedback
      const slugValue = termValue
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      setValue('slug', slugValue);
    }
  }, [termValue, setValue, isEditing, getValues]);

  // Handle the regenerate slug click
  const handleRegenerateSlug = async () => {
    const currentTerm = getValues('term');
    if (!currentTerm) return;
    
    setIsGeneratingSlug(true);
    try {
      const termId = isEditing ? getValues('id') : undefined;
      const uniqueSlug = await generateUniqueSlug(currentTerm, termId);
      setValue('slug', uniqueSlug);
    } catch (error) {
      console.error("Failed to generate unique slug:", error);
    } finally {
      setIsGeneratingSlug(false);
    }
  };

  // Handle suggestion application
  const handleApplySuggestion = (suggestion: any) => {
    setValue('term', suggestion.term);
    if (suggestion.categories && suggestion.categories.length > 0) {
      const currentCategories = getValues('category') || [];
      const newCategories = [...new Set([...currentCategories, ...suggestion.categories])];
      setValue('category', newCategories);
    }
  };

  // Handle duplicate viewing (you might want to implement a modal or redirect)
  const handleViewDuplicate = (duplicate: GlossaryTerm) => {
    console.log('View duplicate:', duplicate);
    // TODO: Implement duplicate viewing logic
  };

  // Apply definition template
  const handleApplyTemplate = () => {
    if (definitionTemplate) {
      setValue('definition', definitionTemplate.template);
    }
  };

  return (
    <div className="space-y-6">
      <FormField
        name="term"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Term</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter the glossary term"
                {...field}
                className="bg-background"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="slug"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel>Slug</FormLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={handleRegenerateSlug}
                disabled={isGeneratingSlug}
              >
                {isGeneratingSlug ? (
                  <><Loader2 className="mr-1 h-3 w-3 animate-spin" /> Generating</>
                ) : (
                  <><RefreshCw className="mr-1 h-3 w-3" /> Regenerate</>
                )}
              </Button>
            </div>
            <FormControl>
              <Input
                placeholder="Enter URL slug"
                {...field}
                className="bg-background"
              />
            </FormControl>
            <FormDescription className="text-xs">
              The slug is used to create the URL for this term.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Suggestions Panel */}
      {showSuggestions && (suggestions.length > 0 || duplicates.length > 0) && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Smart Suggestions</h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="text-xs"
            >
              {showSuggestions ? 'Hide' : 'Show'}
            </Button>
          </div>
          <TermSuggestions
            suggestions={suggestions}
            duplicates={duplicates}
            onApplySuggestion={handleApplySuggestion}
            onViewDuplicate={handleViewDuplicate}
          />
        </div>
      )}

      <FormField
        name="definition"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel>Definition</FormLabel>
              {definitionTemplate && !field.value && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleApplyTemplate}
                  className="h-7 text-xs gap-1"
                >
                  <Sparkles className="h-3 w-3" />
                  Use Template
                </Button>
              )}
            </div>
            <FormControl>
              <RichTextEditor
                value={field.value}
                onChange={field.onChange}
                placeholder="Enter the definition (supports **bold**, *italic*, [links](url))"
                minHeight={120}
              />
            </FormControl>
            {definitionTemplate && !field.value && (
              <Card className="mt-2">
                <CardContent className="p-3">
                  <div className="text-xs text-muted-foreground mb-2">Suggested template:</div>
                  <div className="text-sm font-mono bg-muted p-2 rounded text-wrap">
                    {definitionTemplate.template}
                  </div>
                </CardContent>
              </Card>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
