
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Motorcycle } from "@/types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { sanitizeHtml, validateSlug } from "@/services/security/inputSanitizer";
import { logAdminAction, auditActions } from "@/services/security/adminAuditLogger";
import { 
  parseWeightForDb, 
  parseLengthForDb, 
  parseVolumeForDb, 
  parseSpeedForDb,
  formatWeightForForm,
  formatLengthForForm,
  formatVolumeForForm,
  formatSpeedForForm
} from "@/utils/imperialConverters";

// Import the new form sections
import { BasicInfoFields } from "./form/BasicInfoFields";
import { PerformanceFields } from "./form/PerformanceFields";
import { DimensionsFields } from "./form/DimensionsFields";
import { AdditionalFields } from "./form/AdditionalFields";
import { FormActions } from "./form/FormActions";

// Enhanced validation schema with imperial input validation
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
  
  // Performance fields with imperial input bounds
  engine_size: z.coerce.number().min(0).max(10000).optional().or(z.literal("")),
  horsepower: z.coerce.number().min(0).max(2000).optional().or(z.literal("")),
  torque_nm: z.coerce.number().min(0).max(2000).optional().or(z.literal("")),
  top_speed_mph: z.coerce.number().min(0).max(300).optional().or(z.literal("")), // MPH input
  has_abs: z.boolean().default(false),
  
  // Dimensions fields with imperial input bounds
  weight_lbs: z.coerce.number().min(0).max(2200).optional().or(z.literal("")), // LBS input
  seat_height_in: z.coerce.number().min(20).max(48).optional().or(z.literal("")), // Inches input
  wheelbase_in: z.coerce.number().min(40).max(100).optional().or(z.literal("")), // Inches input
  ground_clearance_in: z.coerce.number().min(2).max(20).optional().or(z.literal("")), // Inches input
  fuel_capacity_gal: z.coerce.number().min(0).max(13).optional().or(z.literal("")), // Gallons input
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
      engine_size: "",
      horsepower: "",
      torque_nm: "",
      top_speed_mph: "",
      has_abs: false,
      weight_lbs: "",
      seat_height_in: "",
      wheelbase_in: "",
      ground_clearance_in: "",
      fuel_capacity_gal: "",
      difficulty_level: 3,
      status: "active",
      is_draft: true,
    },
  });

  // Helper function to safely convert formatted string to number or empty string
  const safeParseNumber = (formattedValue: string): number | "" => {
    if (!formattedValue || formattedValue.trim() === "") return "";
    const num = parseFloat(formattedValue);
    return isNaN(num) ? "" : num;
  };

  // When editing an existing motorcycle, populate form with imperial values
  useEffect(() => {
    if (motorcycle) {
      console.log("Populating form with motorcycle data:", motorcycle);
      
      form.reset({
        name: motorcycle.model || "",
        brand_id: motorcycle.brand_id || "",
        type: motorcycle.category || "Standard",
        category: motorcycle.category || "",
        production_start_year: motorcycle.year || new Date().getFullYear(),
        production_status: motorcycle.status || "active",
        base_description: motorcycle.summary || "",
        summary: motorcycle.summary || "",
        default_image_url: motorcycle.image_url || "",
        slug: motorcycle.slug || "",
        engine_size: motorcycle.engine_size || "",
        horsepower: motorcycle.horsepower || "",
        torque_nm: motorcycle.torque_nm || "",
        top_speed_mph: safeParseNumber(formatSpeedForForm(motorcycle.top_speed_kph)),
        has_abs: motorcycle.abs || false,
        weight_lbs: safeParseNumber(formatWeightForForm(motorcycle.weight_kg)),
        seat_height_in: safeParseNumber(formatLengthForForm(motorcycle.seat_height_mm)),
        wheelbase_in: safeParseNumber(formatLengthForForm(motorcycle.wheelbase_mm)),
        ground_clearance_in: safeParseNumber(formatLengthForForm(motorcycle.ground_clearance_mm)),
        fuel_capacity_gal: safeParseNumber(formatVolumeForForm(motorcycle.fuel_capacity_l)),
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
        engine_size: "",
        horsepower: "",
        torque_nm: "",
        top_speed_mph: "",
        has_abs: false,
        weight_lbs: "",
        seat_height_in: "",
        wheelbase_in: "",
        ground_clearance_in: "",
        fuel_capacity_gal: "",
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

  // Helper function to convert empty strings to null for numeric fields
  const convertEmptyToNull = (value: any) => {
    if (value === "" || value === undefined) return null;
    if (typeof value === "string" && value.trim() === "") return null;
    return value;
  };

  const onSubmit = async (data: MotorcycleFormValues) => {
    console.log("Form submission started with data:", data);
    setLoading(true);
    
    try {
      // Sanitize text inputs
      const sanitizedData = {
        ...data,
        name: sanitizeHtml(data.name),
        base_description: data.base_description ? sanitizeHtml(data.base_description) : null,
        summary: data.summary ? sanitizeHtml(data.summary) : null,
      };

      // Prepare the data for insertion/update with imperial to metric conversions
      const motorcycleData = {
        name: sanitizedData.name,
        brand_id: sanitizedData.brand_id,
        type: sanitizedData.type,
        category: sanitizedData.category || sanitizedData.type,
        production_start_year: sanitizedData.production_start_year,
        production_status: sanitizedData.production_status,
        base_description: sanitizedData.base_description,
        summary: sanitizedData.summary,
        default_image_url: sanitizedData.default_image_url || null,
        slug: sanitizedData.slug || `${sanitizedData.name.toLowerCase().replace(/\s+/g, '-')}-${sanitizedData.production_start_year}`,
        engine_size: convertEmptyToNull(sanitizedData.engine_size),
        horsepower: convertEmptyToNull(sanitizedData.horsepower),
        torque_nm: convertEmptyToNull(sanitizedData.torque_nm),
        top_speed_kph: parseSpeedForDb(sanitizedData.top_speed_mph || ""),
        has_abs: sanitizedData.has_abs,
        weight_kg: parseWeightForDb(sanitizedData.weight_lbs || ""),
        seat_height_mm: Math.round(parseLengthForDb(sanitizedData.seat_height_in || "") || 0) || null,
        wheelbase_mm: Math.round(parseLengthForDb(sanitizedData.wheelbase_in || "") || 0) || null,
        ground_clearance_mm: parseLengthForDb(sanitizedData.ground_clearance_in || ""),
        fuel_capacity_l: parseVolumeForDb(sanitizedData.fuel_capacity_gal || ""),
        difficulty_level: sanitizedData.difficulty_level,
        status: sanitizedData.status,
        is_draft: sanitizedData.is_draft,
      };

      console.log("Prepared motorcycle data for database:", motorcycleData);
      
      if (motorcycle) {
        // Update existing motorcycle
        console.log("Updating motorcycle with ID:", motorcycle.id);
        
        const { data: result, error } = await supabase
          .from('motorcycle_models')
          .update({
            ...motorcycleData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', motorcycle.id)
          .select()
          .single();
        
        if (error) {
          console.error("Update error:", error);
          throw error;
        }

        console.log("Update successful:", result);

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
        console.log("Creating new motorcycle");
        
        const { data: result, error } = await supabase
          .from('motorcycle_models')
          .insert(motorcycleData)
          .select()
          .single();
        
        if (error) {
          console.error("Insert error:", error);
          throw error;
        }

        console.log("Insert successful:", result);

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
      console.error("Submit error:", error);
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save motorcycle. Please check your input and try again.",
      });
    }
  };

  const isEditing = !!motorcycle;

  return (
    <Dialog open={open} onOpenChange={() => onClose(false)}>
      <DialogContent className="sm:max-w-[1200px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Motorcycle" : "Add New Motorcycle"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <BasicInfoFields control={form.control} />
            
            <PerformanceFields control={form.control} />
            
            <DimensionsFields control={form.control} />
            
            <AdditionalFields 
              control={form.control} 
              onGenerateSlug={generateSlug} 
            />

            <FormActions
              loading={loading}
              onCancel={() => onClose(false)}
              isEditing={isEditing}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminMotorcycleDialog;
