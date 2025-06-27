
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { fetchEngineById } from "@/services/engineService";
import { fetchBrakeById } from "@/services/brakeService";
import { fetchFrameById } from "@/services/frameService";
import { fetchSuspensionById } from "@/services/suspensionService";
import { fetchWheelById } from "@/services/wheelService";

export const useComponentEdit = (
  refetchCallbacks: {
    refetchEngines: () => void;
    refetchBrakes: () => void;
    refetchFrames: () => void;
    refetchSuspensions: () => void;
    refetchWheels: () => void;
  }
) => {
  const { toast } = useToast();
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  const [editingComponent, setEditingComponent] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleAdd = (type: string) => {
    setIsEditing(false);
    setEditingComponent(null);
    setActiveDialog(type);
  };

  const handleEdit = async (type: string, id: string) => {
    try {
      setIsEditing(true);
      let componentData = null;
      
      switch (type) {
        case 'engine':
          componentData = await fetchEngineById(id);
          break;
        case 'brake':
          componentData = await fetchBrakeById(id);
          break;
        case 'frame':
          componentData = await fetchFrameById(id);
          break;
        case 'suspension':
          componentData = await fetchSuspensionById(id);
          break;
        case 'wheel':
          componentData = await fetchWheelById(id);
          break;
        default:
          throw new Error(`Unknown component type: ${type}`);
      }
      
      setEditingComponent(componentData);
      setActiveDialog(type);
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to load ${type} data for editing.`
      });
    }
  };

  const handleDialogClose = () => {
    setActiveDialog(null);
    setEditingComponent(null);
    setIsEditing(false);
    // Refresh all component data when dialog closes
    refetchCallbacks.refetchEngines();
    refetchCallbacks.refetchBrakes();
    refetchCallbacks.refetchFrames();
    refetchCallbacks.refetchSuspensions();
    refetchCallbacks.refetchWheels();
  };

  return {
    activeDialog,
    editingComponent,
    isEditing,
    handleAdd,
    handleEdit,
    handleDialogClose
  };
};
