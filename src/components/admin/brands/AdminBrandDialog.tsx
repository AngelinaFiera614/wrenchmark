
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Brand } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { BrandFormValues } from "./BrandFormSchema";
import BrandForm from "./BrandForm";

interface AdminBrandDialogProps {
  open: boolean;
  brand: Brand | null;
  onClose: (refreshData?: boolean) => void;
}

const AdminBrandDialog: React.FC<AdminBrandDialogProps> = ({ 
  open, 
  brand, 
  onClose 
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  
  const handleSubmit = async (values: BrandFormValues) => {
    setLoading(true);
    try {
      console.log("Submitting brand data:", values);
      
      // Clean data before sending to database
      const brandData = {
        name: values.name,
        country: values.country || null,
        founded: values.founded || null,
        logo_url: values.logo_url || null,
        known_for: values.known_for || [],
        slug: values.slug,
        description: values.description || null,
        founded_city: values.founded_city || null,
        headquarters: values.headquarters || null,
        status: values.status || "active",
        brand_type: values.brand_type || "mass",
        is_electric: values.is_electric || false,
        website_url: values.website_url || null,
        categories: Array.isArray(values.categories) ? values.categories : [],
        notes: values.notes || null,
      };

      console.log("Cleaned brand data for database:", brandData);

      let response;
      
      if (brand) {
        // Update existing brand
        console.log("Updating existing brand with ID:", brand.id);
        response = await supabase
          .from('brands')
          .update(brandData)
          .eq('id', brand.id);
          
        if (response.error) {
          console.error("Supabase update error:", response.error);
          throw response.error;
        }
        
        console.log("Brand updated successfully:", response);
        
        toast({
          title: "Brand updated",
          description: `${values.name} has been updated successfully.`,
        });
      } else {
        // Create new brand
        console.log("Creating new brand");
        response = await supabase
          .from('brands')
          .insert([brandData]);
          
        if (response.error) {
          console.error("Supabase insert error:", response.error);
          throw response.error;
        }
        
        console.log("Brand created successfully:", response);
        
        toast({
          title: "Brand added",
          description: `${values.name} has been added successfully.`,
        });
      }
      
      // Close dialog and refresh data
      onClose(true); 
      
    } catch (error: any) {
      console.error("Error saving brand:", error);
      toast({
        variant: "destructive",
        title: "Error saving brand",
        description: error.message || "Failed to save brand. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {brand ? "Edit Brand" : "Add New Brand"}
          </DialogTitle>
          <DialogDescription>
            {brand 
              ? "Update the details for this motorcycle brand."
              : "Fill in the details to add a new motorcycle brand to the database."}
          </DialogDescription>
        </DialogHeader>

        <BrandForm 
          brand={brand} 
          loading={loading} 
          onSubmit={handleSubmit} 
          onCancel={() => onClose()}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AdminBrandDialog;
