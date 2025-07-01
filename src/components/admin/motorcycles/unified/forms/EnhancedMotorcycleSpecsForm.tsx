
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import { Motorcycle } from "@/types";

interface EnhancedMotorcycleSpecsFormProps {
  motorcycle: Motorcycle;
  isEditing: boolean;
  onUpdate: (field: string, value: any) => void;
}

const EnhancedMotorcycleSpecsForm = ({
  motorcycle,
  isEditing,
  onUpdate
}: EnhancedMotorcycleSpecsFormProps) => {
  const getFieldStatus = (value: any) => {
    if (value === null || value === undefined || value === '' || value === 0) {
      return { status: 'missing', icon: AlertCircle, color: 'text-red-400' };
    }
    return { status: 'complete', icon: CheckCircle2, color: 'text-green-400' };
  };

  const renderField = (
    key: string,
    label: string,
    value: any,
    type: 'text' | 'number' | 'textarea' = 'text',
    unit?: string
  ) => {
    const { status, icon: Icon, color } = getFieldStatus(value);
    
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor={key} className="text-explorer-text flex items-center gap-2">
            {label}
            {unit && <span className="text-sm text-explorer-text-muted">({unit})</span>}
          </Label>
          <Icon className={`h-4 w-4 ${color}`} />
        </div>
        {isEditing ? (
          type === 'textarea' ? (
            <Textarea
              id={key}
              value={value || ''}
              onChange={(e) => onUpdate(key, e.target.value)}
              className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
              rows={3}
            />
          ) : (
            <Input
              id={key}
              type={type}
              value={value || ''}
              onChange={(e) => onUpdate(key, type === 'number' ? parseFloat(e.target.value) || null : e.target.value)}
              className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
            />
          )
        ) : (
          <div className="text-explorer-text">
            {value ? `${value}${unit ? ` ${unit}` : ''}` : (
              <span className="text-red-400 italic">Not specified</span>
            )}
          </div>
        )}
      </div>
    );
  };

  // Calculate completion stats
  const specFields = [
    'engine_size', 'horsepower', 'torque_nm', 'weight_kg', 'seat_height_mm',
    'wheelbase_mm', 'ground_clearance_mm', 'fuel_capacity_l', 'top_speed_kph'
  ];
  
  const completedSpecs = specFields.filter(field => {
    const value = motorcycle[field as keyof Motorcycle];
    return value !== null && value !== undefined && value !== '' && value !== 0;
  }).length;
  
  const completionPercentage = Math.round((completedSpecs / specFields.length) * 100);

  return (
    <div className="space-y-6">
      {/* Completion Overview */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-explorer-text flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Specifications Completion
            </CardTitle>
            <Badge 
              variant={completionPercentage >= 80 ? "default" : "secondary"}
              className={completionPercentage >= 80 ? "bg-green-500 text-white" : "bg-yellow-500 text-black"}
            >
              {completionPercentage}% Complete
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-explorer-text-muted">
            {completedSpecs} of {specFields.length} specification fields completed
          </div>
        </CardContent>
      </Card>

      {/* Engine & Performance */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text">Engine & Performance</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderField('engine_size', 'Engine Size', motorcycle.engine_size, 'number', 'cc')}
          {renderField('horsepower', 'Horsepower', motorcycle.horsepower, 'number', 'hp')}
          {renderField('torque_nm', 'Torque', motorcycle.torque_nm, 'number', 'Nm')}
          {renderField('top_speed_kph', 'Top Speed', motorcycle.top_speed_kph, 'number', 'km/h')}
        </CardContent>
      </Card>

      {/* Physical Dimensions */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text">Physical Dimensions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderField('weight_kg', 'Weight', motorcycle.weight_kg, 'number', 'kg')}
          {renderField('seat_height_mm', 'Seat Height', motorcycle.seat_height_mm, 'number', 'mm')}
          {renderField('wheelbase_mm', 'Wheelbase', motorcycle.wheelbase_mm, 'number', 'mm')}
          {renderField('ground_clearance_mm', 'Ground Clearance', motorcycle.ground_clearance_mm, 'number', 'mm')}
          {renderField('fuel_capacity_l', 'Fuel Capacity', motorcycle.fuel_capacity_l, 'number', 'L')}
        </CardContent>
      </Card>

      {/* Additional Details */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text">Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {renderField('base_description', 'Description', motorcycle.base_description, 'textarea')}
          {renderField('summary', 'Summary', motorcycle.summary, 'textarea')}
          <Separator className="bg-explorer-chrome/30" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderField('production_start_year', 'Production Start', motorcycle.production_start_year, 'number')}
            {renderField('production_end_year', 'Production End', motorcycle.production_end_year, 'number')}
            {renderField('difficulty_level', 'Difficulty Level', motorcycle.difficulty_level, 'number', '1-10')}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedMotorcycleSpecsForm;
