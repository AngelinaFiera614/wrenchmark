
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Control } from "react-hook-form";

interface TechnicalFieldsProps {
  control: Control<any>;
}

export function TechnicalFields({ control }: TechnicalFieldsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Technical Specifications</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={control}
          name="transmission"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transmission</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 6-speed manual" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="drive_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Drive Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select drive type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="chain">Chain</SelectItem>
                  <SelectItem value="belt">Belt</SelectItem>
                  <SelectItem value="shaft">Shaft</SelectItem>
                  <SelectItem value="hub">Hub</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="cooling_system"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cooling System</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select cooling type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="air">Air-cooled</SelectItem>
                  <SelectItem value="liquid">Liquid-cooled</SelectItem>
                  <SelectItem value="oil">Oil-cooled</SelectItem>
                  <SelectItem value="air-oil">Air/Oil-cooled</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="wet_weight_kg"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wet Weight (kg)</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" {...field} />
              </FormControl>
              <FormDescription>
                Weight with fluids (fuel, oil, coolant)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="recommended_license_level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recommended License Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select license level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="permit">Learner's Permit</SelectItem>
                  <SelectItem value="a1">A1 (125cc)</SelectItem>
                  <SelectItem value="a2">A2 (35kW)</SelectItem>
                  <SelectItem value="full">Full License</SelectItem>
                  <SelectItem value="msf">MSF Course</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="is_entry_level"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                Entry-level motorcycle
              </FormLabel>
              <FormDescription>
                Suitable for new riders and beginners
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}
