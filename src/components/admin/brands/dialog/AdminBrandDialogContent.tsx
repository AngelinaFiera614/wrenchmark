
import React from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Brand } from "@/types";
import { BrandFormValues } from "../BrandFormSchema";
import BrandForm from "../BrandForm";

interface AdminBrandDialogContentProps {
  brand: Brand | null;
  loading: boolean;
  onSubmit: (values: BrandFormValues) => Promise<void>;
  onCancel: () => void;
}

export const AdminBrandDialogContent = ({
  brand,
  loading,
  onSubmit,
  onCancel
}: AdminBrandDialogContentProps) => {
  return (
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
        onSubmit={onSubmit} 
        onCancel={onCancel}
      />
    </DialogContent>
  );
};
