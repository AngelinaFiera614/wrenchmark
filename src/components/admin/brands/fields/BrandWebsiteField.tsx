
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
import { Input } from "@/components/ui/input";
import { BrandFormValues } from "../BrandFormSchema";

interface BrandWebsiteFieldProps {
  form: UseFormReturn<BrandFormValues>;
}

const BrandWebsiteField = ({ form }: BrandWebsiteFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="website_url"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Website URL</FormLabel>
          <FormControl>
            <Input 
              type="url"
              placeholder="https://www.example.com" 
              {...field} 
              value={field.value || ""}
            />
          </FormControl>
          <FormDescription>
            Official brand website URL (include https://)
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default BrandWebsiteField;
