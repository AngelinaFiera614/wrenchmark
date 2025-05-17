
import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BrandFormValues } from "../BrandFormSchema";

interface BrandCountryFieldProps {
  form: UseFormReturn<BrandFormValues>;
}

const BrandCountryField = ({ form }: BrandCountryFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="country"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Country of Origin</FormLabel>
          <FormControl>
            <Input placeholder="e.g. Japan" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default BrandCountryField;
