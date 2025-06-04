
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Wrench, Disc, Box, Spring, Circle } from "lucide-react";
import AdminEngineDialog from "@/components/admin/components/AdminEngineDialog";
import AdminBrakeSystemDialog from "@/components/admin/components/AdminBrakeSystemDialog";
import AdminFrameDialog from "@/components/admin/components/AdminFrameDialog";
import AdminSuspensionDialog from "@/components/admin/components/AdminSuspensionDialog";
import AdminWheelDialog from "@/components/admin/components/AdminWheelDialog";

interface AddComponentDialogProps {
  open: boolean;
  onClose: () => void;
  onComponentAdded: () => void;
  defaultComponentType?: string;
}

const AddComponentDialog = ({
  open,
  onClose,
  onComponentAdded,
  defaultComponentType = "engines"
}: AddComponentDialogProps) => {
  const [activeTab, setActiveTab] = useState(defaultComponentType);
  const [componentDialogOpen, setComponentDialogOpen] = useState(false);
  const [selectedComponentType, setSelectedComponentType] = useState<string>("");

  const componentTypes = [
    { id: 'engines', label: 'Engine', icon: Wrench },
    { id: 'brakes', label: 'Brake System', icon: Disc },
    { id: 'frames', label: 'Frame', icon: Box },
    { id: 'suspensions', label: 'Suspension', icon: Spring },
    { id: 'wheels', label: 'Wheels', icon: Circle }
  ];

  const handleCreateComponent = (componentType: string) => {
    setSelectedComponentType(componentType);
    setComponentDialogOpen(true);
  };

  const handleComponentDialogClose = (refreshData?: boolean) => {
    setComponentDialogOpen(false);
    setSelectedComponentType("");
    if (refreshData) {
      onComponentAdded();
      onClose();
    }
  };

  const renderComponentDialog = () => {
    switch (selectedComponentType) {
      case 'engines':
        return (
          <AdminEngineDialog
            open={componentDialogOpen}
            engine={null}
            onClose={handleComponentDialogClose}
          />
        );
      case 'brakes':
        return (
          <AdminBrakeSystemDialog
            open={componentDialogOpen}
            brakeSystem={null}
            onClose={handleComponentDialogClose}
          />
        );
      case 'frames':
        return (
          <AdminFrameDialog
            open={componentDialogOpen}
            frame={null}
            onClose={handleComponentDialogClose}
          />
        );
      case 'suspensions':
        return (
          <AdminSuspensionDialog
            open={componentDialogOpen}
            suspension={null}
            onClose={handleComponentDialogClose}
          />
        );
      case 'wheels':
        return (
          <AdminWheelDialog
            open={componentDialogOpen}
            wheel={null}
            onClose={handleComponentDialogClose}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Component
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <p className="text-explorer-text-muted">
              Select the type of component you want to create:
            </p>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                {componentTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <TabsTrigger key={type.id} value={type.id} className="flex items-center gap-1">
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{type.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {componentTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <TabsContent key={type.id} value={type.id} className="space-y-4">
                    <div className="text-center py-8">
                      <Icon className="h-16 w-16 mx-auto text-accent-teal mb-4" />
                      <h3 className="text-lg font-medium text-explorer-text mb-2">
                        Create New {type.label}
                      </h3>
                      <p className="text-explorer-text-muted mb-6">
                        Add a new {type.label.toLowerCase()} component to the library
                      </p>
                      <Button
                        onClick={() => handleCreateComponent(type.id)}
                        className="bg-accent-teal text-black hover:bg-accent-teal/80"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create {type.label}
                      </Button>
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>

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

export default AddComponentDialog;
