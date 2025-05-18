
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { manualTypes } from './ManualFormSchema';
import ManualBucketBrowser, { BucketFile } from './ManualBucketBrowser';
import { useManualBucket } from '@/hooks/useManualBucket';

// Schema specifically for importing existing manual files
const importSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  manual_type: z.enum(['owner', 'service', 'wiring']),
  make: z.string().min(2, 'Make must be at least 2 characters'),
  model: z.string().min(1, 'Model must be at least 1 character'),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 2),
  file_url: z.string().url('Invalid file URL'),
  file_name: z.string(),
  file_size_mb: z.number().optional(),
});

export type ImportManualFormValues = z.infer<typeof importSchema>;

interface ImportManualFormProps {
  onSubmit: (values: ImportManualFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const ImportManualForm: React.FC<ImportManualFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  const [selectedFile, setSelectedFile] = useState<BucketFile | null>(null);
  const { parseFileDetails } = useManualBucket();
  
  const form = useForm<ImportManualFormValues>({
    resolver: zodResolver(importSchema),
    defaultValues: {
      title: '',
      manual_type: 'owner',
      make: '',
      model: '',
      year: new Date().getFullYear(),
      file_url: '',
      file_name: '',
      file_size_mb: 0
    },
  });

  // Update form when a file is selected
  useEffect(() => {
    if (selectedFile) {
      // Calculate size in MB
      const fileSizeMB = selectedFile.size / (1024 * 1024);
      
      // Parse file name for motorcycle details
      const { make, model, year } = parseFileDetails(selectedFile.name);
      
      // Generate a title from the file name
      const baseName = selectedFile.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      const titleCase = baseName
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      
      // Guess manual type based on filename
      let manualType = 'owner';
      if (selectedFile.name.toLowerCase().includes('service') || 
          selectedFile.name.toLowerCase().includes('repair')) {
        manualType = 'service';
      } else if (selectedFile.name.toLowerCase().includes('wiring') || 
                selectedFile.name.toLowerCase().includes('diagram')) {
        manualType = 'wiring';
      }
      
      // Update form
      form.setValue('title', titleCase);
      form.setValue('manual_type', manualType as any);
      form.setValue('make', make);
      form.setValue('model', model);
      if (year) {
        form.setValue('year', year);
      }
      form.setValue('file_url', selectedFile.url);
      form.setValue('file_name', selectedFile.name);
      form.setValue('file_size_mb', parseFloat(fileSizeMB.toFixed(2)));
    }
  }, [selectedFile]);

  const handleSubmit = async (values: ImportManualFormValues) => {
    await onSubmit(values);
  };

  const handleFileSelect = (file: BucketFile) => {
    setSelectedFile(file);
  };

  return (
    <div className="space-y-4">
      {!selectedFile ? (
        <ManualBucketBrowser onSelect={handleFileSelect} />
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="flex items-center justify-between bg-muted/50 p-2 rounded mb-4">
              <div className="text-sm">
                <span className="font-medium">Selected file:</span> {selectedFile.name}
              </div>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedFile(null)}
              >
                Change
              </Button>
            </div>
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    value={field.value}
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
                      <Input {...field} />
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
                      <Input {...field} />
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
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <input type="hidden" {...form.register('file_url')} />
            <input type="hidden" {...form.register('file_name')} />
            <input type="hidden" {...form.register('file_size_mb')} />

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" type="button" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Import Manual
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default ImportManualForm;
