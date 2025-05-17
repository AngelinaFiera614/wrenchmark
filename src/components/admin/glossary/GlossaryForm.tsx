
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { glossarySchema } from './GlossaryFormSchema';
import { GlossaryTerm, GlossaryFormValues } from '@/types/glossary';
import { Form } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { BasicInfoFields } from './form/BasicInfoFields';
import { CategoryFields } from './form/CategoryFields';
import { RelatedTermsField } from './form/RelatedTermsField';
import { MediaFields } from './form/MediaFields';
import { FormActions } from './form/FormActions';

interface GlossaryFormProps {
  term: GlossaryTerm | null;
  onSubmit: (values: GlossaryFormValues) => void;
  isSubmitting: boolean;
  availableTerms: GlossaryTerm[];
  onCancel: () => void;
}

export function GlossaryForm({
  term,
  onSubmit,
  isSubmitting,
  availableTerms,
  onCancel,
}: GlossaryFormProps) {
  // Include ID in the form values when editing
  const form = useForm<GlossaryFormValues & { id?: string }>({
    resolver: zodResolver(glossarySchema),
    defaultValues: {
      id: term?.id, // Include the ID when editing
      term: term?.term || '',
      slug: term?.slug || '',
      definition: term?.definition || '',
      category: term?.category || [],
      related_terms: term?.related_terms || [],
      image_url: term?.image_url || null,
      video_url: term?.video_url || null,
    },
  });

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic information fields */}
          <BasicInfoFields isEditing={!!term} />
          
          {/* Category fields */}
          <CategoryFields availableTerms={availableTerms} />
          
          {/* Related terms field */}
          <RelatedTermsField availableTerms={availableTerms} currentTerm={term} />
          
          <Separator />
          
          {/* Media fields */}
          <MediaFields />
          
          {/* Form actions */}
          <FormActions 
            isSubmitting={isSubmitting} 
            onCancel={onCancel} 
            isEditing={!!term} 
          />
        </form>
      </Form>
    </FormProvider>
  );
}
