
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { BrandFormValues } from "./BrandFormSchema";

interface BrandSlugFieldProps {
  form: UseFormReturn<BrandFormValues>;
}

const BrandSlugField = ({ form }: BrandSlugFieldProps) => {
  const handleGenerateSlug = () => {
    const name = form.getValues("name");
    
    if (name) {
      const slug = name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");
        
      form.setValue("slug", slug);
    }
  };

  return (
    <FormField
      control={form.control}
      name="slug"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Slug</FormLabel>
          <div className="flex gap-2">
            <FormControl>
              <Input placeholder="brand-slug" {...field} />
            </FormControl>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleGenerateSlug}
              size="sm"
            >
              Generate
            </Button>
          </div>
          <FormDescription>
            Used for URLs (e.g., kawasaki, honda)
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default BrandSlugField;
