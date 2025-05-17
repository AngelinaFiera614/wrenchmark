
import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import ImageUpload from '@/components/admin/shared/ImageUpload';
import { GlossaryFormValues } from '@/types/glossary';

export function MediaFields() {
  const { control } = useFormContext<GlossaryFormValues>();
  
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Media</h3>

      <FormField
        control={control}
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
        control={control}
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
  );
}
