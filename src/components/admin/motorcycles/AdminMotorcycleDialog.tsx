
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Motorcycle } from "@/types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { BasicInfoFields } from "./form/BasicInfoFields";
import { PerformanceFields } from "./form/PerformanceFields";
import { DimensionsFields } from "./form/DimensionsFields";
import { AdditionalFields } from "./form/AdditionalFields";
import { FormActions } from "./form/FormActions";
import { ComponentsFields } from "./form/ComponentsFields";

// Define Zod schema for form validation
const motorcycleFormSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.coerce.number().min(1885, "Year must be 1885 or later"),
  category: z.string().min(1, "Category is required"),
  difficulty_level: z.coerce.number().min(1).max(5),
  image_url: z.string().url({ message: "Invalid URL" }).optional().or(z.literal("")),
  
  // Performance fields
  engine: z.string().optional(),
  horsepower_hp: z.coerce.number().optional(),
  torque_nm: z.coerce.number().optional(),
  top_speed_kph: z.coerce.number().optional(),
  has_abs: z.boolean().default(false),
  
  // Dimensions fields
  weight_kg: z.coerce.number().optional(),
  seat_height_mm: z.coerce.number().optional(),
  wheelbase_mm: z.coerce.number().optional(),
  ground_clearance_mm: z.coerce.number().optional(),
  fuel_capacity_l: z.coerce.number().optional(),
  
  // Additional fields
  summary: z.string().optional(),
  slug: z.string().optional(),
  status: z.string().optional(),

  // Component fields for new schema
  engine_id: z.string().optional(),
  brake_system_id: z.string().optional(),
  frame_id: z.string().optional(),
  suspension_id: z.string().optional(),
  wheel_id: z.string().optional(),
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
  const [isNewSchema, setIsNewSchema] = useState(false);

  const form = useForm<MotorcycleFormValues>({
    resolver: zodResolver(motorcycleFormSchema),
    defaultValues: {
      make: "",
      model: "",
      year: new Date().getFullYear(),
      category: "Standard",
      difficulty_level: 3,
      image_url: "",
      engine: "",
      horsepower_hp: undefined,
      torque_nm: undefined,
      top_speed_kph: undefined,
      has_abs: false,
      weight_kg: undefined,
      seat_height_mm: undefined,
      wheelbase_mm: undefined,
      ground_clearance_mm: undefined,
      fuel_capacity_l: undefined,
      summary: "",
      slug: "",
      status: "active",
      engine_id: undefined,
      brake_system_id: undefined,
      frame_id: undefined,
      suspension_id: undefined,
      wheel_id: undefined,
    },
  });

  // When editing an existing motorcycle, populate form
  useEffect(() => {
    if (motorcycle) {
      form.reset({
        make: motorcycle.make,
        model: motorcycle.model,
        year: motorcycle.year,
        category: motorcycle.category,
        difficulty_level: motorcycle.difficulty_level,
        image_url: motorcycle.image_url,
        engine: "",
        horsepower_hp: motorcycle.horsepower_hp,
        torque_nm: motorcycle.torque_nm,
        top_speed_kph: motorcycle.top_speed_kph,
        has_abs: motorcycle.abs,
        weight_kg: motorcycle.weight_kg,
        seat_height_mm: motorcycle.seat_height_mm,
        wheelbase_mm: motorcycle.wheelbase_mm,
        ground_clearance_mm: motorcycle.ground_clearance_mm,
        fuel_capacity_l: motorcycle.fuel_capacity_l,
        summary: motorcycle.summary,
        slug: motorcycle.slug || "",
        status: motorcycle.status || "active",
      });

      // Check if the motorcycle uses the new schema
      if (motorcycle.migration_status === "migrated") {
        setIsNewSchema(true);
      }
    }
  }, [motorcycle, form]);

  const generateSlug = () => {
    const make = form.getValues("make");
    const model = form.getValues("model");
    const year = form.getValues("year");
    
    if (make && model && year) {
      const slug = `${make.toLowerCase().replace(/\s+/g, "-")}-${model.toLowerCase().replace(/\s+/g, "-")}-${year}`;
      form.setValue("slug", slug);
    }
  };

  const onSubmit = async (data: MotorcycleFormValues) => {
    setLoading(true);
    
    try {
      // Handle form submission
      console.log("Form data:", data);
      
      // Close the dialog and refresh data
      setLoading(false);
      onClose(true);
    } catch (error) {
      setLoading(false);
      console.error("Error saving motorcycle:", error);
    }
  };

  const handleMigrateToNew = () => {
    // Set flag to show new schema form fields
    setIsNewSchema(true);
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
            <div className="space-y-8">
              <BasicInfoFields control={form.control} />
              
              {!isNewSchema ? (
                // Original schema fields
                <>
                  <PerformanceFields control={form.control} />
                  <DimensionsFields control={form.control} />
                </>
              ) : (
                // New schema fields for components
                <ComponentsFields control={form.control} />
              )}
              
              <AdditionalFields control={form.control} onGenerateSlug={generateSlug} />
              
              <FormActions 
                loading={loading} 
                onCancel={() => onClose(false)} 
                isEditing={isEditing}
                onMigrateToNew={handleMigrateToNew}
                showMigrateOption={isEditing && !isNewSchema && motorcycle?.migration_status !== "migrated"}
              />
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminMotorcycleDialog;
