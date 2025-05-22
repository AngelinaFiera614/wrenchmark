
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Brand } from "@/types";

export function useAdminBrands() {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isInlineFormVisible, setIsInlineFormVisible] = useState(false);
  const [editBrand, setEditBrand] = useState<Brand | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch brands data
  const { data: brands, isLoading, refetch } = useQuery({
    queryKey: ["admin-brands"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('name', { ascending: true });
        
      if (error) throw error;
      return data as Brand[];
    }
  });

  const handleAddBrand = () => {
    setEditBrand(null);
    setIsInlineFormVisible(true);
  };

  const handleEditBrand = (brand: Brand) => {
    setEditBrand(brand);
    setIsInlineFormVisible(true);
  };

  const handleDeleteClick = (brand: Brand) => {
    setBrandToDelete(brand);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!brandToDelete) return;

    try {
      const { error } = await supabase
        .from('brands')
        .delete()
        .eq('id', brandToDelete.id);

      if (error) throw error;

      toast({
        title: "Brand deleted",
        description: `${brandToDelete.name} has been removed.`,
      });

      refetch();
      setIsDeleteConfirmOpen(false);
      setBrandToDelete(null);
    } catch (error: any) {
      console.error("Error deleting brand:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete brand. It may have associated motorcycles.",
      });
    }
  };

  const handleDialogClose = (refreshData = false) => {
    setIsCreateDialogOpen(false);
    if (refreshData) {
      refetch();
    }
  };

  const handleFormClose = () => {
    setIsInlineFormVisible(false);
    setEditBrand(null);
  };

  const handleFormSubmit = async (values: any) => {
    setIsSubmitting(true);

    try {
      if (editBrand) {
        // Update existing brand
        const { error } = await supabase
          .from('brands')
          .update(values)
          .eq('id', editBrand.id);

        if (error) throw error;

        toast({
          title: "Brand updated",
          description: `${values.name} has been updated successfully.`,
        });
      } else {
        // Create new brand
        const { error } = await supabase
          .from('brands')
          .insert(values);

        if (error) throw error;

        toast({
          title: "Brand created",
          description: `${values.name} has been added successfully.`,
        });
      }

      // Close the form and refresh data
      setIsInlineFormVisible(false);
      setEditBrand(null);
      refetch();
    } catch (error: any) {
      console.error("Error saving brand:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save brand.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    brands,
    isLoading,
    editBrand,
    isSubmitting,
    viewMode,
    setViewMode,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isInlineFormVisible,
    isDeleteConfirmOpen,
    setIsDeleteConfirmOpen,
    brandToDelete,
    handleAddBrand,
    handleEditBrand,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDialogClose,
    handleFormClose,
    handleFormSubmit,
  };
}
