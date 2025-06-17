
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Cog, 
  Disc, 
  Box, 
  Waves, 
  Circle,
  Plus,
  Zap,
  Clock
} from "lucide-react";
import ComponentOverrideIndicator from "./ComponentOverrideIndicator";
import ComponentSelectionDialog from "./ComponentSelectionDialog";

interface ComponentAssignmentWorkflowProps {
  configurationData: any;
  onComponentChange: (componentType: string, componentId: string | null, isOverride: boolean) => void;
  selectedModelData?: any;
}

const ComponentAssignmentWorkflow: React.FC<ComponentAssignmentWorkflowProps> = ({
  configurationData,
  onComponentChange,
  selectedModelData
}) => {
  const [activeComponentDialog, setActiveComponentDialog] = useState<string | null>(null);

  const componentTypes = [
    { 
      key: 'engine', 
      label: 'Engine', 
      icon: Cog, 
      description: 'The heart of the motorcycle',
      priority: 'high'
    },
    { 
      key: 'brake_system', 
      label: 'Brake System', 
      icon: Disc, 
      description: 'Stopping power and safety systems',
      priority: 'high'
    },
    { 
      key: 'frame', 
      label: 'Frame', 
      icon: Box, 
      description: 'Structural foundation and geometry',
      priority: 'medium'
    },
    { 
      key: 'suspension', 
      label: 'Suspension', 
      icon: Waves, 
      description: 'Ride comfort and handling',
      priority: 'medium'
    },
    { 
      key: 'wheel', 
      label: 'Wheels', 
      icon: Circle, 
      description: 'Rolling stock and tire setup',
      priority: 'low'
    }
  ];

  const getComponentName = (componentType: string, componentId: string) => {
    // This would be enhanced with actual component data lookup
    return componentId ? `Component ${componentId.slice(0, 8)}...` : 'Unknown Component';
  };

  const handleToggleOverride = (componentType: string, isOverride: boolean) => {
    const currentComponentId = configurationData[`${componentType}_id`];
    onComponentChange(componentType, isOverride ? currentComponentId : null, isOverride);
  };

  const handleSelectComponent = (componentType: string) => {
    setActiveComponentDialog(componentType);
  };

  const handleComponentAssigned = () => {
    setActiveComponentDialog(null);
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <Zap className="h-3 w-3 text-red-400" />;
      case 'medium': return <Clock className="h-3 w-3 text-yellow-400" />;
      default: return <Circle className="h-3 w-3 text-gray-400" />;
    }
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
              {getPriorityIcon(componentType.priority)}
            </div>
          </CardTitle>
          <p className="text-sm text-explorer-text-muted">{componentType.description}</p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <ComponentOverrideIndicator
            isOverride={isOverride}
            hasComponent={!!selectedComponentId}
            componentName={selectedComponentId ? getComponentName(componentType.key, selectedComponentId) : undefined}
            onToggleOverride={(override) => handleToggleOverride(componentType.key, override)}
            onSelectComponent={() => handleSelectComponent(componentType.key)}
          />

          {/* Quick Actions */}
          {!selectedComponentId && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSelectComponent(componentType.key)}
                className="flex-1 text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Assign Component
              </Button>
            </div>
          )}

          {/* Component Details */}
          {selectedComponentId && (
            <div className="p-3 bg-accent-teal/10 rounded border border-accent-teal/30">
              <div className="text-sm">
                <div className="font-medium text-accent-teal">
                  {getComponentName(componentType.key, selectedComponentId)}
                </div>
                <div className="text-xs text-explorer-text-muted mt-1">
                  {isOverride ? 'Configuration-specific' : 'Inherited from model'}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // Calculate completion status
  const assignedComponents = componentTypes.filter(type => 
    configurationData[`${type.key}_id`]
  ).length;
  const completionPercentage = Math.round((assignedComponents / componentTypes.length) * 100);

  return (
    <div className="space-y-6">
      {/* Workflow Header */}
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-blue-800 dark:text-blue-200">
              Component Assignment Workflow
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              Assign components to this configuration. Use overrides to customize beyond model defaults.
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-blue-800 dark:text-blue-200">
              {assignedComponents}/{componentTypes.length} Assigned
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400">
              {completionPercentage}% Complete
            </div>
          </div>
        </div>
      </div>

      {/* Component Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {componentTypes.map(renderComponentCard)}
      </div>

      {/* Component Selection Dialog */}
      <ComponentSelectionDialog
        open={!!activeComponentDialog}
        onClose={() => setActiveComponentDialog(null)}
        componentType={activeComponentDialog}
        configurationId={configurationData.id}
        currentComponentId={activeComponentDialog ? configurationData[`${activeComponentDialog}_id`] : undefined}
        onComponentAssigned={handleComponentAssigned}
      />
    </div>
  );
};

export default ComponentAssignmentWorkflow;
