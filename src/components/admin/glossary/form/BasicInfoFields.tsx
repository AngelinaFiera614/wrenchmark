
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { GlossaryFormValues } from '@/types/glossary';

interface BasicInfoFieldsProps {
  isEditing: boolean;
}

export function BasicInfoFields({ isEditing }: BasicInfoFieldsProps) {
  const { watch, setValue } = useFormContext<GlossaryFormValues>();
  
  // Generate slug from term
  useEffect(() => {
    const termValue = watch('term');
    if (termValue && !isEditing) {
      const slugValue = termValue
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      setValue('slug', slugValue);
    }
  }, [watch('term'), setValue, isEditing]);

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
            <FormLabel>Slug</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter URL slug"
                {...field}
                className="bg-background"
              />
            </FormControl>
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
