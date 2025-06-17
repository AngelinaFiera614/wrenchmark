
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Check, X, Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(currentComponentId || null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Map component types to their database table names (fixed)
  const tableMap: Record<string, string> = {
    engine: "engines",
    brake_system: "brake_systems", 
    frame: "frames",
    suspension: "suspensions",
    wheel: "wheels"
  };

  const tableName = componentType ? tableMap[componentType] : null;

  // Fetch components
  const { data: components = [], isLoading } = useQuery({
    queryKey: [tableName, searchTerm],
    queryFn: async () => {
      if (!tableName) return [];
      
      let query = supabase.from(tableName).select("*");
      
      if (searchTerm) {
        // Search in different fields based on component type
        if (componentType === "engine") {
          query = query.or(`name.ilike.%${searchTerm}%,engine_type.ilike.%${searchTerm}%`);
        } else if (componentType === "brake_system") {
          query = query.or(`type.ilike.%${searchTerm}%,brake_brand.ilike.%${searchTerm}%`);
        } else if (componentType === "frame") {
          query = query.or(`type.ilike.%${searchTerm}%,material.ilike.%${searchTerm}%`);
        } else if (componentType === "suspension") {
          query = query.or(`front_type.ilike.%${searchTerm}%,rear_type.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%`);
        } else if (componentType === "wheel") {
          query = query.or(`type.ilike.%${searchTerm}%,front_size.ilike.%${searchTerm}%,rear_size.ilike.%${searchTerm}%`);
        }
      }
      
      const { data, error } = await query.order('created_at', { ascending: false }).limit(50);
      if (error) throw error;
      return data || [];
    },
    enabled: !!tableName && open
  });

  // Assign component mutation
  const assignComponentMutation = useMutation({
    mutationFn: async (componentId: string | null) => {
      if (!configurationId || !componentType) throw new Error("Missing configuration or component type");
      
      const fieldName = `${componentType}_id`;
      const { error } = await supabase
        .from("model_configurations")
        .update({ [fieldName]: componentId })
        .eq("id", configurationId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Component Updated",
        description: `${getComponentTypeLabel(componentType)} has been ${selectedComponentId ? 'assigned' : 'removed'} successfully.`
      });
      queryClient.invalidateQueries({ queryKey: ["admin-configurations"] });
      onComponentAssigned();
      onClose();
    },
    onError: (error) => {
      console.error("Component assignment error:", error);
      toast({
        variant: "destructive",
        title: "Assignment Failed",
        description: "Failed to update component assignment. Please try again."
      });
    }
  });

  const getComponentTypeLabel = (type: string | null) => {
    const labels: Record<string, string> = {
      engine: "Engine",
      brake_system: "Brake System",
      frame: "Frame",
      suspension: "Suspension",
      wheel: "Wheels"
    };
    return type ? labels[type] || type : "Component";
  };

  const getDisplayName = (component: any) => {
    if (!componentType) return 'Unknown';
    
    switch (componentType) {
      case "engine":
        return `${component.name || 'Unknown'} - ${component.displacement_cc}cc`;
      case "brake_system":
        return `${component.type || 'Unknown'} ${component.brake_brand ? `(${component.brake_brand})` : ''}`;
      case "frame":
        return `${component.type || 'Unknown'} ${component.material ? `- ${component.material}` : ''}`;
      case "suspension":
        return `${component.front_type || 'Unknown'} / ${component.rear_type || 'Unknown'}`;
      case "wheel":
        return `${component.type || 'Unknown'} ${component.front_size ? `(${component.front_size})` : ''}`;
      default:
        return 'Unknown';
    }
  };

  const getDisplayDetails = (component: any) => {
    if (!componentType) return '';
    
    switch (componentType) {
      case "engine":
        return `${component.power_hp ? `${component.power_hp}hp` : ''} ${component.torque_nm ? `${component.torque_nm}Nm` : ''}`.trim();
      case "brake_system":
        return `${component.front_disc_size_mm ? `Front: ${component.front_disc_size_mm}mm` : ''} ${component.rear_disc_size_mm ? `Rear: ${component.rear_disc_size_mm}mm` : ''}`.trim();
      case "frame":
        return component.construction_method || '';
      case "suspension":
        return `${component.front_travel_mm ? `F: ${component.front_travel_mm}mm` : ''} ${component.rear_travel_mm ? `R: ${component.rear_travel_mm}mm` : ''}`.trim();
      case "wheel":
        return `${component.front_size || ''} / ${component.rear_size || ''}`.trim();
      default:
        return '';
    }
  };

  const handleAssign = () => {
    assignComponentMutation.mutate(selectedComponentId);
  };

  const handleRemove = () => {
    setSelectedComponentId(null);
    assignComponentMutation.mutate(null);
  };

  if (!componentType) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-explorer-card border-explorer-chrome/30">
        <DialogHeader>
          <DialogTitle className="text-explorer-text">
            Select {getComponentTypeLabel(componentType)}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-explorer-text-muted" />
            <Input
              placeholder={`Search ${getComponentTypeLabel(componentType).toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
            />
          </div>

          {/* Components List */}
          <div className="max-h-96 overflow-y-auto space-y-2 border border-explorer-chrome/30 rounded-lg p-2">
            {isLoading ? (
              <div className="text-center py-8 text-explorer-text-muted">
                Loading {getComponentTypeLabel(componentType).toLowerCase()}...
              </div>
            ) : components.length === 0 ? (
              <div className="text-center py-8 text-explorer-text-muted">
                No {getComponentTypeLabel(componentType).toLowerCase()} found
              </div>
            ) : (
              components.map((component) => (
                <div
                  key={component.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedComponentId === component.id
                      ? "bg-accent-teal/20 border-accent-teal"
                      : "bg-explorer-dark border-explorer-chrome/30 hover:border-explorer-chrome/50"
                  }`}
                  onClick={() => setSelectedComponentId(component.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-explorer-text text-sm">
                        {getDisplayName(component)}
                      </div>
                      {getDisplayDetails(component) && (
                        <div className="text-xs text-explorer-text-muted mt-1">
                          {getDisplayDetails(component)}
                        </div>
                      )}
                    </div>
                    {selectedComponentId === component.id && (
                      <Check className="h-4 w-4 text-accent-teal flex-shrink-0" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t border-explorer-chrome/30">
            <div>
              {currentComponentId && (
                <Button
                  variant="outline"
                  onClick={handleRemove}
                  disabled={assignComponentMutation.isPending}
                  className="border-red-400/30 text-red-400 hover:bg-red-400/10"
                >
                  <X className="h-4 w-4 mr-2" />
                  Remove Current
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={onClose}
                className="border-explorer-chrome/30 text-explorer-text"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAssign}
                disabled={!selectedComponentId || assignComponentMutation.isPending}
                className="bg-accent-teal text-black hover:bg-accent-teal/80"
              >
                {assignComponentMutation.isPending ? (
                  "Assigning..."
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Assign Component
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComponentSelectionDialog;
