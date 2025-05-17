
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader } from "lucide-react";
import { GlossaryTerm, GlossaryFormValues } from "@/types/glossary";
import { glossarySchema } from "./GlossaryFormSchema";
import { supabase } from "@/integrations/supabase/client";
import ImageUpload from "@/components/admin/shared/ImageUpload";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface GlossaryFormProps {
  term: GlossaryTerm | null;
  loading: boolean;
  onSubmit: (values: GlossaryFormValues) => void;
  onCancel: () => void;
  availableTerms?: GlossaryTerm[];
}

const PREDEFINED_CATEGORIES = [
  "Parts",
  "Mechanics",
  "Slang",
  "Gear",
  "Maintenance",
  "Riding",
  "Safety",
  "Technical",
  "Performance",
  "History"
];

const GlossaryForm: React.FC<GlossaryFormProps> = ({
  term,
  loading,
  onSubmit,
  onCancel,
  availableTerms = []
}) => {
  const [newCategory, setNewCategory] = useState("");
  const [availableSlugs, setAvailableSlugs] = useState<string[]>([]);
  
  const form = useForm<GlossaryFormValues>({
    resolver: zodResolver(glossarySchema),
    defaultValues: {
      term: term?.term || "",
      slug: term?.slug || "",
      definition: term?.definition || "",
      category: term?.category || [],
      related_terms: term?.related_terms || [],
      image_url: term?.image_url || "",
      video_url: term?.video_url || "",
    },
  });

  // Effect to extract all available slugs from the available terms
  useEffect(() => {
    if (availableTerms && availableTerms.length > 0) {
      // Filter out the current term's slug
      const slugs = availableTerms
        .filter(t => !term || t.id !== term.id)
        .map(t => t.slug);
      setAvailableSlugs(slugs);
    }
  }, [availableTerms, term]);
  
  // Auto-generate slug from term
  const watchedTerm = form.watch("term");
  useEffect(() => {
    const generateSlug = async () => {
      if (watchedTerm && (!term || !form.formState.dirtyFields.slug)) {
        try {
          const { data, error } = await supabase
            .rpc('generate_slug', { input_text: watchedTerm });
            
          if (!error && data) {
            form.setValue("slug", data);
          }
        } catch (error) {
          console.error("Error generating slug:", error);
        }
      }
    };
    
    generateSlug();
  }, [watchedTerm, term, form]);

  const addCustomCategory = () => {
    if (!newCategory.trim()) return;
    
    const currentCategories = form.getValues("category") || [];
    if (!currentCategories.includes(newCategory.trim())) {
      form.setValue("category", [...currentCategories, newCategory.trim()]);
    }
    setNewCategory("");
  };
  
  const removeCategory = (categoryToRemove: string) => {
    const currentCategories = form.getValues("category") || [];
    form.setValue(
      "category",
      currentCategories.filter(cat => cat !== categoryToRemove)
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Term */}
          <FormField
            control={form.control}
            name="term"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Term</FormLabel>
                <FormControl>
                  <Input placeholder="Enter the term" {...field} />
                </FormControl>
                <FormDescription>
                  The name of the motorcycle term or concept
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Slug */}
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="term-slug" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  URL-friendly identifier (auto-generated)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Definition */}
        <FormField
          control={form.control}
          name="definition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Definition</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the term in detail..."
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide a comprehensive explanation of the term
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Categories */}
        <FormField
          control={form.control}
          name="category"
          render={() => (
            <FormItem>
              <FormLabel>Categories</FormLabel>
              
              <div className="space-y-4">
                {/* Predefined Categories */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {PREDEFINED_CATEGORIES.map((category) => (
                    <FormField
                      key={category}
                      control={form.control}
                      name="category"
                      render={({ field }) => {
                        const isSelected = field.value?.includes(category) || false;
                        return (
                          <FormItem
                            key={category}
                            className="flex items-center space-x-2 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={(checked) => {
                                  const currentValue = field.value || [];
                                  if (checked) {
                                    field.onChange([...currentValue, category]);
                                  } else {
                                    field.onChange(
                                      currentValue.filter((val) => val !== category)
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal cursor-pointer">
                              {category}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                
                {/* Custom Category Input */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add custom category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomCategory();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    onClick={addCustomCategory}
                    variant="secondary"
                    size="sm"
                  >
                    Add
                  </Button>
                </div>
                
                {/* Selected Categories Display */}
                <div className="flex flex-wrap gap-1">
                  {form.getValues("category")?.map((cat) => (
                    <Badge 
                      key={cat} 
                      variant="secondary" 
                      className="flex gap-1 items-center group hover:bg-destructive/20 transition-colors"
                    >
                      {cat}
                      <button
                        type="button"
                        onClick={() => removeCategory(cat)}
                        className="ml-1 rounded-full hover:bg-accent-teal/20 p-1 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
              
              <FormDescription>
                Select or add categories to help organize terms
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Related Terms */}
        <FormField
          control={form.control}
          name="related_terms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Related Terms</FormLabel>
              <div className="space-y-4">
                {/* Multi-select for related terms */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {availableSlugs.map((slug) => {
                    const relatedTerm = availableTerms.find(t => t.slug === slug);
                    const isSelected = field.value?.includes(slug) || false;
                    
                    return (
                      <FormItem
                        key={slug}
                        className="flex items-center space-x-2 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => {
                              const currentValue = field.value || [];
                              if (checked) {
                                field.onChange([...currentValue, slug]);
                              } else {
                                field.onChange(
                                  currentValue.filter((val) => val !== slug)
                                );
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal cursor-pointer">
                          {relatedTerm?.term || slug}
                        </FormLabel>
                      </FormItem>
                    );
                  })}
                </div>
                
                {availableSlugs.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No other terms available to link
                  </p>
                )}
              </div>
              <FormDescription>
                Link to other related glossary terms
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Media Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image Upload */}
          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value || ""}
                    onChange={field.onChange}
                    bucketName="glossary-images"
                    folderPath=""
                    maxSizeMB={2}
                    aspectRatio={16 / 9}
                  />
                </FormControl>
                <FormDescription>
                  Upload an image to illustrate the term (optional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Video URL */}
          <FormField
            control={form.control}
            name="video_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Video URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://youtube.com/watch?v=..."
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  Link to a YouTube or other video demonstration (optional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : term ? (
              "Update Term"
            ) : (
              "Add Term"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default GlossaryForm;
