
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
          name="power_rpm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Power RPM</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g. 8000" {...field} />
              </FormControl>
              <FormDescription>
                RPM at which peak power is achieved
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        
        <FormField
          control={control}
          name="torque_rpm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Torque RPM</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g. 6500" {...field} />
              </FormControl>
              <FormDescription>
                RPM at which peak torque is achieved
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="engine_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Engine Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select engine type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Single-Cylinder">Single-Cylinder</SelectItem>
                  <SelectItem value="Parallel Twin">Parallel Twin</SelectItem>
                  <SelectItem value="V-Twin">V-Twin</SelectItem>
                  <SelectItem value="Triple">Triple</SelectItem>
                  <SelectItem value="Inline-4">Inline-4</SelectItem>
                  <SelectItem value="V4">V4</SelectItem>
                  <SelectItem value="Flat-Twin">Flat-Twin</SelectItem>
                  <SelectItem value="V6">V6</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="brake_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brake System</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select brake system" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Standard Brakes">Standard Brakes</SelectItem>
                  <SelectItem value="ABS Brakes">ABS Brakes</SelectItem>
                  <SelectItem value="Combined ABS">Combined ABS</SelectItem>
                  <SelectItem value="Advanced ABS">Advanced ABS with cornering</SelectItem>
                  <SelectItem value="CBS">Combined Brake System</SelectItem>
                  <SelectItem value="Electronic Brakes">Electronic Brake Control</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={control}
        name="top_speed_mph"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Top Speed (MPH)</FormLabel>
            <FormControl>
              <Input type="number" {...field} min={0} max={300} />
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
              <FormLabel>Has ABS (Legacy)</FormLabel>
              <FormDescription>
                Use brake system field above for new entries
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
