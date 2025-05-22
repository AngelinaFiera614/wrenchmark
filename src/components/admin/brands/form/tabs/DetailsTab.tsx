
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { BrandFormValues } from "../../BrandFormSchema";
import { 
  BrandFoundedCityField, 
  BrandHeadquartersField,
  BrandStatusField,
  BrandTypeField,
  BrandIsElectricField,
  BrandWebsiteField
} from "../../fields";

interface DetailsTabProps {
  form: UseFormReturn<BrandFormValues>;
}

export const DetailsTab: React.FC<DetailsTabProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-accent-teal">Additional Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BrandFoundedCityField form={form} />
        <BrandHeadquartersField form={form} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BrandStatusField form={form} />
        <BrandTypeField form={form} />
      </div>
      <BrandIsElectricField form={form} />
      <BrandWebsiteField form={form} />
    </div>
  );
};
