import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader, Zap } from "lucide-react";
import { useModelAutofill } from "@/hooks/useModelAutofill";
import { useAuth } from "@/context/auth";
import ModelSuggestionsDialog from "./ModelSuggestionsDialog";

// Enhanced validation schema
const modelFormSchema = z.object({
  name: z.string().min(1, "Model name is required").max(100, "Model name too long"),
  brand_id: z.string().min(1, "Brand is required"),
  type: z.string().min(1, "Type is required"),
  production_start_year: z.coerce.number()
    .min(1885, "Year must be 1885 or later")
    .max(new Date().getFullYear() + 5, "Year cannot be too far in the future"),
  production_end_year: z.coerce.number().optional().or(z.literal("")),
  production_status: z.string().default("active"),
  base_description: z.string().optional(),
  slug: z.string().optional(),
  default_image_url: z.string().url({ message: "Invalid URL" }).optional().or(z.literal("")),
});

type ModelFormValues = z.infer<typeof modelFormSchema>;

interface AdminModelDialogProps {
  open: boolean;
  model: any | null;
  onClose: (refreshData?: boolean) => void;
}

const AdminModelDialog = ({
  open,
  model,
  onClose,
}: AdminModelDialogProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const isAdmin = profile?.is_admin;

  // Autofill functionality
  const { isLoading: isFetching, suggestions, fetchModelInfo, clearSuggestions } = useModelAutofill();
  const [showSuggestionsDialog, setShowSuggestionsDialog] = useState(false);

  // Fetch brands for the dropdown
  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const form = useForm<ModelFormValues>({
    resolver: zodResolver(modelFormSchema),
    defaultValues: {
      name: "",
      brand_id: "",
      type: "Standard",
      production_start_year: new Date().getFullYear(),
      production_end_year: "",
      production_status: "active",
      base_description: "",
      slug: "",
      default_image_url: "",
    },
  });

  // When editing an existing model, populate form
  useEffect(() => {
    if (model) {
      const brandId = model.brands?.id || model.brand_id || "";
      
      form.reset({
        name: model.name || "",
        brand_id: brandId,
        type: model.type || "Standard",
        production_start_year: model.production_start_year || new Date().getFullYear(),
        production_end_year: model.production_end_year || "",
        production_status: model.production_status || "active",
        base_description: model.base_description || "",
        slug: model.slug || "",
        default_image_url: model.default_image_url || "",
      });
    } else {
      form.reset({
        name: "",
        brand_id: "",
        type: "Standard",
        production_start_year: new Date().getFullYear(),
        production_end_year: "",
        production_status: "active",
        base_description: "",
        slug: "",
        default_image_url: "",
      });
    }
  }, [model, form]);

  const generateSlug = () => {
    const name = form.getValues("name");
    const year = form.getValues("production_start_year");
    const brand = brands?.find(b => b.id === form.getValues("brand_id"));
    
    if (name && year && brand) {
      const slug = `${brand.name.toLowerCase().replace(/\s+/g, "-")}-${name.toLowerCase().replace(/\s+/g, "-")}-${year}`;
      form.setValue("slug", slug);
    }
  };

  const handleFetchModelInfo = async () => {
    const formData = form.getValues();
    const selectedBrand = brands?.find(b => b.id === formData.brand_id);
    
    if (!selectedBrand || !formData.name) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please select a brand and enter a model name before fetching suggestions.",
      });
      return;
    }

    // Create a temporary model object for the fetch
    const tempModel = {
      id: model?.id || 'temp',
      name: formData.name,
      brand: { name: selectedBrand.name },
      ignore_autofill: model?.ignore_autofill || false
    };

    const success = await fetchModelInfo(tempModel);
    if (success && suggestions) {
      setShowSuggestionsDialog(true);
    }
  };

  const handleSuggestionsApplied = (appliedFields: Record<string, any>) => {
    // Apply the selected suggestions to the form
    Object.keys(appliedFields).forEach(fieldName => {
      const value = appliedFields[fieldName];
      
      // Map autofill field names to form field names if needed
      const formFieldMap: Record<string, string> = {
        'engine_size': 'engine_size',
        'horsepower': 'horsepower', 
        'torque_nm': 'torque_nm',
        'top_speed_kph': 'top_speed_kph',
        'weight_kg': 'weight_kg',
        'seat_height_mm': 'seat_height_mm',
        'fuel_capacity_l': 'fuel_capacity_l',
        'has_abs': 'has_abs',
        'base_description': 'base_description',
        'default_image_url': 'default_image_url',
        'production_start_year': 'production_start_year',
        'production_end_year': 'production_end_year',
        'type': 'type'
      };

      const formFieldName = formFieldMap[fieldName] || fieldName;
      
      // Only update fields that exist in our form
      if (form.getValues().hasOwnProperty(formFieldName)) {
        form.setValue(formFieldName as any, value);
      }
    });

    clearSuggestions();
    setShowSuggestionsDialog(false);
    
    toast({
      title: "Fields Updated",
      description: `Successfully applied ${Object.keys(appliedFields).length} suggested values to the form.`,
    });
  };

  const onSubmit = async (data: ModelFormValues) => {
    setLoading(true);
    
    try {
      const modelData = {
        name: data.name,
        brand_id: data.brand_id,
        type: data.type,
        production_start_year: data.production_start_year,
        production_end_year: data.production_end_year || null,
        production_status: data.production_status,
        base_description: data.base_description || null,
        slug: data.slug || `${data.name.toLowerCase().replace(/\s+/g, '-')}-${data.production_start_year}`,
        default_image_url: data.default_image_url || null,
      };
      
      if (model) {
        // Update existing model
        const { data: result, error } = await supabase
          .from('motorcycle_models')
          .update({
            ...modelData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', model.id)
          .select()
          .single();
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Model updated successfully.",
        });
      } else {
        // Create new model
        const { data: result, error } = await supabase
          .from('motorcycle_models')
          .insert(modelData)
          .select()
          .single();
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Model created successfully.",
        });
      }
      
      setLoading(false);
      onClose(true);
    } catch (error: any) {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save model. Please try again.",
      });
    }
  };

  const isEditing = !!model;
  const canFetchInfo = isAdmin && !isFetching && form.getValues("name") && form.getValues("brand_id");
  const isAutofillDisabled = model?.ignore_autofill;

  return (
    <>
      <Dialog open={open} onOpenChange={() => onClose(false)}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>
                {isEditing ? "Edit Model" : "Add New Model"}
              </DialogTitle>
              
              {/* Fetch Model Info Button */}
              {isAdmin && isEditing && (
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    onClick={handleFetchModelInfo}
                    disabled={!canFetchInfo || isAutofillDisabled}
                    className="bg-accent-teal text-black hover:bg-accent-teal/80"
                    size="sm"
                  >
                    {isFetching ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2" />
                        Fetching...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-4 w-4" />
                        Fetch Model Info
                      </>
                    )}
                  </Button>
                  {isAutofillDisabled && (
                    <span className="text-xs text-muted-foreground">
                      Autofill disabled
                    </span>
                  )}
                </div>
              )}
            </div>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Ninja 300" maxLength={100} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="brand_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a brand" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {brands?.map((brand) => (
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
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Sport">Sport</SelectItem>
                          <SelectItem value="Cruiser">Cruiser</SelectItem>
                          <SelectItem value="Touring">Touring</SelectItem>
                          <SelectItem value="Adventure">Adventure</SelectItem>
                          <SelectItem value="Naked">Naked</SelectItem>
                          <SelectItem value="Dual-sport">Dual-sport</SelectItem>
                          <SelectItem value="Standard">Standard</SelectItem>
                          <SelectItem value="Scooter">Scooter</SelectItem>
                          <SelectItem value="Off-road">Off-road</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="production_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Production Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="discontinued">Discontinued</SelectItem>
                          <SelectItem value="concept">Concept</SelectItem>
                          <SelectItem value="prototype">Prototype</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="production_start_year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Production Start Year</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} min={1885} max={new Date().getFullYear() + 5} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="production_end_year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Production End Year (Optional)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} min={1885} max={new Date().getFullYear() + 5} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="base_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Brief description of the model" maxLength={1000} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input {...field} placeholder="model-slug" maxLength={100} />
                        </FormControl>
                        <Button type="button" variant="outline" onClick={generateSlug}>
                          Generate
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="default_image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Image URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => onClose(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : isEditing ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Suggestions Dialog */}
      {suggestions && (
        <ModelSuggestionsDialog
          open={showSuggestionsDialog}
          onClose={() => setShowSuggestionsDialog(false)}
          model={{
            id: model?.id || 'temp',
            name: form.getValues("name"),
            brand: brands?.find(b => b.id === form.getValues("brand_id")),
            ignore_autofill: model?.ignore_autofill || false
          }}
          suggestedData={suggestions.suggested_data}
          source={suggestions.source}
          onApplied={handleSuggestionsApplied}
        />
      )}
    </>
  );
};

export default AdminModelDialog;
