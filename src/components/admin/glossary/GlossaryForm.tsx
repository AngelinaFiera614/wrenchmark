
import React, { useEffect } from 'react';
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
import { DraftIndicator } from './DraftIndicator';
import { useGlossaryDraft } from '@/hooks/useGlossaryDraft';

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
  const {
    saveDraft,
    loadDraft,
    clearDraft,
    hasDraft,
    isDrafting,
    setIsDrafting,
    lastSaved,
    hasUnsavedChanges,
    setHasUnsavedChanges,
  } = useGlossaryDraft(term?.id);

  // Include ID in the form values when editing
  const form = useForm<GlossaryFormValues & { id?: string }>({
    resolver: zodResolver(glossarySchema),
    defaultValues: {
      id: term?.id,
      term: term?.term || '',
      slug: term?.slug || '',
      definition: term?.definition || '',
      category: term?.category || [],
      related_terms: term?.related_terms || [],
      image_url: term?.image_url || null,
      video_url: term?.video_url || null,
    },
  });

  // Load draft on mount if available and no existing term
  useEffect(() => {
    if (!term && hasDraft()) {
      const draft = loadDraft();
      if (draft && Object.keys(draft).length > 0) {
        const shouldLoadDraft = window.confirm(
          'A draft was found for this form. Would you like to restore it?'
        );
        
        if (shouldLoadDraft) {
          Object.entries(draft).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              form.setValue(key as keyof GlossaryFormValues, value);
            }
          });
        } else {
          clearDraft();
        }
      }
    }
    setIsDrafting(true);
  }, [term, hasDraft, loadDraft, clearDraft, form, setIsDrafting]);

  // Watch form changes for auto-save
  const watchedValues = form.watch();
  
  useEffect(() => {
    if (isDrafting) {
      setHasUnsavedChanges(true);
      
      // Auto-save after 2 seconds of inactivity
      const timeout = setTimeout(() => {
        const values = form.getValues();
        // Only save if there's meaningful content
        if (values.term || values.definition || values.category?.length > 0) {
          saveDraft(values);
        }
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [watchedValues, isDrafting, saveDraft, setHasUnsavedChanges, form]);

  const handleSubmit = (values: GlossaryFormValues & { id?: string }) => {
    clearDraft(); // Clear draft on successful submit
    onSubmit(values);
  };

  const handleSaveDraft = () => {
    const values = form.getValues();
    saveDraft(values);
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      const shouldDiscard = window.confirm(
        'You have unsaved changes. Are you sure you want to discard them?'
      );
      if (shouldDiscard) {
        clearDraft();
        onCancel();
      }
    } else {
      onCancel();
    }
  };

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Draft indicator */}
          <DraftIndicator
            lastSaved={lastSaved}
            hasUnsavedChanges={hasUnsavedChanges}
            onSaveDraft={handleSaveDraft}
            className="mb-4"
          />

          {/* Basic information fields */}
          <BasicInfoFields 
            isEditing={!!term} 
            availableTerms={availableTerms}
            currentTermId={term?.id}
          />
          
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
            onCancel={handleCancel} 
            isEditing={!!term} 
          />
        </form>
      </Form>
    </FormProvider>
  );
}
