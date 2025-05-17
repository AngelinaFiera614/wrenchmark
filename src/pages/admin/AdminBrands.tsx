
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Brand } from "@/types";
import { useQuery } from "@tanstack/react-query";
import AdminBrandDialog from "@/components/admin/brands/AdminBrandDialog";
import { TooltipProvider } from "@/components/ui/tooltip";

// Import our refactored components
import BrandsHeader from "@/components/admin/brands/BrandsHeader";
import BrandsTable from "@/components/admin/brands/BrandsTable";
import BrandsCardView from "@/components/admin/brands/BrandsCardView";
import BrandDeleteDialog from "@/components/admin/brands/BrandDeleteDialog";
import BrandsEmptyState from "@/components/admin/brands/BrandsEmptyState";
import BrandsMobileViewToggle from "@/components/admin/brands/BrandsMobileViewToggle";
import BrandsLoading from "@/components/admin/brands/BrandsLoading";

const AdminBrands = () => {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editBrand, setEditBrand] = useState<Brand | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");

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
    setIsCreateDialogOpen(true);
  };

  const handleEditBrand = (brand: Brand) => {
    setEditBrand(brand);
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
    setEditBrand(null);
    if (refreshData) {
      refetch();
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <BrandsHeader 
          handleAddBrand={handleAddBrand}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
        
        {isLoading ? (
          <BrandsLoading />
        ) : brands && brands.length > 0 ? (
          <div className="space-y-4">
            <BrandsMobileViewToggle viewMode={viewMode} setViewMode={setViewMode} />

            {viewMode === "table" ? (
              <BrandsTable 
                brands={brands}
                handleEditBrand={handleEditBrand}
                handleDeleteClick={handleDeleteClick}
              />
            ) : (
              <BrandsCardView 
                brands={brands}
                handleEditBrand={handleEditBrand}
                handleDeleteClick={handleDeleteClick}
              />
            )}
          </div>
        ) : (
          <BrandsEmptyState handleAddBrand={handleAddBrand} />
        )}

        {/* Create/Edit Dialog */}
        <AdminBrandDialog
          open={isCreateDialogOpen || editBrand !== null}
          brand={editBrand}
          onClose={handleDialogClose}
        />

        {/* Delete Confirmation Dialog */}
        <BrandDeleteDialog
          isOpen={isDeleteConfirmOpen}
          setIsOpen={setIsDeleteConfirmOpen}
          brandToDelete={brandToDelete}
          onConfirmDelete={handleDeleteConfirm}
        />
      </div>
    </TooltipProvider>
  );
};

export default AdminBrands;
