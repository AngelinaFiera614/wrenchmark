
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  useAdminBrands, 
  useEditableRows, 
  useMotorcycleData, 
  useRowOperations 
} from "./hooks";
import { 
  BrandsErrorMessage,
  MotorcycleGridLoader, 
  MotorcycleTable 
} from "./components";

export function AdminMotorcycleGrid() {
  // Load motorcycle data
  const {
    motorcycles,
    setMotorcycles,
    originalData,
    setOriginalData,
    isLoading
  } = useMotorcycleData();

  // Load brands for dropdown
  const { brands, isBrandsError, isBrandsLoading } = useAdminBrands();

  // Handle editable rows state and operations
  const {
    editingRows,
    setEditingRows,
    errors,
    setErrors,
    handleEditRow,
    handleCancelEdit,
    handleCellChange
  } = useEditableRows();

  // Handle motorcycle CRUD operations
  const {
    handleAddRow,
    handleDeleteRow,
    handleSaveRow,
    handleOpenDetailedEditor
  } = useRowOperations(
    motorcycles,
    setMotorcycles,
    originalData,
    setOriginalData,
    editingRows,
    setEditingRows,
    setErrors
  );

  // Wrapper for cancel edit to simplify props
  const handleCancelEditWrapper = (id: string) => {
    handleCancelEdit(id, motorcycles, setMotorcycles, originalData);
  };

  // Wrapper for cell change to simplify props
  const handleCellChangeWrapper = (id: string, field: string, value: any) => {
    handleCellChange(id, field, value, setMotorcycles);
  };

  if (isLoading) {
    return <MotorcycleGridLoader />;
  }

  return (
    <div className="space-y-4">
      {isBrandsError && <BrandsErrorMessage />}
      
      <MotorcycleTable
        motorcycles={motorcycles}
        editingRows={editingRows}
        errors={errors}
        brands={brands}
        isBrandsLoading={isBrandsLoading}
        onEdit={handleEditRow}
        onSave={handleSaveRow}
        onCancel={handleCancelEditWrapper}
        onDelete={handleDeleteRow}
        onOpenDetailedEditor={handleOpenDetailedEditor}
        onCellChange={handleCellChangeWrapper}
      />
      
      <div className="flex justify-end">
        <Button onClick={handleAddRow} className="gap-1">
          <Plus className="h-4 w-4" /> Add Motorcycle
        </Button>
      </div>
    </div>
  );
}
