
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Check } from "lucide-react";
import ComponentSelector from "@/components/admin/models/ComponentSelector";
import { Configuration } from "@/types/motorcycle";
import { useToast } from "@/hooks/use-toast";
import { linkComponentToConfiguration } from "@/services/componentLinkingService";

interface ComponentAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  componentType: "engine" | "brakes" | "frame" | "suspension" | "wheels";
  configuration: Configuration;
  onAssignmentComplete: () => void;
}

const componentTypeDisplayNames = {
  engine: "Engine",
  brakes: "Brake System", 
  frame: "Frame",
  suspension: "Suspension",
  wheels: "Wheels"
};

const componentTypeDbFields = {
  engine: "engine",
  brakes: "brake_system",
  frame: "frame", 
  suspension: "suspension",
  wheels: "wheel"
};

const ComponentAssignmentModal = ({
  isOpen,
  onClose,
  componentType,
  configuration,
  onAssignmentComplete
}: ComponentAssignmentModalProps) => {
  const [selectedComponentId, setSelectedComponentId] = useState<string>("");
  const [selectedComponent, setSelectedComponent] = useState<any>(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const { toast } = useToast();

  const handleComponentSelect = (componentId: string, component: any) => {
    setSelectedComponentId(componentId);
    setSelectedComponent(component);
  };

  const handleAssign = async () => {
    if (!selectedComponentId) {
      toast({
        variant: "destructive",
        title: "No Component Selected",
        description: "Please select a component to assign."
      });
      return;
    }

    setIsAssigning(true);

    try {
      const result = await linkComponentToConfiguration(
        configuration.id,
        componentTypeDbFields[componentType] as any,
        selectedComponentId
      );

      if (result.success) {
        toast({
          title: "Component Assigned",
          description: `${componentTypeDisplayNames[componentType]} has been successfully assigned to ${configuration.name || "Standard"}.`
        });
        
        onAssignmentComplete();
        onClose();
      } else {
        toast({
          variant: "destructive",
          title: "Assignment Failed",
          description: result.error || "Failed to assign component."
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while assigning the component."
      });
    } finally {
      setIsAssigning(false);
    }
  };

  const handleClose = () => {
    setSelectedComponentId("");
    setSelectedComponent(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col bg-explorer-card border-explorer-chrome/30">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-explorer-text flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span>Assign {componentTypeDisplayNames[componentType]}</span>
              <Badge variant="outline" className="text-xs">
                {configuration.name || "Standard"}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-explorer-text-muted hover:text-explorer-text"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <ComponentSelector
            componentType={componentType}
            selectedId={selectedComponentId}
            onSelect={handleComponentSelect}
          />
        </div>

        <div className="flex-shrink-0 flex items-center justify-between pt-4 border-t border-explorer-chrome/30">
          <div className="flex items-center gap-2">
            {selectedComponent && (
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-accent-teal" />
                <span className="text-sm text-explorer-text">
                  Selected: {selectedComponent.name || `Component ${selectedComponentId}`}
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleClose}
              className="bg-explorer-card border-explorer-chrome/30 text-explorer-text"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAssign}
              disabled={!selectedComponentId || isAssigning}
              className="bg-accent-teal text-black hover:bg-accent-teal/80"
            >
              {isAssigning ? "Assigning..." : "Assign Component"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComponentAssignmentModal;
