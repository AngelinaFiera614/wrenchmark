
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Cog, 
  Disc, 
  Box, 
  Waves, 
  Circle,
  Link,
  Unlink,
  ArrowDown,
  AlertTriangle
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchEngines } from "@/services/engineService";
import { fetchBrakes } from "@/services/brakeService";
import { fetchFrames } from "@/services/frameService";
import { fetchSuspensions } from "@/services/suspensionService";
import { fetchWheels } from "@/services/wheelService";

interface ComponentAssignmentTabProps {
  configurationData: any;
  onComponentChange: (componentType: string, componentId: string | null, isOverride: boolean) => void;
  selectedModelData?: any;
}

const ComponentAssignmentTab: React.FC<ComponentAssignmentTabProps> = ({
  configurationData,
  onComponentChange,
  selectedModelData
}) => {
  // Fetch all component types
  const { data: engines = [] } = useQuery({
    queryKey: ["engines"],
    queryFn: fetchEngines
  });

  const { data: brakes = [] } = useQuery({
    queryKey: ["brakes"],
    queryFn: fetchBrakes
  });

  const { data: frames = [] } = useQuery({
    queryKey: ["frames"],
    queryFn: fetchFrames
  });

  const { data: suspensions = [] } = useQuery({
    queryKey: ["suspensions"],
    queryFn: fetchSuspensions
  });

  const { data: wheels = [] } = useQuery({
    queryKey: ["wheels"],
    queryFn: fetchWheels
  });

  const componentTypes = [
    { 
      key: 'engine', 
      label: 'Engine', 
      icon: Cog, 
      data: engines,
      description: 'The heart of the motorcycle'
    },
    { 
      key: 'brake_system', 
      label: 'Brake System', 
      icon: Disc, 
      data: brakes,
      description: 'Stopping power and safety systems'
    },
    { 
      key: 'frame', 
      label: 'Frame', 
      icon: Box, 
      data: frames,
      description: 'Structural foundation and geometry'
    },
    { 
      key: 'suspension', 
      label: 'Suspension', 
      icon: Waves, 
      data: suspensions,
      description: 'Ride comfort and handling'
    },
    { 
      key: 'wheel', 
      label: 'Wheels', 
      icon: Circle, 
      data: wheels,
      description: 'Rolling stock and tire setup'
    }
  ];

  const handleOverrideToggle = (componentType: string, isOverride: boolean) => {
    const currentComponentId = configurationData[`${componentType}_id`];
    onComponentChange(componentType, isOverride ? currentComponentId : null, isOverride);
  };

  const handleComponentSelect = (componentType: string, componentId: string) => {
    const isOverride = configurationData[`${componentType}_override`] || false;
    onComponentChange(componentType, componentId, isOverride);
  };

  const getComponentName = (componentType: string, componentId: string) => {
    const typeData = componentTypes.find(t => t.key === componentType)?.data;
    const component = typeData?.find((c: any) => c.id === componentId);
    return component?.name || component?.type || 'Unknown Component';
  };

  const renderComponentCard = (componentType: any) => {
    const overrideField = `${componentType.key}_override`;
    const componentField = `${componentType.key}_id`;
    const isOverride = configurationData[overrideField] || false;
    const selectedComponentId = configurationData[componentField];
    const IconComponent = componentType.icon;

    return (
      <Card key={componentType.key} className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconComponent className="h-5 w-5 text-accent-teal" />
              <span>{componentType.label}</span>
            </div>
            <div className="flex items-center gap-2">
              {isOverride ? (
                <Badge variant="secondary" className="bg-accent-teal/20 text-accent-teal">
                  <Link className="h-3 w-3 mr-1" />
                  Override
                </Badge>
              ) : (
                <Badge variant="outline" className="text-explorer-text-muted">
                  <ArrowDown className="h-3 w-3 mr-1" />
                  Inherited
                </Badge>
              )}
            </div>
          </CardTitle>
          <p className="text-sm text-explorer-text-muted">{componentType.description}</p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Override Toggle */}
          <div className="flex items-center justify-between p-3 bg-explorer-dark rounded border border-explorer-chrome/30">
            <div className="flex items-center space-x-2">
              <Switch
                id={`override-${componentType.key}`}
                checked={isOverride}
                onCheckedChange={(checked) => handleOverrideToggle(componentType.key, checked)}
              />
              <Label htmlFor={`override-${componentType.key}`} className="text-sm">
                Override model default
              </Label>
            </div>
          </div>

          {/* Component Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {isOverride ? 'Select Component' : 'Model Default'}
            </Label>
            
            {isOverride ? (
              <Select
                value={selectedComponentId || ""}
                onValueChange={(value) => handleComponentSelect(componentType.key, value)}
              >
                <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30">
                  <SelectValue placeholder={`Select ${componentType.label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No component assigned</SelectItem>
                  {componentType.data.map((component: any) => (
                    <SelectItem key={component.id} value={component.id}>
                      {component.name || component.type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="p-3 bg-explorer-chrome/10 rounded border border-explorer-chrome/30">
                <div className="flex items-center gap-2 text-sm text-explorer-text-muted">
                  <ArrowDown className="h-4 w-4" />
                  <span>
                    {selectedComponentId 
                      ? `Inherits: ${getComponentName(componentType.key, selectedComponentId)}`
                      : 'No model default set'
                    }
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Current Assignment Display */}
          {selectedComponentId && (
            <div className="p-3 bg-accent-teal/10 rounded border border-accent-teal/30">
              <div className="text-sm">
                <div className="font-medium text-accent-teal">
                  {getComponentName(componentType.key, selectedComponentId)}
                </div>
                <div className="text-xs text-explorer-text-muted mt-1">
                  Component ID: {selectedComponentId.slice(0, 8)}...
                </div>
              </div>
            </div>
          )}

          {/* No Assignment Warning */}
          {!selectedComponentId && (
            <div className="flex items-center gap-2 p-3 bg-orange-900/20 border border-orange-500/30 rounded">
              <AlertTriangle className="h-4 w-4 text-orange-400" />
              <span className="text-orange-400 text-sm">No component assigned</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <ArrowDown className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800 dark:text-blue-200">
              Component Inheritance
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              By default, configurations inherit components from the model level. 
              Toggle "Override model default" to assign specific components for this trim level.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {componentTypes.map(renderComponentCard)}
      </div>
    </div>
  );
};

export default ComponentAssignmentTab;
