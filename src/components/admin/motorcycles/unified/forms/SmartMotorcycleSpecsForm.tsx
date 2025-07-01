
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, Wrench, AlertCircle, CheckCircle2 } from "lucide-react";
import { Motorcycle } from "@/types";
import { SmartFieldRenderer } from "./SmartFieldRenderer";
import { useUnifiedMotorcycleData } from "@/hooks/useUnifiedMotorcycleData";

interface SmartMotorcycleSpecsFormProps {
  motorcycle: Motorcycle;
  isEditing: boolean;
  onUpdate: (field: string, value: any) => void;
  onEditComponent?: (componentType: string, componentId: string) => void;
}

const SmartMotorcycleSpecsForm = ({
  motorcycle,
  isEditing,
  onUpdate,
  onEditComponent
}: SmartMotorcycleSpecsFormProps) => {
  const { components, configurations, stats, loading } = useUnifiedMotorcycleData(motorcycle);

  // Get the primary configuration (first/default one)
  const primaryConfig = configurations.find(c => c.is_default) || configurations[0];
  const primaryStats = stats.find(s => s.model_configuration_id === primaryConfig?.id);

  // Helper function to sync value from component
  const handleSyncFromComponent = (fieldKey: string, componentValue: any) => {
    onUpdate(fieldKey, componentValue);
  };

  // Helper function to edit component
  const handleEditComponent = (componentType: string) => {
    const component = (components as any)[componentType];
    if (component && onEditComponent) {
      onEditComponent(componentType, component.id);
    }
  };

  // Calculate completion stats
  const specFields = [
    { key: 'engine_size', label: 'Engine Size' },
    { key: 'horsepower', label: 'Horsepower' },
    { key: 'torque_nm', label: 'Torque' },
    { key: 'weight_kg', label: 'Weight' },
    { key: 'seat_height_mm', label: 'Seat Height' },
    { key: 'wheelbase_mm', label: 'Wheelbase' },
    { key: 'ground_clearance_mm', label: 'Ground Clearance' },
    { key: 'fuel_capacity_l', label: 'Fuel Capacity' },
    { key: 'top_speed_kph', label: 'Top Speed' }
  ];
  
  const getEffectiveValue = (fieldKey: string) => {
    const modelValue = (motorcycle as any)[fieldKey];
    const configValue = (primaryConfig as any)?.[fieldKey];
    const statsValue = (primaryStats as any)?.[fieldKey];
    
    // Component values mapping
    const componentValues: any = {};
    if (components.engine) {
      componentValues.engine_size = components.engine.displacement_cc;
      componentValues.horsepower = components.engine.power_hp;
      componentValues.torque_nm = components.engine.torque_nm;
    }
    if (primaryConfig) {
      componentValues.weight_kg = primaryConfig.weight_kg;
      componentValues.seat_height_mm = primaryConfig.seat_height_mm;
      componentValues.wheelbase_mm = primaryConfig.wheelbase_mm;
      componentValues.ground_clearance_mm = primaryConfig.ground_clearance_mm;
      componentValues.fuel_capacity_l = primaryConfig.fuel_capacity_l;
    }
    
    const componentValue = componentValues[fieldKey];
    return modelValue || componentValue || configValue || statsValue;
  };

  const completedSpecs = specFields.filter(field => {
    const value = getEffectiveValue(field.key);
    return value !== null && value !== undefined && value !== '' && value !== 0;
  }).length;
  
  const completionPercentage = Math.round((completedSpecs / specFields.length) * 100);

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-explorer-chrome/20 rounded w-3/4"></div>
              <div className="h-2 bg-explorer-chrome/20 rounded w-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          {components.engine && (
            <div className="mt-2 flex items-center gap-2 text-sm text-green-400">
              <Wrench className="h-4 w-4" />
              Engine component linked - specs available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Engine & Performance */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text">Engine & Performance</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SmartFieldRenderer
            label="Engine Size"
            value={motorcycle.engine_size}
            componentValue={components.engine?.displacement_cc}
            fieldKey="engine_size"
            isEditing={isEditing}
            onUpdate={onUpdate}
            onSyncFromComponent={() => handleSyncFromComponent('engine_size', components.engine?.displacement_cc)}
            onEditComponent={() => handleEditComponent('engine')}
            type="number"
            unit="cc"
            componentType="engine"
            componentName={components.engine?.name}
          />
          
          <SmartFieldRenderer
            label="Horsepower"
            value={motorcycle.horsepower}
            componentValue={components.engine?.power_hp}
            fieldKey="horsepower"
            isEditing={isEditing}
            onUpdate={onUpdate}
            onSyncFromComponent={() => handleSyncFromComponent('horsepower', components.engine?.power_hp)}
            onEditComponent={() => handleEditComponent('engine')}
            type="number"
            unit="hp"
            componentType="engine"
            componentName={components.engine?.name}
          />
          
          <SmartFieldRenderer
            label="Torque"
            value={motorcycle.torque_nm}
            componentValue={components.engine?.torque_nm}
            fieldKey="torque_nm"
            isEditing={isEditing}
            onUpdate={onUpdate}
            onSyncFromComponent={() => handleSyncFromComponent('torque_nm', components.engine?.torque_nm)}
            onEditComponent={() => handleEditComponent('engine')}
            type="number"
            unit="Nm"
            componentType="engine"
            componentName={components.engine?.name}
          />
          
          <SmartFieldRenderer
            label="Top Speed"
            value={motorcycle.top_speed_kph}
            configValue={primaryStats?.top_speed_kph}
            fieldKey="top_speed_kph"
            isEditing={isEditing}
            onUpdate={onUpdate}
            type="number"
            unit="km/h"
          />
        </CardContent>
      </Card>

      {/* Physical Dimensions */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text">Physical Dimensions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SmartFieldRenderer
            label="Weight"
            value={motorcycle.weight_kg}
            configValue={primaryConfig?.weight_kg}
            fieldKey="weight_kg"
            isEditing={isEditing}
            onUpdate={onUpdate}
            onSyncFromComponent={() => handleSyncFromComponent('weight_kg', primaryConfig?.weight_kg)}
            type="number"
            unit="kg"
          />
          
          <SmartFieldRenderer
            label="Seat Height"
            value={motorcycle.seat_height_mm}
            configValue={primaryConfig?.seat_height_mm}
            fieldKey="seat_height_mm"
            isEditing={isEditing}
            onUpdate={onUpdate}
            onSyncFromComponent={() => handleSyncFromComponent('seat_height_mm', primaryConfig?.seat_height_mm)}
            type="number"
            unit="mm"
          />
          
          <SmartFieldRenderer
            label="Wheelbase"
            value={motorcycle.wheelbase_mm}
            configValue={primaryConfig?.wheelbase_mm}
            fieldKey="wheelbase_mm"
            isEditing={isEditing}
            onUpdate={onUpdate}
            onSyncFromComponent={() => handleSyncFromComponent('wheelbase_mm', primaryConfig?.wheelbase_mm)}
            type="number"
            unit="mm"
          />
          
          <SmartFieldRenderer
            label="Ground Clearance"
            value={motorcycle.ground_clearance_mm}
            configValue={primaryConfig?.ground_clearance_mm}
            fieldKey="ground_clearance_mm"
            isEditing={isEditing}
            onUpdate={onUpdate}
            onSyncFromComponent={() => handleSyncFromComponent('ground_clearance_mm', primaryConfig?.ground_clearance_mm)}
            type="number"
            unit="mm"
          />
          
          <SmartFieldRenderer
            label="Fuel Capacity"
            value={motorcycle.fuel_capacity_l}
            configValue={primaryConfig?.fuel_capacity_l}
            fieldKey="fuel_capacity_l"
            isEditing={isEditing}
            onUpdate={onUpdate}
            onSyncFromComponent={() => handleSyncFromComponent('fuel_capacity_l', primaryConfig?.fuel_capacity_l)}
            type="number"
            unit="L"
          />
        </CardContent>
      </Card>

      {/* Additional Details */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text">Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SmartFieldRenderer
            label="Description"
            value={motorcycle.base_description}
            fieldKey="base_description"
            isEditing={isEditing}
            onUpdate={onUpdate}
            type="textarea"
          />
          
          <SmartFieldRenderer
            label="Summary"
            value={motorcycle.summary}
            fieldKey="summary"
            isEditing={isEditing}
            onUpdate={onUpdate}
            type="textarea"
          />
          
          <Separator className="bg-explorer-chrome/30" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SmartFieldRenderer
              label="Production Start"
              value={motorcycle.production_start_year}
              fieldKey="production_start_year"
              isEditing={isEditing}
              onUpdate={onUpdate}
              type="number"
            />
            
            <SmartFieldRenderer
              label="Production End"
              value={motorcycle.production_end_year}
              fieldKey="production_end_year"
              isEditing={isEditing}
              onUpdate={onUpdate}
              type="number"
            />
            
            <SmartFieldRenderer
              label="Difficulty Level"
              value={motorcycle.difficulty_level}
              fieldKey="difficulty_level"
              isEditing={isEditing}
              onUpdate={onUpdate}
              type="number"
              unit="1-10"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartMotorcycleSpecsForm;
