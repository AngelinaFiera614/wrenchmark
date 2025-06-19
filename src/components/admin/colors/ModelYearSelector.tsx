
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ModelYearWithModel } from "./types";

interface ModelYearSelectorProps {
  value: string;
  onChange: (value: string) => void;
  modelYears?: ModelYearWithModel[];
}

const ModelYearSelector = ({ value, onChange, modelYears }: ModelYearSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="model_year">Model Year *</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30">
          <SelectValue placeholder="Select model year" />
        </SelectTrigger>
        <SelectContent className="bg-explorer-card border-explorer-chrome/30 text-explorer-text">
          {modelYears?.map((modelYear) => {
            const model = modelYear.motorcycle_models[0];
            const brandName = model?.brands?.[0]?.name || 'Unknown Brand';
            const modelName = model?.name || 'Unknown Model';
            return (
              <SelectItem key={modelYear.id} value={modelYear.id}>
                {brandName} {modelName} ({modelYear.year})
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ModelYearSelector;
