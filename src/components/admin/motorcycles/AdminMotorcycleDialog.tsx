
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Motorcycle } from "@/types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { sanitizeHtml, validateSlug } from "@/services/security/inputSanitizer";
import { logAdminAction, auditActions } from "@/services/security/adminAuditLogger";

// Enhanced validation schema with security checks
const motorcycleFormSchema = z.object({
  name: z.string()
    .min(1, "Model name is required")
    .max(100, "Model name too long")
    .refine((val) => val.trim().length > 0, "Model name cannot be empty"),
  brand_id: z.string().min(1, "Brand is required"),
  type: z.string().min(1, "Type is required"),
  category: z.string().optional(),
  production_start_year: z.coerce.number()
    .min(1885, "Year must be 1885 or later")
    .max(new Date().getFullYear() + 5, "Year cannot be too far in the future"),
  production_status: z.string().default("active"),
  base_description: z.string().optional(),
  summary: z.string().optional(),
  default_image_url: z.string()
    .url({ message: "Invalid URL" })
    .optional()
    .or(z.literal("")),
  slug: z.string()
    .optional()
    .refine((val) => !val || validateSlug(val), "Invalid slug format"),
  
  // Performance fields with bounds
  engine_size: z.coerce.number().min(0).max(10000).optional(),
  horsepower: z.coerce.number().min(0).max(2000).optional(),
  torque_nm: z.coerce.number().min(0).max(2000).optional(),
  top_speed_kph: z.coerce.number().min(0).max(500).optional(),
  has_abs: z.boolean().default(false),
  
  // Dimensions fields with realistic bounds
  weight_kg: z.coerce.number().min(0).max(1000).optional(),
  seat_height_mm: z.coerce.number().min(500).max(1200).optional(),
  wheelbase_mm: z.coerce.number().min(1000).max(2500).optional(),
  ground_clearance_mm: z.coerce.number().min(50).max(500).optional(),
  fuel_capacity_l: z.coerce.number().min(0).max(50).optional(),
  difficulty_level: z.coerce.number().min(1).max(5).default(3),
  
  // Status
  status: z.string().optional(),
  is_draft: z.boolean().default(true),
});

type MotorcycleFormValues = z.infer<typeof motorcycleFormSchema>;

interface AdminMotorcycleDialogProps {
  open: boolean;
  motorcycle: Motorcycle | null;
  onClose: (refreshData?: boolean) => void;
}

const AdminMotorcycleDialog = ({
  open,
  motorcycle,
  onClose,
}: AdminMotorcycleDialogProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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

  const form = useForm<MotorcycleFormValues>({
    resolver: zodResolver(motorcycleFormSchema),
    defaultValues: {
      name: "",
      brand_id: "",
      type: "Standard",
      category: "",
      production_start_year: new Date().getFullYear(),
      production_status: "active",
      base_description: "",
      summary: "",
      default_image_url: "",
      slug: "",
      engine_size: undefined,
      horsepower: undefined,
      torque_nm: undefined,
      top_speed_kph: undefined,
      has_abs: false,
      weight_kg: undefined,
      seat_height_mm: undefined,
      wheelbase_mm: undefined,
      ground_clearance_mm: undefined,
      fuel_capacity_l: undefined,
      difficulty_level: 3,
      status: "active",
      is_draft: true,
    },
  });

  // When editing an existing motorcycle, populate form
  useEffect(() => {
    if (motorcycle) {
      form.reset({
        name: motorcycle.model,
        brand_id: motorcycle.brand_id || "",
        type: motorcycle.category || "Standard",
        category: motorcycle.category,
        production_start_year: motorcycle.year,
        production_status: motorcycle.status || "active",
        base_description: motorcycle.summary,
        summary: motorcycle.summary,
        default_image_url: motorcycle.image_url,
        slug: motorcycle.slug || "",
        engine_size: motorcycle.engine_size || undefined,
        horsepower: motorcycle.horsepower || undefined,
        torque_nm: motorcycle.torque_nm || undefined,
        top_speed_kph: motorcycle.top_speed_kph || undefined,
        has_abs: motorcycle.abs || false,
        weight_kg: motorcycle.weight_kg || undefined,
        seat_height_mm: motorcycle.seat_height_mm || undefined,
        wheelbase_mm: motorcycle.wheelbase_mm || undefined,
        ground_clearance_mm: motorcycle.ground_clearance_mm || undefined,
        fuel_capacity_l: motorcycle.fuel_capacity_l || undefined,
        difficulty_level: motorcycle.difficulty_level || 3,
        status: motorcycle.status || "active",
        is_draft: motorcycle.is_draft || false,
      });
    } else {
      // Reset for new motorcycle
      form.reset({
        name: "",
        brand_id: "",
        type: "Standard",
        category: "",
        production_start_year: new Date().getFullYear(),
        production_status: "active",
        base_description: "",
        summary: "",
        default_image_url: "",
        slug: "",
        engine_size: undefined,
        horsepower: undefined,
        torque_nm: undefined,
        top_speed_kph: undefined,
        has_abs: false,
        weight_kg: undefined,
        seat_height_mm: undefined,
        wheelbase_mm: undefined,
        ground_clearance_mm: undefined,
        fuel_capacity_l: undefined,
        difficulty_level: 3,
        status: "active",
        is_draft: true,
      });
    }
  }, [motorcycle, form]);

  const generateSlug = () => {
    const name = form.getValues("name");
    const year = form.getValues("production_start_year");
    const brand = brands?.find(b => b.id === form.getValues("brand_id"));
    
    if (name && year && brand) {
      const slug = `${brand.name.toLowerCase().replace(/\s+/g, "-")}-${name.toLowerCase().replace(/\s+/g, "-")}-${year}`;
      form.setValue("slug", slug);
    }
  };

  const onSubmit = async (data: MotorcycleFormValues) => {
    setLoading(true);
    
    try {
      // Sanitize text inputs
      const sanitizedData = {
        ...data,
        name: sanitizeHtml(data.name),
        base_description: data.base_description ? sanitizeHtml(data.base_description) : null,
        summary: data.summary ? sanitizeHtml(data.summary) : null,
      };

      // Prepare the data for insertion/update
      const motorcycleData = {
        name: sanitizedData.name,
        brand_id: sanitizedData.brand_id,
        type: sanitizedData.type,
        category: sanitizedData.category,
        production_start_year: sanitizedData.production_start_year,
        production_status: sanitizedData.production_status,
        base_description: sanitizedData.base_description,
        summary: sanitizedData.summary,
        default_image_url: sanitizedData.default_image_url || null,
        slug: sanitizedData.slug || `${sanitizedData.name.toLowerCase().replace(/\s+/g, '-')}-${sanitizedData.production_start_year}`,
        engine_size: sanitizedData.engine_size || null,
        horsepower: sanitizedData.horsepower || null,
        torque_nm: sanitizedData.torque_nm || null,
        top_speed_kph: sanitizedData.top_speed_kph || null,
        has_abs: sanitizedData.has_abs,
        weight_kg: sanitizedData.weight_kg || null,
        seat_height_mm: sanitizedData.seat_height_mm || null,
        wheelbase_mm: sanitizedData.wheelbase_mm || null,
        ground_clearance_mm: sanitizedData.ground_clearance_mm || null,
        fuel_capacity_l: sanitizedData.fuel_capacity_l || null,
        difficulty_level: sanitizedData.difficulty_level,
        status: sanitizedData.status,
        is_draft: sanitizedData.is_draft,
      };
      
      if (motorcycle) {
        // Update existing motorcycle
        const { error } = await supabase
          .from('motorcycle_models')
          .update({
            ...motorcycleData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', motorcycle.id);
        
        if (error) {
          throw error;
        }

        // Log admin action
        await logAdminAction({
          action: auditActions.MOTORCYCLE_UPDATE,
          tableName: 'motorcycle_models',
          recordId: motorcycle.id,
          newValues: motorcycleData,
        });
        
        toast({
          title: "Success",
          description: "Motorcycle updated successfully.",
        });
      } else {
        // Create new motorcycle
        const { error } = await supabase
          .from('motorcycle_models')
          .insert(motorcycleData);
        
        if (error) {
          throw error;
        }

        // Log admin action
        await logAdminAction({
          action: auditActions.MOTORCYCLE_CREATE,
          tableName: 'motorcycle_models',
          newValues: motorcycleData,
        });
        
        toast({
          title: "Success",
          description: "Motorcycle created successfully.",
        });
      }
      
      setLoading(false);
      onClose(true);
    } catch (error: any) {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save motorcycle. Please check your input and try again.",
      });
    }
  };

  const isEditing = !!motorcycle;

  return (
    <Dialog open={open} onOpenChange={() => onClose(false)}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Motorcycle" : "Add New Motorcycle"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Basic Info */}
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
                name="production_start_year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Production Year</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} min={1885} max={new Date().getFullYear() + 5} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Performance Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="engine_size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Engine Size (cc)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} min={0} max={10000} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="horsepower"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horsepower</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} min={0} max={2000} />
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
                    <FormLabel>Top Speed (kph)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} min={0} max={500} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Additional Fields */}
            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Brief description of the motorcycle" maxLength={1000} />
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
                        <Input {...field} placeholder="motorcycle-slug" maxLength={100} />
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
                name="has_abs"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Has ABS</FormLabel>
                    </div>
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
  );
};

export default AdminMotorcycleDialog;
