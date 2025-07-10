import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Settings, 
  CheckCircle, 
  AlertTriangle, 
  Loader2,
  Cog,
  Disc,
  Box,
  Waves,
  Circle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useAssignmentActions } from "@/components/admin/parts/assignment/hooks/useAssignmentActions";
import { fetchEngines } from "@/services/engineService";
import { fetchBrakes } from "@/services/brakeService";
import { fetchFrames } from "@/services/frameService";
import { fetchSuspensions } from "@/services/suspensionService";
import { fetchWheels } from "@/services/wheelService";

interface ComponentAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedModel?: any;
  onSuccess: () => void;
}

const ComponentAssignmentDialog = ({ 
  open, 
  onOpenChange, 
  selectedModel,
  onSuccess 
}: ComponentAssignmentDialogProps) => {
  const { toast } = useToast();
  const [loadingComponents, setLoadingComponents] = useState<Record<string, boolean>>({});

  // Use the assignment actions hook
  const {
    assignments,
    loading: globalLoading,
    handleAssignComponent,
    handleRemoveComponent,
    refetch
  } = useAssignmentActions(selectedModel);

  // Fetch available components
  const { data: engines = [] } = useQuery({
    queryKey: ["engines"],
    queryFn: fetchEngines
  });

  const { data: brakes = [] } = useQuery({
    queryKey: ["brake-systems"],
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
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    },
    { 
      key: 'brake_system', 
      label: 'Brake System', 
      icon: Disc,
      data: brakes,
      color: 'bg-red-500/20 text-red-400 border-red-500/30'
    },
    { 
      key: 'frame', 
      label: 'Frame', 
      icon: Box,
      data: frames,
      color: 'bg-green-500/20 text-green-400 border-green-500/30'
    },
    { 
      key: 'suspension', 
      label: 'Suspension', 
      icon: Waves,
      data: suspensions,
      color: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    },
    { 
      key: 'wheel', 
      label: 'Wheels', 
      icon: Circle,
      data: wheels,
      color: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    }
  ];

  const getAssignedComponent = (componentType: string) => {
    return assignments.find(a => a.component_type === componentType);
  };

  const getComponentName = (componentType: string, componentId: string) => {
    const typeData = componentTypes.find(t => t.key === componentType)?.data || [];
    const component = typeData.find((c: any) => c.id === componentId);
    return component?.name || 'Unknown Component';
  };

  const handleAssign = async (componentType: string, componentId: string) => {
    setLoadingComponents(prev => ({ ...prev, [componentType]: true }));
    try {
      await handleAssignComponent(componentType, componentId);
      await refetch();
      onSuccess();
    } catch (error) {
      console.error('Assignment error:', error);
    } finally {
      setLoadingComponents(prev => ({ ...prev, [componentType]: false }));
    }
  };

  const handleRemove = async (componentType: string) => {
    setLoadingComponents(prev => ({ ...prev, [componentType]: true }));
    try {
      await handleRemoveComponent(componentType);
      await refetch();
      onSuccess();
    } catch (error) {
      console.error('Removal error:', error);
    } finally {
      setLoadingComponents(prev => ({ ...prev, [componentType]: false }));
    }
  };

  const renderComponentCard = (componentType: typeof componentTypes[number]) => {
    const assignment = getAssignedComponent(componentType.key);
    const isAssigned = !!assignment;
    const isLoading = loadingComponents[componentType.key];
    const Icon = componentType.icon;
    
    return (
      <Card key={componentType.key} className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className="h-5 w-5 text-accent-teal" />
              <span>{componentType.label}</span>
            </div>
            <Badge 
              variant={isAssigned ? "default" : "outline"}
              className={isAssigned ? componentType.color : ""}
            >
              {isAssigned ? (
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Assigned
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Not Assigned
                </div>
              )}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isAssigned && (
            <div className={`p-3 rounded border ${componentType.color}`}>
              <div className="font-medium">
                {getComponentName(componentType.key, assignment.component_id)}
              </div>
              <div className="text-xs text-explorer-text-muted mt-1">
                Default for all configurations
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Select
              value={assignment?.component_id || ""}
              onValueChange={(value) => value && handleAssign(componentType.key, value)}
              disabled={isLoading || globalLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${componentType.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {componentType.data?.map((component: any) => (
                  <SelectItem key={component.id} value={component.id}>
                    <div className="flex flex-col">
                      <span>{component.name}</span>
                      {component.displacement_cc && (
                        <span className="text-xs text-muted-foreground">
                          {component.displacement_cc}cc
                        </span>
                      )}
                      {component.type && (
                        <span className="text-xs text-muted-foreground">
                          {component.type}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {isAssigned && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRemove(componentType.key)}
                disabled={isLoading || globalLoading}
                className="w-full text-orange-400 border-orange-400/30 hover:bg-orange-400/20"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Remove Assignment"
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (!selectedModel) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Component Assignment
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-8 text-muted-foreground">
            <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-medium mb-2">No Model Selected</h3>
            <p>Please select a motorcycle model to manage its components.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Component Assignment
            <Badge variant="outline" className="ml-2">
              {selectedModel.name}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Settings className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800 dark:text-blue-200">
                  Model-Level Component Assignment
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Components assigned here will be the default for all configurations of this model. 
                  Individual configurations can override these assignments as needed.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {componentTypes.map(renderComponentCard)}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComponentAssignmentDialog;