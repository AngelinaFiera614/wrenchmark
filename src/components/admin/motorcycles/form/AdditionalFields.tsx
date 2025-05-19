
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";

interface AdditionalFieldsProps {
  control: Control<any>;
  onGenerateSlug: () => void;
}

export function AdditionalFields({ control, onGenerateSlug }: AdditionalFieldsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Additional Information</h3>
      
      <FormField
        control={control}
        name="summary"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Summary</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Brief description of the motorcycle" 
                className="min-h-[100px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input placeholder="motorcycle-model-slug" {...field} />
                </FormControl>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onGenerateSlug}
                  size="sm"
                >
                  Generate
                </Button>
              </div>
              <FormDescription>
                Used for URLs (e.g., brand-model-year)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Production Status</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value || "active"}
                value={field.value || "active"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Active Production</SelectItem>
                  <SelectItem value="discontinued">Discontinued</SelectItem>
                  <SelectItem value="revived">Revived</SelectItem>
                  <SelectItem value="concept">Concept Only</SelectItem>
                  <SelectItem value="limited">Limited Production</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Current production status of this motorcycle model
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
