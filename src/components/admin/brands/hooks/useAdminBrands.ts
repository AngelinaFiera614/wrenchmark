
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Brand } from "@/types";

export function useAdminBrands() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isInlineFormVisible, setIsInlineFormVisible] = useState(false);
  const [editBrand, setEditBrand] = useState<Brand | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortField, setSortField] = useState<string>("name");

  const { data: brands, isLoading, error, isError } = useQuery({
    queryKey: ["admin-brands", sortField, sortOrder],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order(sortField, { ascending: sortOrder === "asc" });
        
      if (error) throw error;
      return data as Brand[];
    },
    staleTime: 30000,
    refetchOnWindowFocus: false
  });

  if (isError && error) {
    toast({
      variant: "destructive",
      title: "Failed to load brands",
      description: error instanceof Error ? error.message : "An unknown error occurred",
    });
  }

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
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('brands')
        .delete()
        .eq('id', brandToDelete.id);

      if (error) throw error;

      toast({
        title: "Brand deleted",
        description: `${brandToDelete.name} has been removed.`,
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-brands"],
      });
      
      setIsDeleteConfirmOpen(false);
      setBrandToDelete(null);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete brand. It may have associated motorcycles.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogClose = (refreshData = false) => {
    setIsCreateDialogOpen(false);
    if (refreshData) {
      queryClient.invalidateQueries({
        queryKey: ["admin-brands"],
      });
    }
  };

  const handleFormClose = () => {
    setIsInlineFormVisible(false);
    setEditBrand(null);
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: ["admin-brands"],
    });
    setIsInlineFormVisible(false);
    setEditBrand(null);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
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
    sortField,
    sortOrder,
    handleSort,
    handleAddBrand,
    handleEditBrand,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDialogClose,
    handleFormClose,
    handleFormSuccess,
  };
}
