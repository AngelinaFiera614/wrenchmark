
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { BrandFormValues } from "../../BrandFormSchema";
import { BrandHistoryField, BrandMilestonesField } from "../../fields";

interface HistoryTabProps {
  form: UseFormReturn<BrandFormValues>;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-accent-teal">Brand History</h3>
      <BrandHistoryField form={form} />
      <BrandMilestonesField form={form} />
    </div>
  );
};
