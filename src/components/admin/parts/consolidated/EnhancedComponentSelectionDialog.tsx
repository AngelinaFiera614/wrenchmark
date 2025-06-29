
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Settings, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { assignComponentToModel, removeComponentFromModel } from "@/services/modelComponent/assignmentService";
import { useComponentAssignmentRefresh } from "@/hooks/useComponentAssignmentRefresh";

interface EnhancedComponentSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  componentType: string | null;
  currentComponentId?: string;
  onComponentAssigned: () => void;
  modelId?: string;
}

const EnhancedComponentSelectionDialog = ({
  open,
  onClose,
  componentType,
  currentComponentId,
  onComponentAssigned,
  modelId
}: EnhancedComponentSelectionDialogProps) => {
  const { toast } = useToast();
  const [assigning, setAssigning] = useState(false);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(currentComponentId || null);
  const { refreshAfterAssignment } = useComponentAssignmentRefresh();

  // Get the table name for the component type
  const getTableName = (type: string) => {
    switch (type) {
      case 'engine': return 'engines';
      case 'brake_system': return 'brake_systems';
      case 'frame': return 'frames';
      case 'suspension': return 'suspensions';
      case 'wheel': return 'wheels';
      default: return 'engines';
    }
  };

  // Fetch available components
  const { data: components = [], isLoading } = useQuery({
    queryKey: ['components', componentType],
    queryFn: async () => {
      if (!componentType) return [];
      
      const tableName = getTableName(componentType);
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('is_draft', false)
        .order('name');

      if (error) {
        console.error(`Error fetching ${componentType} components:`, error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!componentType && open
  });

  const handleAssignComponent = async (componentId: string) => {
    if (!componentType || !modelId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Missing component type or model ID"
      });
      return;
    }

    setAssigning(true);
    try {
      console.log(`Assigning ${componentType} component ${componentId} to model ${modelId}`);
      
      const result = await assignComponentToModel(modelId, componentType as any, componentId);
      
      if (result) {
        toast({
          title: "Component Assigned",
          description: `${componentType.replace('_', ' ')} has been successfully assigned.`
        });

        // Refresh cache
        await refreshAfterAssignment(modelId);
        
        // Call the callback to refresh parent components
        onComponentAssigned();
        
        // Close dialog
        onClose();
      } else {
        throw new Error('Assignment returned null');
      }
    } catch (error: any) {
      console.error('Assignment error:', error);
      toast({
        variant: "destructive",
        title: "Assignment Failed",
        description: error.message || `Failed to assign ${componentType.replace('_', ' ')}`
      });
    } finally {
      setAssigning(false);
    }
  };

  const handleRemoveComponent = async () => {
    if (!componentType || !modelId) return;

    setAssigning(true);
    try {
      console.log(`Removing ${componentType} component from model ${modelId}`);
      
      await removeComponentFromModel(modelId, componentType as any);
      
      toast({
        title: "Component Removed",
        description: `${componentType.replace('_', ' ')} has been removed.`
      });

      // Refresh cache
      await refreshAfterAssignment(modelId);
      
      // Call the callback to refresh parent components
      onComponentAssigned();
      
      // Close dialog
      onClose();
    } catch (error: any) {
      console.error('Removal error:', error);
      toast({
        variant: "destructive",
        title: "Removal Failed",
        description: error.message || `Failed to remove ${componentType.replace('_', ' ')}`
      });
    } finally {
      setAssigning(false);
    }
  };

  if (!componentType) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Select {componentType.replace('_', ' ')} Component
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {currentComponentId && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    Current Assignment
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveComponent}
                  disabled={assigning}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  {assigning ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Remove"
                  )}
                </Button>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-accent-teal" />
              <span className="ml-2 text-muted-foreground">Loading components...</span>
            </div>
          ) : components.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No {componentType.replace('_', ' ')} components available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {components.map((component: any) => (
                <Card
                  key={component.id}
                  className={`cursor-pointer transition-colors ${
                    selectedComponentId === component.id
                      ? 'ring-2 ring-accent-teal bg-accent-teal/5'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedComponentId(component.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{component.name || 'Unnamed Component'}</h4>
                        <div className="text-sm text-muted-foreground mt-1">
                          {componentType === 'engine' && component.displacement_cc && (
                            <span>{component.displacement_cc}cc</span>
                          )}
                          {componentType === 'brake_system' && component.type && (
                            <span>{component.type}</span>
                          )}
                          {componentType === 'frame' && component.material && (
                            <span>{component.material}</span>
                          )}
                        </div>
                      </div>
                      {currentComponentId === component.id && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Current
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={assigning}>
            Cancel
          </Button>
          {selectedComponentId && selectedComponentId !== currentComponentId && (
            <Button
              onClick={() => handleAssignComponent(selectedComponentId)}
              disabled={assigning}
              className="bg-accent-teal text-black hover:bg-accent-teal/80"
            >
              {assigning ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Assigning...
                </>
              ) : (
                "Assign Component"
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedComponentSelectionDialog;
