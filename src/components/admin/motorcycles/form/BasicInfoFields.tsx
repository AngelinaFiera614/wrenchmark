
import React from "react";
import { Control } from "react-hook-form";
import { TechnicalFields } from "./TechnicalFields";
import { BasicInfoSection } from "./BasicInfoSection";
import { ProductionFields } from "./ProductionFields";
import { ImageUrlField } from "./ImageUrlField";
import { MediaManagementTab } from "./MediaManagementTab";

interface BasicInfoFieldsProps {
  control: Control<any>;
  motorcycleId?: string;
}

export function BasicInfoFields({ control, motorcycleId }: BasicInfoFieldsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Basic Information</h3>
        
        <BasicInfoSection control={control} />
        
        <ProductionFields control={control} />
        
        <ImageUrlField control={control} />
      </div>

      <TechnicalFields control={control} />

      {motorcycleId && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Media Management</h3>
          <MediaManagementTab motorcycleId={motorcycleId} />
        </div>
      )}
    </div>
  );
}
