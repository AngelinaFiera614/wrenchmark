
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wrench, Inheritance, Settings, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import {
  getModelComponentAssignments,
  assignComponentToModel,
  updateModelComponentAssignment,
  removeComponentFromModel,
  ModelComponentAssignment
} from "@/services/modelComponentService";
import { fetchEngines } from "@/services/engineService";
import { fetchBrakes } from "@/services/brakeService";
import { fetchFrames } from "@/services/frameService";
import { fetchSuspensions } from "@/services/suspensionService";
import { fetchWheels } from "@/services/wheelService";

interface ModelComponentAssignmentDialogProps {
  open: boolean;
  onClose: () => void;
  modelId: string;
  modelName: string;
  onSuccess: () => void;
}

const ModelComponentAssignmentDialog = ({
  open,
  onClose,
  modelId,
  modelName,
  onSuccess
}: ModelComponentAssignmentDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("assignments");

  // Fetch current assignments
  const { data: assignments, refetch: refetchAssignments } = useQuery({
    queryKey: ['model-component-assignments', modelId],
    queryFn: () => getModelComponentAssignments(modelId),
    enabled: open && !!modelId
  });

  // Fetch available components
  const { data: engines } = useQuery({
    queryKey: ['engines'],
    queryFn: fetchEngines
  });

  const { data: brakes } = useQuery({
    queryKey: ['brakes'],
    queryFn: fetchBrakes
  });

  const { data: frames } = useQuery({
    queryKey: ['frames'],
    queryFn: fetchFrames
  });

  const { data: suspensions } = useQuery({
    queryKey: ['suspensions'],
    queryFn: () => fetchSuspensions()
  });

  const { data: wheels } = useQuery({
    queryKey: ['wheels'],
    queryFn: () => fetchWheels()
  });

  const componentTypes = [
    { key: 'engine', label: 'Engine', data: engines },
    { key: 'brake_system', label: 'Brake System', data: brakes },
    { key: 'frame', label: 'Frame', data: frames },
    { key: 'suspension', label: 'Suspension', data: suspensions },
    { key: 'wheel', label: 'Wheels', data: wheels }
  ] as const;

  const handleAssignComponent = async (
    componentType: ModelComponentAssignment['component_type'],
    componentId: string
  ) => {
    setLoading(true);
    try {
      const existingAssignment = assignments?.find(a => a.component_type === componentType);
      
      if (existingAssignment) {
        await updateModelComponentAssignment(modelId, componentType, componentId);
      } else {
        await assignComponentToModel(modelId, componentType, componentId);
      }
      
      await refetchAssignments();
      onSuccess();
      
      toast({
        title: "Component Assigned",
        description: `${componentType} has been assigned to ${modelName}.`
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Assignment Failed",
        description: error.message || "Failed to assign component."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveComponent = async (componentType: ModelComponentAssignment['component_type']) => {
    setLoading(true);
    try {
      await removeComponentFromModel(modelId, componentType);
      await refetchAssignments();
      onSuccess();
      
      toast({
        title: "Component Removed",
        description: `${componentType} has been removed from ${modelName}.`
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Removal Failed",
        description: error.message || "Failed to remove component."
      });
    } finally {
      setLoading(false);
    }
  };

  const getComponentName = (componentType: string, componentId: string) => {
    const typeData = componentTypes.find(t => t.key === componentType)?.data;
    const component = typeData?.find((c: any) => c.id === componentId);
    return component?.name || 'Unknown Component';
  };

  const renderAssignmentCard = (componentType: typeof componentTypes[number]) => {
    const assignment = assignments?.find(a => a.component_type === componentType.key);
    const isAssigned = !!assignment;
    
    return (
      <Card key={componentType.key} className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>{componentType.label}</span>
            <Badge variant={isAssigned ? "secondary" : "outline"}>
              {isAssigned ? "Assigned" : "Not Assigned"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isAssigned && (
            <div className="p-3 bg-explorer-dark rounded border border-accent-teal/30">
              <div className="font-medium text-accent-teal">
                {getComponentName(componentType.key, assignment.component_id)}
              </div>
              <div className="text-xs text-explorer-text-muted mt-1">
                Assigned to all trim levels by default
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Select
              value={assignment?.component_id || ""}
              onValueChange={(value) => value && handleAssignComponent(componentType.key, value)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${componentType.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {componentType.data?.map((component: any) => (
                  <SelectItem key={component.id} value={component.id}>
                    {component.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {isAssigned && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRemoveComponent(componentType.key)}
                disabled={loading}
                className="w-full text-orange-400 border-orange-400/30 hover:bg-orange-400/20"
              >
                Remove Assignment
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Model Component Assignments
            <Badge variant="outline" className="ml-2">{modelName}</Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="assignments">Component Assignments</TabsTrigger>
            <TabsTrigger value="inheritance">Inheritance Rules</TabsTrigger>
          </TabsList>
          
          <TabsContent value="assignments" className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Inheritance className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-200">
                    Model-Level Assignment
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    Components assigned at the model level will be inherited by all trim levels. 
                    Individual trim levels can override these assignments as needed.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {componentTypes.map(renderAssignmentCard)}
            </div>
          </TabsContent>
          
          <TabsContent value="inheritance" className="space-y-6">
            <Card className="bg-explorer-card border-explorer-chrome/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Inheritance className="h-5 w-5" />
                  How Component Inheritance Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm text-explorer-text">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent-teal text-black flex items-center justify-center text-xs font-bold">1</div>
                    <div>
                      <div className="font-medium">Model-Level Assignment</div>
                      <div className="text-explorer-text-muted">Components assigned at the model level become the default for all trim levels.</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent-teal text-black flex items-center justify-center text-xs font-bold">2</div>
                    <div>
                      <div className="font-medium">Trim-Level Override</div>
                      <div className="text-explorer-text-muted">Individual trim levels can override the model default with a different component.</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent-teal text-black flex items-center justify-center text-xs font-bold">3</div>
                    <div>
                      <div className="font-medium">Inheritance Indicator</div>
                      <div className="text-explorer-text-muted">The system clearly shows which components are inherited vs. overridden at the trim level.</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-6 border-t border-explorer-chrome/30">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModelComponentAssignmentDialog;
