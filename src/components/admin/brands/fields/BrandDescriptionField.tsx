
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

interface BrandDescriptionFieldProps {
  form: UseFormReturn<BrandFormValues>;
}

const BrandDescriptionField = ({ form }: BrandDescriptionFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Brief description of the brand (1-2 lines)"
              className="resize-none"
              {...field}
              value={field.value || ""}
            />
          </FormControl>
          <FormDescription>
            A short summary of the brand (max 200 characters)
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default BrandDescriptionField;
