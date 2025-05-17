
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
      const brandData = {
        name: values.name,
        country: values.country || null,
        founded: values.founded || null,
        logo_url: values.logo_url || null,
        known_for: values.known_for || [],
        slug: values.slug,
      };

      let error;
      
      if (brand) {
        // Update existing brand
        const { error: updateError } = await supabase
          .from('brands')
          .update(brandData)
          .eq('id', brand.id);
          
        error = updateError;
        
        if (!error) {
          toast({
            title: "Brand updated",
            description: `${values.name} has been updated successfully.`,
          });
        }
      } else {
        // Create new brand
        const { error: insertError } = await supabase
          .from('brands')
          .insert([brandData]);
          
        error = insertError;
        
        if (!error) {
          toast({
            title: "Brand added",
            description: `${values.name} has been added successfully.`,
          });
        }
      }

      if (error) throw error;
      
      onClose(true); // Close and refresh data
      
    } catch (error) {
      console.error("Error saving brand:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save brand. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md">
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
