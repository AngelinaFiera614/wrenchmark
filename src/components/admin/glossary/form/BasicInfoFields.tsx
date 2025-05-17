
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
import { Textarea } from '@/components/ui/textarea';
import { GlossaryFormValues } from '@/types/glossary';
import { generateUniqueSlug } from '@/services/glossaryService';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';

interface BasicInfoFieldsProps {
  isEditing: boolean;
}

export function BasicInfoFields({ isEditing }: BasicInfoFieldsProps) {
  const { watch, setValue, getValues } = useFormContext<GlossaryFormValues>();
  const [isGeneratingSlug, setIsGeneratingSlug] = useState(false);
  
  // Generate slug from term on initial creation
  useEffect(() => {
    const termValue = watch('term');
    if (termValue && !isEditing && !getValues('slug')) {
      // Simple client-side slug generation for immediate feedback
      const slugValue = termValue
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      setValue('slug', slugValue);
    }
  }, [watch('term'), setValue, isEditing, getValues]);

  // Handle the regenerate slug click
  const handleRegenerateSlug = async () => {
    const termValue = getValues('term');
    if (!termValue) return;
    
    setIsGeneratingSlug(true);
    try {
      // Get the current term ID if we're editing
      const termId = isEditing ? getValues('id') : undefined;
      
      // Generate a unique slug from the term
      const uniqueSlug = await generateUniqueSlug(termValue, termId);
      setValue('slug', uniqueSlug);
    } catch (error) {
      console.error("Failed to generate unique slug:", error);
    } finally {
      setIsGeneratingSlug(false);
    }
  };

  return (
    <>
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

      <FormField
        name="definition"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Definition</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter the definition"
                className="min-h-[120px] bg-background"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
