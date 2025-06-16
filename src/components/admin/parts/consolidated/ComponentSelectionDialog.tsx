
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";

interface ComponentSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  componentType: string | null;
  configurationId?: string;
  currentComponentId?: string;
  onComponentAssigned: () => void;
}

const ComponentSelectionDialog: React.FC<ComponentSelectionDialogProps> = ({
  open,
  onClose,
  componentType,
  configurationId,
  currentComponentId,
  onComponentAssigned
}) => {
  const [selectedComponentId, setSelectedComponentId] = useState<string>(currentComponentId || "");
  const [isAssigning, setIsAssigning] = useState(false);
  const { toast } = useToast();

  const getTableName = (type: string) => {
    const typeMap: Record<string, string> = {
      engine: 'engines',
      brake_system: 'brake_systems',
      frame: 'frames',
      suspension: 'suspensions',
      wheel: 'wheels'
    };
    return typeMap[type] || type;
  };

  const getFieldName = (type: string) => {
    return type === 'brake_system' ? 'brake_system_id' : `${type}_id`;
  };

  const { data: components = [], isLoading } = useQuery({
    queryKey: [getTableName(componentType || ''), componentType],
    queryFn: async () => {
      if (!componentType) return [];
      
      const tableName = getTableName(componentType);
      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!componentType && open
  });

  const handleAssign = async () => {
    if (!selectedComponentId || !configurationId || !componentType) return;

    setIsAssigning(true);
    try {
      const fieldName = getFieldName(componentType);
      const { error } = await supabase
        .from("model_configurations")
        .update({ [fieldName]: selectedComponentId })
        .eq("id", configurationId);

      if (error) throw error;

      toast({
        title: "Component Assigned",
        description: `${componentType.replace('_', ' ')} has been successfully assigned.`
      });

      onComponentAssigned();
    } catch (error) {
      console.error("Error assigning component:", error);
      toast({
        variant: "destructive",
        title: "Assignment Failed",
        description: "Failed to assign component. Please try again."
      });
    } finally {
      setIsAssigning(false);
    }
  };

  const getComponentDisplay = (component: any) => {
    if (componentType === 'engine') {
      return `${component.name} - ${component.displacement_cc}cc`;
    }
    if (componentType === 'frame') {
      return `${component.type} (${component.material || 'Unknown material'})`;
    }
    if (componentType === 'suspension') {
      return `${component.front_type || 'Standard'} / ${component.rear_type || 'Standard'}`;
    }
    if (componentType === 'wheel') {
      return `${component.type || 'Standard'} - ${component.front_size || 'Unknown'} / ${component.rear_size || 'Unknown'}`;
    }
    return component.name || component.type || 'Unknown';
  };

  // Validate component ID - ensure it's a non-empty string
  const getValidComponents = () => {
    return components.filter(component => 
      component.id && 
      typeof component.id === 'string' && 
      component.id.trim() !== '' &&
      component.id !== 'undefined' &&
      component.id !== 'null'
    );
  };

  const validComponents = getValidComponents();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-explorer-card border-explorer-chrome/30">
        <DialogHeader>
          <DialogTitle className="text-explorer-text">
            Select {componentType?.replace('_', ' ')} Component
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="h-6 w-6 animate-spin text-accent-teal" />
              <span className="ml-2 text-explorer-text-muted">Loading components...</span>
            </div>
          ) : validComponents.length > 0 ? (
            <div className="space-y-4">
              <Select value={selectedComponentId} onValueChange={setSelectedComponentId}>
                <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text">
                  <SelectValue placeholder={`Select a ${componentType?.replace('_', ' ')} component`} />
                </SelectTrigger>
                <SelectContent className="bg-explorer-dark border-explorer-chrome/30">
                  {validComponents.map((component) => (
                    <SelectItem 
                      key={component.id} 
                      value={component.id}
                      className="text-explorer-text hover:bg-explorer-chrome/20"
                    >
                      {getComponentDisplay(component)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAssign}
                  disabled={!selectedComponentId || isAssigning}
                  className="bg-accent-teal text-black hover:bg-accent-teal/80"
                >
                  {isAssigning ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin mr-2" />
                      Assigning...
                    </>
                  ) : (
                    'Assign Component'
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-explorer-text-muted">
                No valid {componentType?.replace('_', ' ')} components found.
              </p>
              <p className="text-sm text-explorer-text-muted mt-2">
                Please create components in the Component Library first.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComponentSelectionDialog;
