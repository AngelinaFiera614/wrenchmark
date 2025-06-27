
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { deleteEngine } from "@/services/engineService";
import { deleteBrake } from "@/services/brakeService";
import { deleteFrame } from "@/services/frameService";
import { deleteSuspension } from "@/services/suspensionService";
import { deleteWheel } from "@/services/wheelService";
import { getComponentName } from "../utils/componentNameUtils";

interface DeleteDialogState {
  open: boolean;
  componentId: string | null;
  componentType: string | null;
  componentName: string | null;
}

export const useComponentDelete = (
  engines: any[],
  brakes: any[],
  frames: any[],
  suspensions: any[],
  wheels: any[],
  refetchCallbacks: {
    refetchEngines: () => void;
    refetchBrakes: () => void;
    refetchFrames: () => void;
    refetchSuspensions: () => void;
    refetchWheels: () => void;
  }
) => {
  const { toast } = useToast();
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
    open: false,
    componentId: null,
    componentType: null,
    componentName: null
  });

  const handleDelete = (type: string, id: string) => {
    let componentName = 'Unknown';
    let componentData = null;
    
    switch (type) {
      case 'engine':
        componentData = engines.find(c => c.id === id);
        break;
      case 'brake':
        componentData = brakes.find(c => c.id === id);
        break;
      case 'frame':
        componentData = frames.find(c => c.id === id);
        break;
      case 'suspension':
        componentData = suspensions.find(c => c.id === id);
        break;
      case 'wheel':
        componentData = wheels.find(c => c.id === id);
        break;
    }
    
    if (componentData) {
      componentName = getComponentName(componentData, type);
    }
    
    setDeleteDialog({
      open: true,
      componentId: id,
      componentType: type,
      componentName
    });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.componentId || !deleteDialog.componentType) return;
    
    try {
      switch (deleteDialog.componentType) {
        case 'engine':
          await deleteEngine(deleteDialog.componentId);
          refetchCallbacks.refetchEngines();
          break;
        case 'brake':
          await deleteBrake(deleteDialog.componentId);
          refetchCallbacks.refetchBrakes();
          break;
        case 'frame':
          await deleteFrame(deleteDialog.componentId);
          refetchCallbacks.refetchFrames();
          break;
        case 'suspension':
          await deleteSuspension(deleteDialog.componentId);
          refetchCallbacks.refetchSuspensions();
          break;
        case 'wheel':
          await deleteWheel(deleteDialog.componentId);
          refetchCallbacks.refetchWheels();
          break;
      }
      
      toast({
        title: "Success",
        description: `${deleteDialog.componentType} deleted successfully.`
      });
    } catch (error) {
      console.error(`Error deleting ${deleteDialog.componentType}:`, error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete ${deleteDialog.componentType}.`
      });
    } finally {
      setDeleteDialog({
        open: false,
        componentId: null,
        componentType: null,
        componentName: null
      });
    }
  };

  const closeDeleteDialog = () => {
    setDeleteDialog(prev => ({ ...prev, open: false }));
  };

  return {
    deleteDialog,
    handleDelete,
    confirmDelete,
    closeDeleteDialog
  };
};
