
import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { BrandFormValues } from "./BrandFormSchema";

interface BrandKnownForFieldProps {
  form: UseFormReturn<BrandFormValues>;
}

const BrandKnownForField = ({ form }: BrandKnownForFieldProps) => {
  const [knownForInput, setKnownForInput] = useState("");

  const handleAddKnownFor = () => {
    if (knownForInput.trim()) {
      const currentValues = form.getValues("known_for") || [];
      form.setValue("known_for", [...currentValues, knownForInput.trim()]);
      setKnownForInput("");
    }
  };

  const handleRemoveKnownFor = (index: number) => {
    const currentValues = form.getValues("known_for") || [];
    form.setValue(
      "known_for",
      currentValues.filter((_, i) => i !== index)
    );
  };

  return (
    <FormField
      control={form.control}
      name="known_for"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Known For</FormLabel>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input 
                placeholder="e.g. Sport Bikes" 
                value={knownForInput}
                onChange={(e) => setKnownForInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddKnownFor();
                  }
                }}
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleAddKnownFor}
              >
                Add
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {field.value?.map((item, index) => (
                <div 
                  key={index}
                  className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveKnownFor(index)}
                    className="text-secondary-foreground/70 hover:text-secondary-foreground focus:outline-none"
                    aria-label={`Remove ${item}`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            
            <FormDescription>
              Add tags for what this brand is known for (e.g., Sport Bikes, Cruisers)
            </FormDescription>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};

export default BrandKnownForField;
