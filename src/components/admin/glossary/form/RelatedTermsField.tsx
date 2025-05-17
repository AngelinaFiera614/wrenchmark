
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { MultiSelect } from '../MultiSelect';
import { GlossaryTerm, GlossaryFormValues } from '@/types/glossary';

interface RelatedTermsFieldProps {
  availableTerms: GlossaryTerm[];
  currentTerm: GlossaryTerm | null;
}

export function RelatedTermsField({ availableTerms, currentTerm }: RelatedTermsFieldProps) {
  const [relatedTermOptions, setRelatedTermOptions] = useState<{ value: string; label: string }[]>([]);
  const { control } = useFormContext<GlossaryFormValues>();

  // Transform terms to options for the related terms multi-select
  useEffect(() => {
    if (availableTerms && availableTerms.length > 0) {
      const options = availableTerms
        .filter(t => !currentTerm || t.id !== currentTerm.id) // Filter out the current term
        .map(t => ({
          value: t.slug,
          label: t.term
        }));
      setRelatedTermOptions(options);
    }
  }, [availableTerms, currentTerm]);

  return (
    <FormField
      control={control}
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
  );
}
