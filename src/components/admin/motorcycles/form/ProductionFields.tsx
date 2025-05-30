
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface ProductionFieldsProps {
  control: Control<any>;
}

export function ProductionFields({ control }: ProductionFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="production_start_year"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Production Start Year</FormLabel>
            <FormControl>
              <Input type="number" min="1900" max="2030" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="production_end_year"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Production End Year</FormLabel>
            <FormControl>
              <Input type="number" min="1900" max="2030" {...field} />
            </FormControl>
            <FormDescription>
              Leave empty if still in production
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
