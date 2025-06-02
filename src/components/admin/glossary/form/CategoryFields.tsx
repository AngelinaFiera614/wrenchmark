
import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus, Sparkles } from 'lucide-react';
import { GlossaryFormValues, GlossaryTerm } from '@/types/glossary';
import { useTermSuggestions } from '@/hooks/useTermSuggestions';

interface CategoryFieldsProps {
  availableTerms: GlossaryTerm[];
}

export function CategoryFields({ availableTerms }: CategoryFieldsProps) {
  const { watch, setValue, getValues } = useFormContext<GlossaryFormValues>();
  const [newCategory, setNewCategory] = React.useState('');

  const termValue = watch('term') || '';
  const definitionValue = watch('definition') || '';
  const currentCategories = watch('category') || [];

  // Get category suggestions
  const { categorySuggestions } = useTermSuggestions(
    termValue, 
    definitionValue, 
    availableTerms
  );

  // Get existing categories from all terms
  const existingCategories = React.useMemo(() => {
    const categories = new Set<string>();
    availableTerms.forEach(term => {
      term.category?.forEach(cat => categories.add(cat));
    });
    return Array.from(categories).sort();
  }, [availableTerms]);

  const addCategory = (category: string) => {
    const trimmed = category.trim().toLowerCase();
    if (trimmed && !currentCategories.includes(trimmed)) {
      setValue('category', [...currentCategories, trimmed]);
    }
    setNewCategory('');
  };

  const removeCategory = (categoryToRemove: string) => {
    setValue('category', currentCategories.filter(cat => cat !== categoryToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newCategory.trim()) {
      e.preventDefault();
      addCategory(newCategory);
    }
  };

  // Filter suggestions to show only those not already added
  const filteredSuggestions = categorySuggestions.filter(
    suggestion => !currentCategories.includes(suggestion)
  );

  const popularCategories = existingCategories
    .filter(cat => !currentCategories.includes(cat))
    .slice(0, 8);

  return (
    <FormField
      name="category"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Categories</FormLabel>
          <FormControl>
            <div className="space-y-3">
              {/* Current categories */}
              {currentCategories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {currentCategories.map((category) => (
                    <Badge key={category} variant="default" className="gap-1">
                      {category}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 hover:bg-transparent"
                        onClick={() => removeCategory(category)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Add new category */}
              <div className="flex gap-2">
                <Input
                  placeholder="Add category..."
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addCategory(newCategory)}
                  disabled={!newCategory.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Smart suggestions */}
              {filteredSuggestions.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Sparkles className="h-4 w-4" />
                    Suggested categories:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {filteredSuggestions.slice(0, 6).map((suggestion) => (
                      <Button
                        key={suggestion}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addCategory(suggestion)}
                        className="h-7 text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular existing categories */}
              {popularCategories.length > 0 && filteredSuggestions.length === 0 && (
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    Popular categories:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {popularCategories.map((category) => (
                      <Button
                        key={category}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addCategory(category)}
                        className="h-7 text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </FormControl>
          <FormDescription>
            Add relevant categories to help organize and filter terms.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
