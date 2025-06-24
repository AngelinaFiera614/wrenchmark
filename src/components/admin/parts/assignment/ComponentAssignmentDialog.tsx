
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wrench, Settings, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ComponentAssignmentDialogProps {
  open: boolean;
  onClose: () => void;
  model: any;
  onSuccess: () => void;
}

const ComponentAssignmentDialog: React.FC<ComponentAssignmentDialogProps> = ({
  open,
  onClose,
  model,
  onSuccess
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  // Fetch current assignments for this model
  const { data: assignments = [], refetch } = useQuery({
    queryKey: ['model-assignments', model?.id],
    queryFn: async () => {
      if (!model?.id) return [];
      const { data, error } = await supabase
        .from('model_component_assignments')
        .select('*')
        .eq('model_id', model.id);

      if (error) throw error;
      return data || [];
    },
    enabled: !!model?.id
  });

  // Fetch available components
  const { data: engines = [] } = useQuery({
    queryKey: ['engines'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('engines')
        .select('id, name, displacement_cc, power_hp')
        .eq('is_draft', false)
        .order('displacement_cc');
      if (error) throw error;
      return data;
    }
  });

  const { data: brakes = [] } = useQuery({
    queryKey: ['brakes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brake_systems')
        .select('id, type, has_abs, has_traction_control')
        .eq('is_draft', false)
        .order('type');
      if (error) throw error;
      return data;
    }
  });

  const { data: frames = [] } = useQuery({
    queryKey: ['frames'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('frames')
        .select('id, type, material')
        .eq('is_draft', false)
        .order('type');
      if (error) throw error;
      return data;
    }
  });

  const { data: suspensions = [] } = useQuery({
    queryKey: ['suspensions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('suspensions')
        .select('id, front_type, rear_type, brand')
        .eq('is_draft', false)
        .order('front_type');
      if (error) throw error;
      return data;
    }
  });

  const { data: wheels = [] } = useQuery({
    queryKey: ['wheels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wheels')
        .select('id, type, front_size, rear_size')
        .eq('is_draft', false)
        .order('type');
      if (error) throw error;
      return data;
    }
  });

  const componentTypes = [
    { key: 'engine', label: 'Engine', data: engines },
    { key: 'brake_system', label: 'Brake System', data: brakes },
    { key: 'frame', label: 'Frame', data: frames },
    { key: 'suspension', label: 'Suspension', data: suspensions },
    { key: 'wheel', label: 'Wheels', data: wheels }
  ];

  const handleAssignComponent = async (componentType: string, componentId: string) => {
    setLoading(true);
    try {
      const existingAssignment = assignments.find(a => a.component_type === componentType);
      
      if (existingAssignment) {
        // Update existing assignment
        const { error } = await supabase
          .from('model_component_assignments')
          .update({ 
            component_id: componentId, 
            updated_at: new Date().toISOString() 
          })
          .eq('id', existingAssignment.id);
        
        if (error) throw error;
      } else {
        // Create new assignment
        const { error } = await supabase
          .from('model_component_assignments')
          .insert({
            model_id: model.id,
            component_type: componentType,
            component_id: componentId,
            assignment_type: 'standard',
            is_default: true
          });
        
        if (error) throw error;
      }
      
      await refetch();
      queryClient.invalidateQueries({ queryKey: ['model-assignments-status'] });
      
      toast({
        title: "Component Assigned",
        description: `${componentType.replace('_', ' ')} has been assigned to ${model.name}.`
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

  const handleRemoveComponent = async (componentType: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('model_component_assignments')
        .delete()
        .eq('model_id', model.id)
        .eq('component_type', componentType);
      
      if (error) throw error;
      
      await refetch();
      queryClient.invalidateQueries({ queryKey: ['model-assignments-status'] });
      
      toast({
        title: "Component Removed",
        description: `${componentType.replace('_', ' ')} has been removed from ${model.name}.`
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
    if (!typeData) return 'Unknown Component';
    
    const component = typeData.find((c: any) => c.id === componentId);
    if (!component) return 'Unknown Component';
    
    // Handle different component types with proper type checking
    switch (componentType) {
      case 'engine':
        return component.name || `${component.displacement_cc || 'Unknown'}cc Engine`;
      case 'brake_system':
        return component.type || 'Brake System';
      case 'frame':
        return component.type || 'Frame';
      case 'suspension':
        return `${component.front_type || 'Unknown'} / ${component.rear_type || 'Unknown'}`;
      case 'wheel':
        return component.type || 'Wheels';
      default:
        return 'Unknown Component';
    }
  };

  const renderAssignmentCard = (componentType: any) => {
    const assignment = assignments.find(a => a.component_type === componentType.key);
    const isAssigned = !!assignment;
    
    return (
      <Card key={componentType.key} className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>{componentType.label}</span>
            <Badge variant={isAssigned ? "default" : "outline"}>
              {isAssigned ? (
                <><CheckCircle className="h-3 w-3 mr-1" />Assigned</>
              ) : (
                <><AlertTriangle className="h-3 w-3 mr-1" />Not Assigned</>
              )}
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
                    {getComponentName(componentType.key, component.id)}
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

  if (!model) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Component Assignments
            <Badge variant="outline" className="ml-2">
              {model.brands?.[0]?.name || 'Unknown'} {model.name}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Wrench className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800 dark:text-blue-200">
                  Model-Level Assignment
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Components assigned here will be inherited by all trim levels. 
                  Individual trim levels can override these assignments as needed.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {componentTypes.map(renderAssignmentCard)}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-6 border-t border-explorer-chrome/30">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onSuccess} className="bg-accent-teal text-black hover:bg-accent-teal/80">
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComponentAssignmentDialog;
