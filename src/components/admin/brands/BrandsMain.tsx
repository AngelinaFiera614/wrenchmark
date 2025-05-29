
import React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import BrandsHeader from "@/components/admin/brands/BrandsHeader";
import BrandsTable from "@/components/admin/brands/BrandsTable";
import BrandsCardView from "@/components/admin/brands/BrandsCardView";
import BrandDeleteDialog from "@/components/admin/brands/BrandDeleteDialog";
import BrandsEmptyState from "@/components/admin/brands/BrandsEmptyState";
import BrandsMobileViewToggle from "@/components/admin/brands/BrandsMobileViewToggle";
import BrandsLoading from "@/components/admin/brands/BrandsLoading";
import InlineBrandForm from "@/components/admin/brands/InlineBrandForm";
import AdminBrandDialog from "@/components/admin/brands/AdminBrandDialog";
import { useAdminBrands } from "./hooks/useAdminBrands";

const BrandsMain = () => {
  const {
    brands,
    isLoading,
    editBrand,
    isSubmitting,
    viewMode,
    setViewMode,
    isCreateDialogOpen,
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
    handleFormSuccess,
  } = useAdminBrands();

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <BrandsHeader 
          handleAddBrand={handleAddBrand}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
        
        {isInlineFormVisible ? (
          <InlineBrandForm
            brand={editBrand}
            onCancel={handleFormClose}
            onSuccess={handleFormSuccess}
          />
        ) : isLoading ? (
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
          open={isCreateDialogOpen}
          brand={null}
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

export default BrandsMain;
