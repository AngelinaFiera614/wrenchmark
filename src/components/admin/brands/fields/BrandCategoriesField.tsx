
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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { BrandFormValues } from "../BrandFormSchema";

interface BrandCategoriesFieldProps {
  form: UseFormReturn<BrandFormValues>;
}

const BrandCategoriesField = ({ form }: BrandCategoriesFieldProps) => {
  const [value, setValue] = React.useState("");
  
  // Ensure categories is always an array
  React.useEffect(() => {
    const currentCategories = form.getValues().categories;
    if (!currentCategories) {
      form.setValue("categories", []);
    }
  }, [form]);

  const handleAddCategory = () => {
    const trimmedValue = value.trim();
    if (trimmedValue) {
      const currentCategories = form.getValues().categories || [];
      // Check if category already exists to avoid duplicates
      if (!currentCategories.includes(trimmedValue)) {
        form.setValue("categories", [...currentCategories, trimmedValue]);
      }
      setValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCategory();
    }
  };

  const handleRemoveCategory = (categoryToRemove: string) => {
    const currentCategories = form.getValues().categories || [];
    form.setValue(
      "categories",
      currentCategories.filter(category => category !== categoryToRemove)
    );
  };

  return (
    <FormField
      control={form.control}
      name="categories"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Categories</FormLabel>
          <div className="grid gap-2">
            <div className="flex flex-wrap gap-1">
              {(field.value || []).map((category) => (
                <Badge
                  key={category}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {category}
                  <button
                    type="button"
                    className="rounded-full outline-none hover:bg-muted-foreground/10"
                    onClick={() => handleRemoveCategory(category)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <FormControl>
                <Input
                  placeholder="Add category..."
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </FormControl>
              <button
                type="button"
                className="rounded bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary/80"
                onClick={handleAddCategory}
              >
                Add
              </button>
            </div>
          </div>
          <FormDescription>
            Extended categorization tags for internal use (e.g., "Scooter", "Touring")
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default BrandCategoriesField;
