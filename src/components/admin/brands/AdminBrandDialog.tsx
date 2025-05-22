
import React, { useEffect } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Brand } from "@/types";
import { BrandFormValues } from "./BrandFormSchema";
import { useAdminBrandSubmit } from "./hooks/useAdminBrandSubmit";
import { AdminBrandDialogContent } from "./dialog/AdminBrandDialogContent";

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
  const { loading, handleSubmit } = useAdminBrandSubmit();
  
  // Clear timeout when dialog closes
  useEffect(() => {
    // Any additional cleanup can go here
  }, [open]);
  
  const handleFormSubmit = async (values: BrandFormValues) => {
    await handleSubmit(values, brand, () => onClose(true));
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <AdminBrandDialogContent
        brand={brand}
        loading={loading}
        onSubmit={handleFormSubmit}
        onCancel={() => onClose()}
      />
    </Dialog>
  );
};

export default AdminBrandDialog;
