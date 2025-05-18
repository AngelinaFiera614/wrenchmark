
import React from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, X } from 'lucide-react';
import { manualTypes, formSchema, type ManualFormValues } from './ManualFormSchema';
import FileUploadField from './FileUploadField';
import { Badge } from '@/components/ui/badge';

interface ManualFormProps {
  defaultValues: Partial<ManualFormValues>;
  onSubmit: (values: ManualFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const ManualForm: React.FC<ManualFormProps> = ({ defaultValues, onSubmit, onCancel, isSubmitting }) => {
  const form = useForm<ManualFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: defaultValues.title || '',
      manual_type: defaultValues.manual_type || 'owner',
      make: defaultValues.make || '',
      model: defaultValues.model || '',
      year: defaultValues.year || new Date().getFullYear(),
      file: undefined,
      tags: defaultValues.tags || [],
    },
  });

  const [tagInput, setTagInput] = React.useState('');

  const handleSubmit = async (values: ManualFormValues) => {
    await onSubmit(values);
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !form.getValues('tags')?.includes(trimmedTag)) {
      const currentTags = form.getValues('tags') || [];
      form.setValue('tags', [...currentTags, trimmedTag]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    const currentTags = form.getValues('tags') || [];
    form.setValue('tags', currentTags.filter(t => t !== tag));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Owner's Manual - Model Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="manual_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Manual Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select manual type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {manualTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="make"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Make</FormLabel>
                <FormControl>
                  <Input placeholder="Honda" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <FormControl>
                  <Input placeholder="CB500F" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="2023" 
                  {...field}
                  onChange={e => field.onChange(Number(e.target.value))} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FileUploadField name="file" label="PDF File" />

        {/* Tags Field */}
        <FormField
          control={form.control}
          name="tags"
          render={() => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.watch('tags')?.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="outline"
                    className="bg-accent-teal/10 text-accent-teal border-accent-teal/20 flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 rounded-full hover:bg-accent-teal/20 p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag (e.g., owner, service, english)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addTag}
                >
                  Add
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Upload Manual
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ManualForm;
