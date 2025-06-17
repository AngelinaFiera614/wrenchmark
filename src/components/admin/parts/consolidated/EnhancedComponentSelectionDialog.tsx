
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Library, 
  Plus,
  Check,
  X
} from "lucide-react";
import ComponentLibraryIntegration from "./ComponentLibraryIntegration";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EnhancedComponentSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  componentType: string | null;
  configurationId?: string;
  currentComponentId?: string;
  onComponentAssigned: () => void;
}

const EnhancedComponentSelectionDialog: React.FC<EnhancedComponentSelectionDialogProps> = ({
  open,
  onClose,
  componentType,
  configurationId,
  currentComponentId,
  onComponentAssigned
}) => {
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(currentComponentId || null);
  const [activeTab, setActiveTab] = useState("library");
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  // Assign component mutation
  const assignComponentMutation = useMutation({
    mutationFn: async (componentId: string | null) => {
      if (!configurationId || !componentType) throw new Error("Missing configuration or component type");
      
      const fieldName = `${componentType}_id`;
      const overrideField = `${componentType}_override`;
      
      const { error } = await supabase
        .from("model_configurations")
        .update({ 
          [fieldName]: componentId,
          [overrideField]: true // Enable override when assigning
        })
        .eq("id", configurationId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Component Assigned",
        description: `${getComponentTypeLabel(componentType)} has been assigned successfully.`
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
        description: "Failed to assign component. Please try again."
      });
    }
  });

  const handleAssign = () => {
    if (selectedComponentId) {
      assignComponentMutation.mutate(selectedComponentId);
    }
  };

  const handleRemove = () => {
    assignComponentMutation.mutate(null);
  };

  const handleCreateNew = () => {
    // This would open the component creation dialog
    toast({
      title: "Create New Component",
      description: "Component creation dialog would open here."
    });
  };

  if (!componentType) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-explorer-card border-explorer-chrome/30">
        <DialogHeader>
          <DialogTitle className="text-explorer-text flex items-center gap-2">
            <Library className="h-5 w-5 text-accent-teal" />
            Select {getComponentTypeLabel(componentType)}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="library" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Component Library
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create New
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 overflow-y-auto max-h-[60vh]">
            <TabsContent value="library" className="mt-0">
              <ComponentLibraryIntegration
                componentType={componentType}
                onComponentSelect={setSelectedComponentId}
                onCreateNew={() => setActiveTab("create")}
                selectedComponentId={selectedComponentId || undefined}
              />
            </TabsContent>

            <TabsContent value="create" className="mt-0">
              <div className="text-center py-8">
                <Plus className="h-12 w-12 text-explorer-text-muted mx-auto mb-4" />
                <h3 className="text-lg font-medium text-explorer-text mb-2">
                  Create New {getComponentTypeLabel(componentType)}
                </h3>
                <p className="text-explorer-text-muted mb-4">
                  Component creation form would be integrated here
                </p>
                <Button onClick={handleCreateNew} className="bg-accent-teal text-black hover:bg-accent-teal/80">
                  Open Creation Form
                </Button>
              </div>
            </TabsContent>
          </div>
        </Tabs>

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
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedComponentSelectionDialog;
