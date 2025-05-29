
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BrandFormValues } from "../BrandFormSchema";
import { Brand } from "@/types";
import { useAuth } from "@/context/auth";

export function useAdminBrandSubmit() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const { user, isAdmin } = useAuth();

  // Clear any existing timeout when component unmounts
  useEffect(() => {
    return () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
    };
  }, [saveTimeout]);

  const handleSubmit = async (
    values: BrandFormValues,
    brand: Brand | null,
    onSuccess: () => void
  ) => {
    console.log("Starting brand submission with values:", values);
    console.log("Editing existing brand:", brand ? brand.name : "Creating new brand");
    
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
      
      // Clean and prepare data for database
      const brandData = prepareDataForSubmission(values);
      console.log("Prepared brand data for submission:", brandData);
      
      let response;
      
      if (brand) {
        // Update existing brand
        console.log(`Updating brand: ${brand.name} (ID: ${brand.id})`);
        const startTime = Date.now();
        
        response = await supabase
          .from('brands')
          .update(brandData)
          .eq('id', brand.id)
          .select();
          
        console.log(`Update operation took ${Date.now() - startTime}ms`);
        console.log("Update response:", response);
        
        if (response.error) {
          console.error("Update failed with error:", response.error);
          throw response.error;
        }
        
        toast({
          title: "Brand updated",
          description: `${values.name} has been updated successfully.`,
        });
      } else {
        // Create new brand
        console.log("Creating new brand:", values.name);
        const startTime = Date.now();
        
        response = await supabase
          .from('brands')
          .insert([brandData])
          .select();
          
        console.log(`Insert operation took ${Date.now() - startTime}ms`);
        console.log("Insert response:", response);
        
        if (response.error) {
          console.error("Insert failed with error:", response.error);
          throw response.error;
        }
        
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
      
      console.log("Brand operation completed successfully");
      
      // Trigger success callback
      onSuccess();
      
    } catch (error: any) {
      // Clear the timeout if there's an error
      if (saveTimeout) {
        clearTimeout(saveTimeout);
        setSaveTimeout(null);
      }
      
      console.error("Error saving brand:", error);
      
      // Provide more specific error messages based on error type
      handleErrorResponse(error, toast);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to prepare data for submission
  const prepareDataForSubmission = (values: BrandFormValues) => {
    const preparedData = {
      name: values.name,
      country: values.country || null,
      founded: values.founded || null,
      logo_url: values.logo_url || null,
      known_for: Array.isArray(values.known_for) ? values.known_for : [],
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
      // New expanded fields
      brand_history: values.brand_history || null,
      milestones: values.milestones?.length ? values.milestones : null,
      manufacturing_facilities: values.manufacturing_facilities?.length ? values.manufacturing_facilities : null,
      logo_history: values.logo_history?.length ? values.logo_history : null,
      media_gallery: values.media_gallery?.length ? values.media_gallery : null,
      notable_models: values.notable_models?.length ? values.notable_models : null,
    };
    
    console.log("Data preparation complete:", preparedData);
    return preparedData;
  };

  // Helper function to handle different error types
  const handleErrorResponse = (error: any, toast: any) => {
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
    } else if (error.message && error.message.includes("invalid input syntax")) {
      toast({
        variant: "destructive",
        title: "Invalid data format",
        description: "One or more fields contain data in an invalid format. Please check your entries.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error saving brand",
        description: error.message || "Failed to save brand. Please try again.",
      });
    }
  };

  return {
    loading,
    handleSubmit,
  };
}
