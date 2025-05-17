
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

interface BrandFoundedCityFieldProps {
  form: UseFormReturn<BrandFormValues>;
}

const BrandFoundedCityField = ({ form }: BrandFoundedCityFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="founded_city"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Founded City</FormLabel>
          <FormControl>
            <Input 
              placeholder="e.g., Tokyo, Milan, Milwaukee" 
              {...field} 
              value={field.value || ""}
              onChange={(e) => {
                const value = e.target.value;
                field.onChange(value === "" ? null : value);
              }}
            />
          </FormControl>
          <FormDescription>
            The city where the brand was originally founded
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default BrandFoundedCityField;
