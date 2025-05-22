
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { BrandFormValues } from "../BrandFormSchema";

interface BrandHistoryFieldProps {
  form: UseFormReturn<BrandFormValues>;
}

export default function BrandHistoryField({ form }: BrandHistoryFieldProps) {
  return (
    <FormField
      control={form.control}
      name="brand_history"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Brand History</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Enter detailed brand history (Markdown supported)"
              className="min-h-[200px]"
              {...field}
              value={field.value || ""}
            />
          </FormControl>
          <FormDescription>
            Detailed history of the brand. Markdown is supported for formatting.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
