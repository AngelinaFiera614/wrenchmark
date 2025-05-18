import React, { useState, useEffect } from "react";
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
import { useAuth } from "@/context/auth";

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
  const [loading, setLoading] = useState(false);
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const { user, isAdmin } = useAuth();
  
  // Clear any existing timeout when component unmounts or dialog closes
  useEffect(() => {
    return () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
    };
  }, [saveTimeout]);
  
  // Clear timeout when dialog closes
  useEffect(() => {
    if (!open && saveTimeout) {
      clearTimeout(saveTimeout);
      setSaveTimeout(null);
    }
  }, [open, saveTimeout]);
  
  const handleSubmit = async (values: BrandFormValues) => {
    setLoading(true);
    
    // Create a timeout to detect if the save operation is taking too long
    const timeout = setTimeout(() => {
      console.error("Brand save operation timed out after 10 seconds");
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Save operation timed out",
        description: "The operation took too long. Please try again and check your connection.",
      });
    }, 10000); // 10 second timeout
    
    setSaveTimeout(timeout);
    
    try {
      // Log authentication state
      console.log("Auth state during save:", { 
        isLoggedIn: !!user, 
        userId: user?.id,
        isAdmin,
      });
      
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
        const startTime = Date.now();
        
        response = await supabase
          .from('brands')
          .update(brandData)
          .eq('id', brand.id);
          
        console.log(`Update operation took ${Date.now() - startTime}ms`);
        
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
        const startTime = Date.now();
        
        response = await supabase
          .from('brands')
          .insert([brandData]);
          
        console.log(`Insert operation took ${Date.now() - startTime}ms`);
        
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
      
      // Clear the timeout since the operation completed successfully
      if (saveTimeout) {
        clearTimeout(saveTimeout);
        setSaveTimeout(null);
      }
      
      // Close dialog and refresh data
      onClose(true); 
      
    } catch (error: any) {
      // Clear the timeout if there's an error
      if (saveTimeout) {
        clearTimeout(saveTimeout);
        setSaveTimeout(null);
      }
      
      console.error("Error saving brand:", error);
      
      // Provide more specific error messages based on error type
      if (error.code === "PGRST301") {
        toast({
          variant: "destructive",
          title: "Permission denied",
          description: "You don't have permission to perform this action. Please verify you're logged in as an admin.",
        });
      } else if (error.code === "23505") {
        toast({
          variant: "destructive",
          title: "Duplicate entry",
          description: "A brand with this slug already exists. Please use a unique slug.",
        });
      } else if (error.message && error.message.includes("JWT")) {
        toast({
          variant: "destructive",
          title: "Authentication error",
          description: "Your session may have expired. Please refresh the page and log in again.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error saving brand",
          description: error.message || "Failed to save brand. Please try again.",
        });
      }
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
