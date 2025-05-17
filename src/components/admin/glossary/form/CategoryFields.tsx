
import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MultiSelect } from '../MultiSelect';
import { GlossaryTerm, GlossaryFormValues } from '@/types/glossary';

interface CategoryFieldsProps {
  availableTerms: GlossaryTerm[];
}

export function CategoryFields({ availableTerms }: CategoryFieldsProps) {
  const [categoryInput, setCategoryInput] = useState<string>('');
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const { control, getValues, setValue } = useFormContext<GlossaryFormValues>();

  // Extract all unique categories from available terms
  useEffect(() => {
    if (availableTerms && availableTerms.length > 0) {
      const categories = Array.from(
        new Set(availableTerms.flatMap(term => term.category || []))
      ).sort();
      setAvailableCategories(categories);
    }
  }, [availableTerms]);

  // Handle adding a custom category
  const handleAddCategory = () => {
    if (categoryInput && !getValues().category.includes(categoryInput)) {
      const currentCategories = getValues().category;
      setValue('category', [...currentCategories, categoryInput]);
      setCategoryInput('');
    }
  };

  return (
    <FormField
      control={control}
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
  );
}
