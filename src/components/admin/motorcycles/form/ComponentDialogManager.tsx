
import React from "react";
import { EngineForm } from "./components/EngineForm";
import { BrakeForm } from "./components/BrakeForm";
import { useToast } from "@/hooks/use-toast";
import { 
  createEngine, 
  createBrakeSystem, 
  createFrame, 
  createSuspension, 
  createWheels 
} from "@/services/componentService";
import { useQueryClient } from "@tanstack/react-query";

interface ComponentDialogManagerProps {
  activeDialog: string | null;
  onClose: () => void;
  onComponentCreated?: (type: string, id: string) => void;
}

export function ComponentDialogManager({ 
  activeDialog, 
  onClose,
  onComponentCreated 
}: ComponentDialogManagerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const handleEngineSubmit = async (data: any) => {
    try {
      const result = await createEngine(data);
      if (result) {
        toast({
          title: "Engine created",
          description: `Engine "${data.name}" has been created successfully.`,
        });
        
        // Invalidate engines query to refresh data
        queryClient.invalidateQueries({ queryKey: ["engines"] });
        
        // Notify parent component
        if (onComponentCreated) {
          onComponentCreated("engine", result.id);
        }
        
        onClose();
      }
    } catch (error) {
      console.error("Error creating engine:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create engine. Please try again.",
      });
    }
  };

  const handleBrakeSubmit = async (data: any) => {
    try {
      const result = await createBrakeSystem(data);
      if (result) {
        toast({
          title: "Brake system created",
          description: `Brake system "${data.type}" has been created successfully.`,
        });
        
        queryClient.invalidateQueries({ queryKey: ["brake-systems"] });
        
        if (onComponentCreated) {
          onComponentCreated("brake", result.id);
        }
        
        onClose();
      }
    } catch (error) {
      console.error("Error creating brake system:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create brake system. Please try again.",
      });
    }
  };
  
  // Based on the activeDialog prop, return the appropriate component form
  const renderDialog = () => {
    switch (activeDialog) {
      case "engine":
        return (
          <EngineForm 
            open={true}
            onClose={onClose}
            onSubmit={handleEngineSubmit}
          />
        );
      case "brake":
        return (
          <BrakeForm 
            open={true}
            onClose={onClose}
            onSubmit={handleBrakeSubmit}
          />
        );
      default:
        return null;
    }
  };
  
  return <>{renderDialog()}</>;
}
