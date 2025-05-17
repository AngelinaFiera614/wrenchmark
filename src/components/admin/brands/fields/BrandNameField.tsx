
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

interface BrandNameFieldProps {
  form: UseFormReturn<BrandFormValues>;
}

const BrandNameField = ({ form }: BrandNameFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Brand Name</FormLabel>
          <FormControl>
            <Input placeholder="e.g. Kawasaki" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default BrandNameField;
