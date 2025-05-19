
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Control } from "react-hook-form";

interface PerformanceFieldsProps {
  control: Control<any>;
}

export function PerformanceFields({ control }: PerformanceFieldsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Performance Specifications</h3>
      
      <FormField
        control={control}
        name="engine"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Engine</FormLabel>
            <FormControl>
              <Input placeholder="e.g. 649cc Inline-4" {...field} />
            </FormControl>
            <FormDescription>
              Engine description (e.g. 649cc Inline-4, 1103cc V4)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="horsepower_hp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Horsepower (HP)</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="torque_nm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Torque (Nm)</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={control}
        name="top_speed_kph"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Top Speed (KPH)</FormLabel>
            <FormControl>
              <Input type="number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="has_abs"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>ABS</FormLabel>
              <FormDescription>
                Does this motorcycle have ABS?
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
