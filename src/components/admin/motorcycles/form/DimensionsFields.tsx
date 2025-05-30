
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";

interface DimensionsFieldsProps {
  control: Control<any>;
}

export function DimensionsFields({ control }: DimensionsFieldsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Physical Dimensions (Imperial Units)</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={control}
          name="seat_height_in"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seat Height (inches)</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" {...field} min={20} max={48} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="weight_lbs"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Weight (lbs)</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" {...field} min={0} max={2200} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="wheelbase_in"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wheelbase (inches)</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" {...field} min={40} max={100} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="fuel_capacity_gal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fuel Capacity (gallons)</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" {...field} min={0} max={13} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="ground_clearance_in"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ground Clearance (inches)</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" {...field} min={2} max={20} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="difficulty_level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Difficulty Level (1-5)</FormLabel>
              <Select 
                onValueChange={(value) => field.onChange(parseInt(value))} 
                defaultValue={field.value.toString()}
                value={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Difficulty" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((level) => (
                    <SelectItem key={level} value={level.toString()}>
                      {level} - {level === 1 ? "Beginner" : level === 5 ? "Expert" : "Intermediate"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
