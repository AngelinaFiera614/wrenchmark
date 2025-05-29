
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import BrandForm from "./BrandForm";
import { Brand } from "@/types";
import { BrandFormValues } from "./BrandFormSchema";
import { useAdminBrandSubmit } from "./hooks/useAdminBrandSubmit";

interface InlineBrandFormProps {
  brand: Brand | null;
  onCancel: () => void;
  onSuccess: () => void;
}

const InlineBrandForm = ({ brand, onCancel, onSuccess }: InlineBrandFormProps) => {
  const { loading, handleSubmit } = useAdminBrandSubmit();

  const handleFormSubmit = async (values: BrandFormValues) => {
    await handleSubmit(values, brand, onSuccess);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button
          variant="ghost"
          onClick={onCancel}
          className="gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to brands
        </Button>
      </div>
      
      <div className="bg-card rounded-md border border-border p-6">
        <h2 className="text-2xl font-bold mb-6">
          {brand ? "Edit Brand" : "Add New Brand"}
        </h2>
        
        <BrandForm
          brand={brand}
          loading={loading}
          onSubmit={handleFormSubmit}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
};

export default InlineBrandForm;
