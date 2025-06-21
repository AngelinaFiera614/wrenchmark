
import React from "react";
import { Brand, Motorcycle } from "@/types";
import AddMotorcycleDialog from "./AddMotorcycleDialog";
import EditMotorcycleDialog from "./EditMotorcycleDialog";
import ImportMotorcycleDialog from "./ImportMotorcycleDialog";
import ComponentManagementDialog from "./ComponentManagementDialog";

interface AdminMotorcycleDialogsProps {
  addDialogOpen: boolean;
  editDialogOpen: boolean;
  importDialogOpen: boolean;
  componentDialogOpen: boolean;
  selectedMotorcycleForEdit: Motorcycle | null;
  selectedMotorcycleForComponents: any | null;
  brands: Brand[];
  onAddDialogChange: (open: boolean) => void;
  onEditDialogChange: (open: boolean) => void;
  onImportDialogChange: (open: boolean) => void;
  onComponentDialogChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AdminMotorcycleDialogs = ({
  addDialogOpen,
  editDialogOpen,
  importDialogOpen,
  componentDialogOpen,
  selectedMotorcycleForEdit,
  selectedMotorcycleForComponents,
  brands,
  onAddDialogChange,
  onEditDialogChange,
  onImportDialogChange,
  onComponentDialogChange,
  onSuccess
}: AdminMotorcycleDialogsProps) => {
  return (
    <>
      <AddMotorcycleDialog
        open={addDialogOpen}
        onOpenChange={onAddDialogChange}
        brands={brands}
        onSuccess={onSuccess}
      />

      <EditMotorcycleDialog
        open={editDialogOpen}
        onOpenChange={onEditDialogChange}
        motorcycle={selectedMotorcycleForEdit}
        brands={brands}
        onSuccess={onSuccess}
      />

      <ImportMotorcycleDialog
        open={importDialogOpen}
        onOpenChange={onImportDialogChange}
        brands={brands}
        onSuccess={onSuccess}
      />

      <ComponentManagementDialog
        open={componentDialogOpen}
        onOpenChange={onComponentDialogChange}
        selectedModel={selectedMotorcycleForComponents}
        onComponentLinked={onSuccess}
      />
    </>
  );
};

export default AdminMotorcycleDialogs;
