
import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { BrandFormValues } from "../BrandFormSchema";

interface BrandNotesFieldProps {
  form: UseFormReturn<BrandFormValues>;
}

const BrandNotesField = ({ form }: BrandNotesFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Admin Notes</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Internal notes about this brand (admin-only)"
              className="resize-none"
              {...field}
              value={field.value || ""}
            />
          </FormControl>
          <FormDescription>
            Private notes for admin use only (not displayed to users)
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default BrandNotesField;
