
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Wrench, Disc, Box, Zap, Circle } from "lucide-react";
import AdminEngineDialog from "@/components/admin/components/AdminEngineDialog";
import AdminBrakeSystemDialog from "@/components/admin/components/AdminBrakeSystemDialog";
import AdminFrameDialog from "@/components/admin/components/AdminFrameDialog";
import AdminSuspensionDialog from "@/components/admin/components/AdminSuspensionDialog";
import AdminWheelDialog from "@/components/admin/components/AdminWheelDialog";

interface EditComponentDialogProps {
  open: boolean;
  onClose: () => void;
  component: any;
  componentType: string;
  onComponentEdited: () => void;
}

const EditComponentDialog = ({
  open,
  onClose,
  component,
  componentType,
  onComponentEdited
}: EditComponentDialogProps) => {
  const [componentDialogOpen, setComponentDialogOpen] = useState(false);

  const componentTypes = [
    { id: 'engines', label: 'Engine', icon: Wrench },
    { id: 'brakes', label: 'Brake System', icon: Disc },
    { id: 'frames', label: 'Frame', icon: Box },
    { id: 'suspensions', label: 'Suspension', icon: Zap },
    { id: 'wheels', label: 'Wheels', icon: Circle }
  ];

  const handleEditComponent = () => {
    setComponentDialogOpen(true);
  };

  const handleComponentDialogClose = (refreshData?: boolean) => {
    setComponentDialogOpen(false);
    if (refreshData) {
      onComponentEdited();
      onClose();
    }
  };

  const renderComponentDialog = () => {
    if (!component || !componentType) return null;

    switch (componentType) {
      case 'engines':
        return (
          <AdminEngineDialog
            open={componentDialogOpen}
            engine={component}
            onClose={handleComponentDialogClose}
          />
        );
      case 'brakes':
        return (
          <AdminBrakeSystemDialog
            open={componentDialogOpen}
            brakeSystem={component}
            onClose={handleComponentDialogClose}
          />
        );
      case 'frames':
        return (
          <AdminFrameDialog
            open={componentDialogOpen}
            frame={component}
            onClose={handleComponentDialogClose}
          />
        );
      case 'suspensions':
        return (
          <AdminSuspensionDialog
            open={componentDialogOpen}
            suspension={component}
            onClose={handleComponentDialogClose}
          />
        );
      case 'wheels':
        return (
          <AdminWheelDialog
            open={componentDialogOpen}
            wheel={component}
            onClose={handleComponentDialogClose}
          />
        );
      default:
        return null;
    }
  };

  const getCurrentComponentType = () => {
    return componentTypes.find(type => type.id === componentType);
  };

  const currentType = getCurrentComponentType();

  if (!open || !component || !currentType) {
    return null;
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit {currentType.label}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="text-center py-4">
              <currentType.icon className="h-16 w-16 mx-auto text-accent-teal mb-4" />
              <h3 className="text-lg font-medium text-explorer-text mb-2">
                {component.name || `${currentType.label} Component`}
              </h3>
              <p className="text-explorer-text-muted mb-6">
                Edit this {currentType.label.toLowerCase()} component
              </p>
              <Button
                onClick={handleEditComponent}
                className="bg-accent-teal text-black hover:bg-accent-teal/80"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit {currentType.label}
              </Button>
            </div>

            <div className="flex justify-end pt-4 border-t border-explorer-chrome/30">
              <Button
                variant="outline"
                onClick={onClose}
                className="border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Component-specific dialogs */}
      {renderComponentDialog()}
    </>
  );
};

export default EditComponentDialog;
