
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DimensionsTabProps {
  formData: {
    weight_kg: string;
    seat_height_mm: string;
    wheelbase_mm: string;
    ground_clearance_mm: string;
    fuel_capacity_l: string;
  };
  onInputChange: (field: string, value: any) => void;
}

const DimensionsTab = ({ formData, onInputChange }: DimensionsTabProps) => {
  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardHeader>
        <CardTitle className="text-explorer-text">Physical Dimensions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="weight_kg">Weight (kg)</Label>
            <Input
              id="weight_kg"
              type="number"
              step="0.1"
              min="0"
              value={formData.weight_kg}
              onChange={(e) => onInputChange('weight_kg', e.target.value)}
              className="bg-explorer-dark border-explorer-chrome/30"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seat_height_mm">Seat Height (mm)</Label>
            <Input
              id="seat_height_mm"
              type="number"
              min="0"
              value={formData.seat_height_mm}
              onChange={(e) => onInputChange('seat_height_mm', e.target.value)}
              className="bg-explorer-dark border-explorer-chrome/30"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="wheelbase_mm">Wheelbase (mm)</Label>
            <Input
              id="wheelbase_mm"
              type="number"
              min="0"
              value={formData.wheelbase_mm}
              onChange={(e) => onInputChange('wheelbase_mm', e.target.value)}
              className="bg-explorer-dark border-explorer-chrome/30"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ground_clearance_mm">Ground Clearance (mm)</Label>
            <Input
              id="ground_clearance_mm"
              type="number"
              min="0"
              value={formData.ground_clearance_mm}
              onChange={(e) => onInputChange('ground_clearance_mm', e.target.value)}
              className="bg-explorer-dark border-explorer-chrome/30"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fuel_capacity_l">Fuel Capacity (L)</Label>
            <Input
              id="fuel_capacity_l"
              type="number"
              step="0.1"
              min="0"
              value={formData.fuel_capacity_l}
              onChange={(e) => onInputChange('fuel_capacity_l', e.target.value)}
              className="bg-explorer-dark border-explorer-chrome/30"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DimensionsTab;
