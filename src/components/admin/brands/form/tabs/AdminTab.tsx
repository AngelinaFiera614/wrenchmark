
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { BrandFormValues } from "../../BrandFormSchema";
import { 
  BrandNotesField,
  BrandLogoField,
  BrandSlugField
} from "../../fields";

interface AdminTabProps {
  form: UseFormReturn<BrandFormValues>;
}

export const AdminTab: React.FC<AdminTabProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-accent-teal">Admin Fields</h3>
      <BrandNotesField form={form} />
      <BrandLogoField form={form} />
      <BrandSlugField form={form} />
    </div>
  );
};
