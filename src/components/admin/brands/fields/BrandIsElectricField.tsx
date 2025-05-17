
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
import { Switch } from "@/components/ui/switch";
import { BrandFormValues } from "../BrandFormSchema";

interface BrandIsElectricFieldProps {
  form: UseFormReturn<BrandFormValues>;
}

const BrandIsElectricField = ({ form }: BrandIsElectricFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="is_electric"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <div className="space-y-0.5">
            <FormLabel>Electric Brand</FormLabel>
            <FormDescription>
              Brand exclusively makes electric motorcycles
            </FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default BrandIsElectricField;
