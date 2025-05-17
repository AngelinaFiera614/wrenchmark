
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { glossarySchema } from './GlossaryFormSchema';
import { GlossaryTerm, GlossaryFormValues } from '@/types/glossary';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MultiSelect } from './MultiSelect';
import ImageUpload from '@/components/admin/shared/ImageUpload';
import { Separator } from '@/components/ui/separator';

interface GlossaryFormProps {
  term: GlossaryTerm | null;
  onSubmit: (values: GlossaryFormValues) => void;
  isSubmitting: boolean;
  availableTerms: GlossaryTerm[];
}

export function GlossaryForm({
  term,
  onSubmit,
  isSubmitting,
  availableTerms,
}: GlossaryFormProps) {
  const [categoryInput, setCategoryInput] = useState<string>('');
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [relatedTermOptions, setRelatedTermOptions] = useState<{ value: string; label: string }[]>([]);

  const form = useForm<GlossaryFormValues>({
    resolver: zodResolver(glossarySchema),
    defaultValues: {
      term: term?.term || '',
      slug: term?.slug || '',
      definition: term?.definition || '',
      category: term?.category || [],
      related_terms: term?.related_terms || [],
      image_url: term?.image_url || null,
      video_url: term?.video_url || null,
    },
  });

  // Extract all unique categories from available terms
  useEffect(() => {
    if (availableTerms && availableTerms.length > 0) {
      const categories = Array.from(
        new Set(availableTerms.flatMap(term => term.category || []))
      ).sort();
      setAvailableCategories(categories);
    }
  }, [availableTerms]);

  // Generate slug from term
  useEffect(() => {
    const termValue = form.watch('term');
    if (termValue && !term) {
      const slugValue = termValue
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      form.setValue('slug', slugValue);
    }
  }, [form.watch('term'), form, term]);

  // Transform terms to options for the related terms multi-select
  useEffect(() => {
    if (availableTerms && availableTerms.length > 0) {
      const options = availableTerms
        .filter(t => !term || t.id !== term.id) // Filter out the current term
        .map(t => ({
          value: t.slug,
          label: t.term
        }));
      setRelatedTermOptions(options);
    }
  }, [availableTerms, term]);

  // Handle adding a custom category
  const handleAddCategory = () => {
    if (categoryInput && !form.getValues().category.includes(categoryInput)) {
      const currentCategories = form.getValues().category;
      form.setValue('category', [...currentCategories, categoryInput]);
      setCategoryInput('');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
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
          control={form.control}
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
          control={form.control}
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

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categories</FormLabel>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add a category"
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  className="flex-1 bg-background"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddCategory}
                >
                  Add
                </Button>
              </div>
              <FormControl>
                <MultiSelect
                  selected={field.value}
                  options={availableCategories}
                  onChange={field.onChange}
                  placeholder="Select categories"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="related_terms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Related Terms</FormLabel>
              <FormControl>
                <MultiSelect
                  selected={field.value}
                  options={relatedTermOptions.map(opt => opt.value)}
                  optionLabels={relatedTermOptions.reduce((acc, opt) => ({
                    ...acc,
                    [opt.value]: opt.label
                  }), {})}
                  onChange={field.onChange}
                  placeholder="Select related terms"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Media</h3>

          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value || ''}
                    onChange={field.onChange}
                    bucketName="glossary-images"
                    folderPath="/"
                    maxSizeMB={5}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="video_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Video URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter a YouTube or Vimeo URL"
                    {...field}
                    value={field.value || ''}
                    className="bg-background"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : term ? 'Update Term' : 'Create Term'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
