
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

interface BrandFoundedFieldProps {
  form: UseFormReturn<BrandFormValues>;
}

const BrandFoundedField = ({ form }: BrandFoundedFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="founded"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Founded Year</FormLabel>
          <FormControl>
            <Input type="number" placeholder="e.g. 1896" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default BrandFoundedField;
