
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { BrandFormValues } from "../../BrandFormSchema";
import { 
  BrandNameField, 
  BrandCountryField, 
  BrandFoundedField,
  BrandDescriptionField,
  BrandKnownForField,
  BrandCategoriesField
} from "../../fields";

interface BasicInfoTabProps {
  form: UseFormReturn<BrandFormValues>;
}

export const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ form }) => {
  return (
    <>
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-accent-teal">Basic Information</h3>
        <BrandNameField form={form} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BrandCountryField form={form} />
          <BrandFoundedField form={form} />
        </div>
        <BrandDescriptionField form={form} />
      </div>
      
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-accent-teal">Tags and Categories</h3>
        <BrandKnownForField form={form} />
        <BrandCategoriesField form={form} />
      </div>
    </>
  );
};
