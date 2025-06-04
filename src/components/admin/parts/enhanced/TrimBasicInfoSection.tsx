
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TrimBasicInfoSectionProps {
  formData: any;
  onInputChange: (field: string, value: any) => void;
}

const TrimBasicInfoSection = ({ formData, onInputChange }: TrimBasicInfoSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Trim Level Name *</Label>
          <Input
            id="name"
            value={formData.name || ""}
            onChange={(e) => onInputChange("name", e.target.value)}
            placeholder="Enter trim level name"
            className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="msrp_usd">MSRP (USD)</Label>
          <Input
            id="msrp_usd"
            type="number"
            value={formData.msrp_usd || ""}
            onChange={(e) => onInputChange("msrp_usd", e.target.value)}
            placeholder="Enter MSRP"
            className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="market_region">Market Region</Label>
          <Select value={formData.market_region || ""} onValueChange={(value) => onInputChange("market_region", value)}>
            <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text">
              <SelectValue placeholder="Select market region" />
            </SelectTrigger>
            <SelectContent className="bg-explorer-dark border-explorer-chrome/30">
              <SelectItem value="North America">North America</SelectItem>
              <SelectItem value="Europe">Europe</SelectItem>
              <SelectItem value="Asia">Asia</SelectItem>
              <SelectItem value="Global">Global</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2 pt-6">
          <Checkbox
            id="is_default"
            checked={formData.is_default || false}
            onCheckedChange={(checked) => onInputChange("is_default", checked)}
          />
          <Label htmlFor="is_default" className="text-sm text-explorer-text">
            Base Model (Default Configuration)
          </Label>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-md font-medium text-explorer-text">Physical Dimensions</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="seat_height_mm">Seat Height (mm)</Label>
            <Input
              id="seat_height_mm"
              type="number"
              value={formData.seat_height_mm || ""}
              onChange={(e) => onInputChange("seat_height_mm", e.target.value)}
              placeholder="Enter seat height"
              className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight_kg">Weight (kg)</Label>
            <Input
              id="weight_kg"
              type="number"
              value={formData.weight_kg || ""}
              onChange={(e) => onInputChange("weight_kg", e.target.value)}
              placeholder="Enter weight"
              className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="wheelbase_mm">Wheelbase (mm)</Label>
            <Input
              id="wheelbase_mm"
              type="number"
              value={formData.wheelbase_mm || ""}
              onChange={(e) => onInputChange("wheelbase_mm", e.target.value)}
              placeholder="Enter wheelbase"
              className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fuel_capacity_l">Fuel Capacity (L)</Label>
            <Input
              id="fuel_capacity_l"
              type="number"
              value={formData.fuel_capacity_l || ""}
              onChange={(e) => onInputChange("fuel_capacity_l", e.target.value)}
              placeholder="Enter fuel capacity"
              className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ground_clearance_mm">Ground Clearance (mm)</Label>
            <Input
              id="ground_clearance_mm"
              type="number"
              value={formData.ground_clearance_mm || ""}
              onChange={(e) => onInputChange("ground_clearance_mm", e.target.value)}
              placeholder="Enter ground clearance"
              className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrimBasicInfoSection;
