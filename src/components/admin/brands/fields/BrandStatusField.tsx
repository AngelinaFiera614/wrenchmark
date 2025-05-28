
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

interface BrandStatusFieldProps {
  form: UseFormReturn<BrandFormValues>;
}

const BrandStatusField = ({ form }: BrandStatusFieldProps) => {
  // Define valid status options with non-empty values
  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "defunct", label: "Defunct" },
    { value: "revived", label: "Revived" }
  ];

  return (
    <FormField
      control={form.control}
      name="status"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Status</FormLabel>
          <FormControl>
            <Select
              value={field.value || "active"}
              onValueChange={field.onChange}
              defaultValue="active"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select brand status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormDescription>
            Current operational status of the brand
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default BrandStatusField;
