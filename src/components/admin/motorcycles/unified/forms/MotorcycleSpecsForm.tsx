
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Motorcycle } from "@/types";

interface MotorcycleSpecsFormProps {
  motorcycle: Motorcycle;
  isEditing: boolean;
  onUpdate: (field: string, value: any) => void;
}

const MotorcycleSpecsForm = ({ motorcycle, isEditing, onUpdate }: MotorcycleSpecsFormProps) => {
  return (
    <div className="space-y-6">
      {/* Engine Specifications */}
      <Card className="bg-explorer-dark border-explorer-chrome/20">
        <CardHeader>
          <CardTitle className="text-explorer-text">Engine Specifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="engine_size">Engine Size (CC)</Label>
              {isEditing ? (
                <Input
                  id="engine_size"
                  type="number"
                  value={motorcycle.engine_size || ''}
                  onChange={(e) => onUpdate('engine_size', parseInt(e.target.value) || 0)}
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
                  value={motorcycle.horsepower || ''}
                  onChange={(e) => onUpdate('horsepower', parseFloat(e.target.value) || 0)}
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
                  value={motorcycle.torque_nm || ''}
                  onChange={(e) => onUpdate('torque_nm', parseFloat(e.target.value) || 0)}
                  className="bg-explorer-card border-explorer-chrome/30"
                />
              ) : (
                <div className="p-2 text-explorer-text">{motorcycle.torque_nm || 'Not specified'}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="top_speed_kph">Top Speed (KPH)</Label>
              {isEditing ? (
                <Input
                  id="top_speed_kph"
                  type="number"
                  value={motorcycle.top_speed_kph || ''}
                  onChange={(e) => onUpdate('top_speed_kph', parseFloat(e.target.value) || 0)}
                  className="bg-explorer-card border-explorer-chrome/30"
                />
              ) : (
                <div className="p-2 text-explorer-text">{motorcycle.top_speed_kph || 'Not specified'}</div>
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
              <Label htmlFor="weight_kg">Weight (KG)</Label>
              {isEditing ? (
                <Input
                  id="weight_kg"
                  type="number"
                  value={motorcycle.weight_kg || ''}
                  onChange={(e) => onUpdate('weight_kg', parseFloat(e.target.value) || 0)}
                  className="bg-explorer-card border-explorer-chrome/30"
                />
              ) : (
                <div className="p-2 text-explorer-text">{motorcycle.weight_kg || 'Not specified'}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="seat_height_mm">Seat Height (MM)</Label>
              {isEditing ? (
                <Input
                  id="seat_height_mm"
                  type="number"
                  value={motorcycle.seat_height_mm || ''}
                  onChange={(e) => onUpdate('seat_height_mm', parseInt(e.target.value) || 0)}
                  className="bg-explorer-card border-explorer-chrome/30"
                />
              ) : (
                <div className="p-2 text-explorer-text">{motorcycle.seat_height_mm || 'Not specified'}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="wheelbase_mm">Wheelbase (MM)</Label>
              {isEditing ? (
                <Input
                  id="wheelbase_mm"
                  type="number"
                  value={motorcycle.wheelbase_mm || ''}
                  onChange={(e) => onUpdate('wheelbase_mm', parseInt(e.target.value) || 0)}
                  className="bg-explorer-card border-explorer-chrome/30"
                />
              ) : (
                <div className="p-2 text-explorer-text">{motorcycle.wheelbase_mm || 'Not specified'}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fuel_capacity_l">Fuel Capacity (L)</Label>
              {isEditing ? (
                <Input
                  id="fuel_capacity_l"
                  type="number"
                  value={motorcycle.fuel_capacity_l || ''}
                  onChange={(e) => onUpdate('fuel_capacity_l', parseFloat(e.target.value) || 0)}
                  className="bg-explorer-card border-explorer-chrome/30"
                />
              ) : (
                <div className="p-2 text-explorer-text">{motorcycle.fuel_capacity_l || 'Not specified'}</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features & Safety */}
      <Card className="bg-explorer-dark border-explorer-chrome/20">
        <CardHeader>
          <CardTitle className="text-explorer-text">Features & Safety</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <Switch
                id="has_abs"
                checked={motorcycle.has_abs || false}
                onCheckedChange={(checked) => onUpdate('has_abs', checked)}
              />
            ) : (
              <div className={`w-4 h-4 rounded-sm ${motorcycle.has_abs ? 'bg-green-500' : 'bg-gray-500'}`} />
            )}
            <Label htmlFor="has_abs">ABS (Anti-lock Braking System)</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MotorcycleSpecsForm;
