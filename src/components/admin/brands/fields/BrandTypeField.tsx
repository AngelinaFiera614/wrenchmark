
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
  // Define valid brand type options with non-empty values
  const brandTypeOptions = [
    { value: "mass", label: "Mass Production" },
    { value: "boutique", label: "Boutique" },
    { value: "revived", label: "Revived" },
    { value: "oem", label: "OEM" }
  ];

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
                {brandTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
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
