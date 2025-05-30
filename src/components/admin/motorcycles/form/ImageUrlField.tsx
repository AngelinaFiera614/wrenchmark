
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface ImageUrlFieldProps {
  control: Control<any>;
}

export function ImageUrlField({ control }: ImageUrlFieldProps) {
  return (
    <FormField
      control={control}
      name="default_image_url"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Default Image URL</FormLabel>
          <FormControl>
            <Input placeholder="https://example.com/image.jpg" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
