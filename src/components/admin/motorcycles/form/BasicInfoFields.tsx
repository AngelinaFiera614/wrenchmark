
import React, { useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { getAllBrands } from "@/services/brandService";

interface BasicInfoFieldsProps {
  control: Control<any>;
  brands?: { id: string; name: string }[];
}

export function BasicInfoFields({ control, brands = [] }: BasicInfoFieldsProps) {
  const { data: fetchedBrands } = useQuery({
    queryKey: ["brands"],
    queryFn: getAllBrands,
    enabled: brands.length === 0
  });

  const brandsToUse = brands.length > 0 ? brands : (fetchedBrands || []);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Basic Information</h3>
      
      <FormField
        control={control}
        name="brand_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Brand</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select Brand" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {brandsToUse.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="model_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Model Name</FormLabel>
            <FormControl>
              <Input placeholder="e.g. Ninja ZX-6R" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="year"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Year</FormLabel>
            <FormControl>
              <Input type="number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {["Sport", "Cruiser", "Touring", "Adventure", "Naked", "Dual-sport", "Standard", "Scooter", "Off-road"].map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="image_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Image URL</FormLabel>
            <FormControl>
              <Input placeholder="https://example.com/motorcycle-image.jpg" {...field} />
            </FormControl>
            <FormDescription>
              Provide a direct URL to an image of the motorcycle
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
