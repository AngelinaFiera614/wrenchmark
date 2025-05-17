
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BrandFormValues } from "../BrandFormSchema";

interface BrandTypeFieldProps {
  form: UseFormReturn<BrandFormValues>;
}

const BrandTypeField = ({ form }: BrandTypeFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="brand_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Brand Type</FormLabel>
          <FormControl>
            <Select
              value={field.value || "mass"}
              onValueChange={field.onChange}
              defaultValue="mass"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select brand type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mass">Mass Production</SelectItem>
                <SelectItem value="boutique">Boutique</SelectItem>
                <SelectItem value="revived">Revived</SelectItem>
                <SelectItem value="oem">OEM</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormDescription>
            Classification of the brand's market position
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default BrandTypeField;
