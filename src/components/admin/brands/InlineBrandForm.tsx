
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import BrandForm from "./BrandForm";
import { Brand } from "@/types";
import { BrandFormValues } from "./BrandFormSchema";

interface InlineBrandFormProps {
  brand: Brand | null;
  loading: boolean;
  onSubmit: (values: BrandFormValues) => Promise<void>;
  onCancel: () => void;
}

const InlineBrandForm = ({ brand, loading, onSubmit, onCancel }: InlineBrandFormProps) => {
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
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
};

export default InlineBrandForm;
