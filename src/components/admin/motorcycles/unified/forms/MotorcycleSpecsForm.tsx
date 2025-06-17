
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Motorcycle } from "@/types";

interface MotorcycleSpecsFormProps {
  motorcycle: Motorcycle;
  isEditing: boolean;
  onUpdate: (data: Partial<Motorcycle>) => void;
}

const MotorcycleSpecsForm = ({ motorcycle, isEditing, onUpdate }: MotorcycleSpecsFormProps) => {
  const convertToImperial = (metric: number, type: 'weight' | 'height' | 'length') => {
    if (!metric) return '';
    switch (type) {
      case 'weight': return (metric * 2.20462).toFixed(1); // kg to lbs
      case 'height': return (metric / 25.4).toFixed(1); // mm to inches
      case 'length': return (metric / 25.4).toFixed(1); // mm to inches
      default: return metric.toString();
    }
  };

  return (
    <div className="space-y-6">
      {/* Engine Specifications */}
      <Card className="bg-explorer-dark border-explorer-chrome/20">
        <CardHeader>
          <CardTitle className="text-explorer-text">Engine Specifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="engine_size">Engine Size (cc)</Label>
              {isEditing ? (
                <Input
                  id="engine_size"
                  type="number"
                  value={motorcycle.engine_size || ''}
                  onChange={(e) => onUpdate({ engine_size: parseInt(e.target.value) || undefined })}
                  className="bg-explorer-card border-explorer-chrome/30"
                />
              ) : (
                <div className="p-2 text-explorer-text">{motorcycle.engine_size || 'Not specified'}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="horsepower">Horsepower (HP)</Label>
              {isEditing ? (
                <Input
                  id="horsepower"
                  type="number"
                  step="0.1"
                  value={motorcycle.horsepower || ''}
                  onChange={(e) => onUpdate({ horsepower: parseFloat(e.target.value) || undefined })}
                  className="bg-explorer-card border-explorer-chrome/30"
                />
              ) : (
                <div className="p-2 text-explorer-text">{motorcycle.horsepower || 'Not specified'}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="torque_nm">Torque (Nm)</Label>
              {isEditing ? (
                <Input
                  id="torque_nm"
                  type="number"
                  step="0.1"
                  value={motorcycle.torque_nm || ''}
                  onChange={(e) => onUpdate({ torque_nm: parseFloat(e.target.value) || undefined })}
                  className="bg-explorer-card border-explorer-chrome/30"
                />
              ) : (
                <div className="p-2 text-explorer-text">{motorcycle.torque_nm || 'Not specified'}</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Physical Dimensions */}
      <Card className="bg-explorer-dark border-explorer-chrome/20">
        <CardHeader>
          <CardTitle className="text-explorer-text">Physical Dimensions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight_kg">Weight (kg)</Label>
              {isEditing ? (
                <div className="flex gap-2">
                  <Input
                    id="weight_kg"
                    type="number"
                    step="0.1"
                    value={motorcycle.weight_kg || ''}
                    onChange={(e) => onUpdate({ weight_kg: parseFloat(e.target.value) || undefined })}
                    className="bg-explorer-card border-explorer-chrome/30"
                    placeholder="kg"
                  />
                  <div className="flex items-center text-sm text-explorer-text-muted min-w-0">
                    ({convertToImperial(motorcycle.weight_kg || 0, 'weight')} lbs)
                  </div>
                </div>
              ) : (
                <div className="p-2 text-explorer-text">
                  {motorcycle.weight_kg ? `${motorcycle.weight_kg} kg (${convertToImperial(motorcycle.weight_kg, 'weight')} lbs)` : 'Not specified'}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="seat_height_mm">Seat Height (mm)</Label>
              {isEditing ? (
                <div className="flex gap-2">
                  <Input
                    id="seat_height_mm"
                    type="number"
                    value={motorcycle.seat_height_mm || ''}
                    onChange={(e) => onUpdate({ seat_height_mm: parseInt(e.target.value) || undefined })}
                    className="bg-explorer-card border-explorer-chrome/30"
                    placeholder="mm"
                  />
                  <div className="flex items-center text-sm text-explorer-text-muted min-w-0">
                    ({convertToImperial(motorcycle.seat_height_mm || 0, 'height')}")
                  </div>
                </div>
              ) : (
                <div className="p-2 text-explorer-text">
                  {motorcycle.seat_height_mm ? `${motorcycle.seat_height_mm} mm (${convertToImperial(motorcycle.seat_height_mm, 'height')}")` : 'Not specified'}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="wheelbase_mm">Wheelbase (mm)</Label>
              {isEditing ? (
                <div className="flex gap-2">
                  <Input
                    id="wheelbase_mm"
                    type="number"
                    value={motorcycle.wheelbase_mm || ''}
                    onChange={(e) => onUpdate({ wheelbase_mm: parseInt(e.target.value) || undefined })}
                    className="bg-explorer-card border-explorer-chrome/30"
                    placeholder="mm"
                  />
                  <div className="flex items-center text-sm text-explorer-text-muted min-w-0">
                    ({convertToImperial(motorcycle.wheelbase_mm || 0, 'length')}")
                  </div>
                </div>
              ) : (
                <div className="p-2 text-explorer-text">
                  {motorcycle.wheelbase_mm ? `${motorcycle.wheelbase_mm} mm (${convertToImperial(motorcycle.wheelbase_mm, 'length')}")` : 'Not specified'}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ground_clearance_mm">Ground Clearance (mm)</Label>
              {isEditing ? (
                <div className="flex gap-2">
                  <Input
                    id="ground_clearance_mm"
                    type="number"
                    value={motorcycle.ground_clearance_mm || ''}
                    onChange={(e) => onUpdate({ ground_clearance_mm: parseInt(e.target.value) || undefined })}
                    className="bg-explorer-card border-explorer-chrome/30"
                    placeholder="mm"
                  />
                  <div className="flex items-center text-sm text-explorer-text-muted min-w-0">
                    ({convertToImperial(motorcycle.ground_clearance_mm || 0, 'height')}")
                  </div>
                </div>
              ) : (
                <div className="p-2 text-explorer-text">
                  {motorcycle.ground_clearance_mm ? `${motorcycle.ground_clearance_mm} mm (${convertToImperial(motorcycle.ground_clearance_mm, 'height')}")` : 'Not specified'}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance & Features */}
      <Card className="bg-explorer-dark border-explorer-chrome/20">
        <CardHeader>
          <CardTitle className="text-explorer-text">Performance & Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="top_speed_kph">Top Speed (km/h)</Label>
              {isEditing ? (
                <Input
                  id="top_speed_kph"
                  type="number"
                  value={motorcycle.top_speed_kph || ''}
                  onChange={(e) => onUpdate({ top_speed_kph: parseInt(e.target.value) || undefined })}
                  className="bg-explorer-card border-explorer-chrome/30"
                />
              ) : (
                <div className="p-2 text-explorer-text">
                  {motorcycle.top_speed_kph ? `${motorcycle.top_speed_kph} km/h (${Math.round(motorcycle.top_speed_kph * 0.621371)} mph)` : 'Not specified'}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fuel_capacity_l">Fuel Capacity (L)</Label>
              {isEditing ? (
                <Input
                  id="fuel_capacity_l"
                  type="number"
                  step="0.1"
                  value={motorcycle.fuel_capacity_l || ''}
                  onChange={(e) => onUpdate({ fuel_capacity_l: parseFloat(e.target.value) || undefined })}
                  className="bg-explorer-card border-explorer-chrome/30"
                />
              ) : (
                <div className="p-2 text-explorer-text">
                  {motorcycle.fuel_capacity_l ? `${motorcycle.fuel_capacity_l} L (${(motorcycle.fuel_capacity_l * 0.264172).toFixed(1)} gal)` : 'Not specified'}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="has_abs">ABS</Label>
              {isEditing ? (
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="has_abs"
                    checked={motorcycle.has_abs || false}
                    onCheckedChange={(checked) => onUpdate({ has_abs: checked })}
                  />
                  <Label htmlFor="has_abs">Has ABS</Label>
                </div>
              ) : (
                <div className="p-2 text-explorer-text">
                  {motorcycle.has_abs ? 'Yes' : 'No'}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MotorcycleSpecsForm;
