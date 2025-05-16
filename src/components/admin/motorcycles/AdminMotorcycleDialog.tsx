
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Motorcycle } from "@/types";
import { supabase } from "@/integrations/supabase/client";

// Form schema
const motorcycleSchema = z.object({
  brand_id: z.string().uuid(),
  model_name: z.string().min(1, "Model name is required"),
  year: z.coerce.number().int().min(1885, "Invalid year").max(2100, "Invalid year"),
  category: z.string().min(1, "Category is required"),
  image_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  engine: z.string().optional(),
  horsepower_hp: z.coerce.number().optional(),
  torque_nm: z.coerce.number().optional(),
  top_speed_kph: z.coerce.number().optional(),
  seat_height_mm: z.coerce.number().int().optional(),
  weight_kg: z.coerce.number().optional(),
  wheelbase_mm: z.coerce.number().int().optional(),
  fuel_capacity_l: z.coerce.number().optional(),
  has_abs: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  summary: z.string().optional(),
  difficulty_level: z.coerce.number().int().min(1).max(5).default(1),
  slug: z.string().min(1, "Slug is required"),
});

type FormValues = z.infer<typeof motorcycleSchema>;

interface AdminMotorcycleDialogProps {
  open: boolean;
  motorcycle: Motorcycle | null;
  onClose: (refreshData?: boolean) => void;
}

const AdminMotorcycleDialog: React.FC<AdminMotorcycleDialogProps> = ({ 
  open, 
  motorcycle, 
  onClose 
}) => {
  const { toast } = useToast();
  const [brands, setBrands] = React.useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = React.useState(false);
  
  // Set up form
  const form = useForm<FormValues>({
    resolver: zodResolver(motorcycleSchema),
    defaultValues: {
      brand_id: "",
      model_name: "",
      year: new Date().getFullYear(),
      category: "Standard",
      image_url: "",
      engine: "",
      horsepower_hp: undefined,
      torque_nm: undefined,
      top_speed_kph: undefined,
      seat_height_mm: undefined,
      weight_kg: undefined,
      wheelbase_mm: undefined,
      fuel_capacity_l: undefined,
      has_abs: false,
      tags: [],
      summary: "",
      difficulty_level: 1,
      slug: "",
    },
  });

  // Fetch brands for the dropdown
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const { data, error } = await supabase
          .from('brands')
          .select('id, name')
          .order('name', { ascending: true });
        
        if (error) throw error;
        setBrands(data || []);
      } catch (error) {
        console.error("Error fetching brands:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load brands. Please try again.",
        });
      }
    };

    if (open) {
      fetchBrands();
    }
  }, [open, toast]);

  // Populate form when editing
  useEffect(() => {
    if (motorcycle) {
      const tagsArray = motorcycle.style_tags || [];
      
      form.reset({
        brand_id: motorcycle.brand_id || "",
        model_name: motorcycle.model,
        year: motorcycle.year,
        category: motorcycle.category,
        image_url: motorcycle.image_url,
        engine: `${motorcycle.engine_size}cc`, // Convert to string format
        horsepower_hp: motorcycle.horsepower,
        torque_nm: motorcycle.torque_nm,
        top_speed_kph: motorcycle.top_speed_kph,
        seat_height_mm: motorcycle.seat_height_mm,
        weight_kg: motorcycle.weight_kg,
        wheelbase_mm: motorcycle.wheelbase_mm,
        fuel_capacity_l: motorcycle.fuel_capacity_l,
        has_abs: motorcycle.abs,
        tags: tagsArray,
        summary: motorcycle.summary,
        difficulty_level: motorcycle.difficulty_level,
        slug: motorcycle.slug || `${motorcycle.make}-${motorcycle.model}-${motorcycle.year}`.toLowerCase().replace(/\s+/g, "-"),
      });
    } else {
      form.reset({
        brand_id: "",
        model_name: "",
        year: new Date().getFullYear(),
        category: "Standard",
        image_url: "",
        engine: "",
        horsepower_hp: undefined,
        torque_nm: undefined,
        top_speed_kph: undefined,
        seat_height_mm: undefined,
        weight_kg: undefined,
        wheelbase_mm: undefined,
        fuel_capacity_l: undefined,
        has_abs: false,
        tags: [],
        summary: "",
        difficulty_level: 1,
        slug: "",
      });
    }
  }, [motorcycle, form]);

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      // Format tags as an array
      const formattedTags = values.tags || [];
      
      // Generate slug if empty
      let slug = values.slug;
      if (!slug) {
        // Find brand name for slug
        const brand = brands.find(b => b.id === values.brand_id);
        slug = `${brand?.name || "unknown"}-${values.model_name}-${values.year}`
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]/g, "");
      }

      const motorcycleData = {
        brand_id: values.brand_id,
        model_name: values.model_name,
        year: values.year,
        category: values.category,
        image_url: values.image_url || null,
        engine: values.engine || null,
        horsepower_hp: values.horsepower_hp || null,
        torque_nm: values.torque_nm || null,
        top_speed_kph: values.top_speed_kph || null,
        seat_height_mm: values.seat_height_mm || null,
        weight_kg: values.weight_kg || null,
        wheelbase_mm: values.wheelbase_mm || null,
        fuel_capacity_l: values.fuel_capacity_l || null,
        has_abs: values.has_abs,
        tags: formattedTags,
        summary: values.summary || null,
        difficulty_level: values.difficulty_level,
        slug: slug,
      };

      let error;
      
      if (motorcycle) {
        // Update existing motorcycle
        const { error: updateError } = await supabase
          .from('motorcycles')
          .update(motorcycleData)
          .eq('id', motorcycle.id);
          
        error = updateError;
        
        if (!error) {
          toast({
            title: "Motorcycle updated",
            description: `${values.model_name} has been updated successfully.`,
          });
        }
      } else {
        // Create new motorcycle
        const { error: insertError } = await supabase
          .from('motorcycles')
          .insert([motorcycleData]);
          
        error = insertError;
        
        if (!error) {
          toast({
            title: "Motorcycle added",
            description: `${values.model_name} has been added successfully.`,
          });
        }
      }

      if (error) throw error;
      
      onClose(true); // Close and refresh data
      
    } catch (error) {
      console.error("Error saving motorcycle:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save motorcycle. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSlug = () => {
    const brandName = brands.find(b => b.id === form.getValues("brand_id"))?.name || "";
    const modelName = form.getValues("model_name");
    const year = form.getValues("year");
    
    if (brandName && modelName) {
      const slug = `${brandName}-${modelName}-${year}`
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");
        
      form.setValue("slug", slug);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {motorcycle ? "Edit Motorcycle" : "Add New Motorcycle"}
          </DialogTitle>
          <DialogDescription>
            {motorcycle 
              ? "Update the details for this motorcycle."
              : "Fill in the details to add a new motorcycle to the database."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>
                
                <FormField
                  control={form.control}
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
                          {brands.map((brand) => (
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
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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
              
              {/* Performance Specs */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Performance Specifications</h3>
                
                <FormField
                  control={form.control}
                  name="engine"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Engine</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 649cc Inline-4" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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
            </div>
            
            {/* Physical Dimensions */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Physical Dimensions</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="seat_height_mm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seat Height (mm)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="weight_kg"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (kg)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="wheelbase_mm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wheelbase (mm)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="fuel_capacity_l"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fuel Capacity (L)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
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
            
            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Additional Information</h3>
              
              <FormField
                control={form.control}
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
                  control={form.control}
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
                          onClick={handleGenerateSlug}
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
              </div>
            </div>
              
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onClose()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : motorcycle ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminMotorcycleDialog;
