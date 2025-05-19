
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
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Motorcycle } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { BasicInfoFields } from "./form/BasicInfoFields";
import { PerformanceFields } from "./form/PerformanceFields";
import { DimensionsFields } from "./form/DimensionsFields";
import { AdditionalFields } from "./form/AdditionalFields";
import { FormActions } from "./form/FormActions";

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
              <BasicInfoFields control={form.control} brands={brands} />
              
              {/* Performance Specs */}
              <PerformanceFields control={form.control} />
            </div>
            
            {/* Physical Dimensions */}
            <DimensionsFields control={form.control} />
            
            {/* Additional Information */}
            <AdditionalFields 
              control={form.control} 
              onGenerateSlug={handleGenerateSlug} 
            />
              
            <DialogFooter>
              <FormActions 
                loading={loading} 
                onCancel={() => onClose()} 
                isEditing={motorcycle !== null} 
              />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminMotorcycleDialog;
