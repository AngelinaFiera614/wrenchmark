
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

interface BrandHeadquartersFieldProps {
  form: UseFormReturn<BrandFormValues>;
}

const BrandHeadquartersField = ({ form }: BrandHeadquartersFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="headquarters"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Headquarters</FormLabel>
          <FormControl>
            <Input 
              placeholder="e.g., Bologna, Italy" 
              {...field} 
              value={field.value || ""}
            />
          </FormControl>
          <FormDescription>
            Current headquarters location
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default BrandHeadquartersField;
