
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wrench, Zap, Disc, Frame, Cog, Circle, Unlink } from "lucide-react";
import { Configuration } from "@/types/motorcycle";
import { useToast } from "@/hooks/use-toast";
import ComponentAssignmentModal from "@/components/admin/parts/ComponentAssignmentModal";
import { unlinkComponentFromConfiguration } from "@/services/componentLinkingService";

interface ComponentsSectionProps {
  selectedConfig?: Configuration;
  onRefresh: () => void;
}

const ComponentsSection = ({
  selectedConfig,
  onRefresh
}: ComponentsSectionProps) => {
  const [assignmentModal, setAssignmentModal] = useState<{
    isOpen: boolean;
    componentType: "engine" | "brakes" | "frame" | "suspension" | "wheels" | null;
  }>({
    isOpen: false,
    componentType: null
  });
  const [unlinkingComponent, setUnlinkingComponent] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAssignComponent = (componentType: "engine" | "brakes" | "frame" | "suspension" | "wheels") => {
    if (!selectedConfig) return;
    
    setAssignmentModal({
      isOpen: true,
      componentType
    });
  };

  const handleUnlinkComponent = async (componentType: "engine" | "brakes" | "frame" | "suspension" | "wheels") => {
    if (!selectedConfig) return;

    const componentTypeDbFields = {
      engine: "engine",
      brakes: "brake_system",
      frame: "frame", 
      suspension: "suspension",
      wheels: "wheel"
    };

    setUnlinkingComponent(componentType);

    try {
      const result = await unlinkComponentFromConfiguration(
        selectedConfig.id,
        componentTypeDbFields[componentType] as any
      );

      if (result.success) {
        toast({
          title: "Component Unlinked",
          description: `${componentType} has been successfully unlinked from ${selectedConfig.name || "Standard"}.`
        });
        
        onRefresh();
      } else {
        toast({
          variant: "destructive",
          title: "Unlink Failed",
          description: result.error || "Failed to unlink component."
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while unlinking the component."
      });
    } finally {
      setUnlinkingComponent(null);
    }
  };

  const handleAssignmentComplete = () => {
    onRefresh();
  };

  const handleCloseModal = () => {
    setAssignmentModal({
      isOpen: false,
      componentType: null
    });
  };

  if (!selectedConfig) {
    return (
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text">Components</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-explorer-text-muted">
            Select a trim level to view and manage components
          </div>
        </CardContent>
      </Card>
    );
  }

  const componentTypes = [
    {
      name: "Engine",
      icon: Zap,
      assigned: !!selectedConfig.engine_id,
      value: selectedConfig.engine_id,
      type: "engine" as const
    },
    {
      name: "Brake System",
      icon: Disc,
      assigned: !!selectedConfig.brake_system_id,
      value: selectedConfig.brake_system_id,
      type: "brakes" as const
    },
    {
      name: "Frame",
      icon: Frame,
      assigned: !!selectedConfig.frame_id,
      value: selectedConfig.frame_id,
      type: "frame" as const
    },
    {
      name: "Suspension",
      icon: Cog,
      assigned: !!selectedConfig.suspension_id,
      value: selectedConfig.suspension_id,
      type: "suspension" as const
    },
    {
      name: "Wheels",
      icon: Circle,
      assigned: !!selectedConfig.wheel_id,
      value: selectedConfig.wheel_id,
      type: "wheels" as const
    }
  ];

  return (
    <>
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Components
              <Badge variant="outline" className="text-xs">
                {selectedConfig.name || "Standard"}
              </Badge>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={onRefresh}
              className="bg-explorer-card border-explorer-chrome/30"
            >
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {componentTypes.map((component) => {
              const Icon = component.icon;
              const isUnlinking = unlinkingComponent === component.type;
              
              return (
                <Card
                  key={component.name}
                  className={`bg-explorer-dark border ${
                    component.assigned 
                      ? 'border-green-500/30 bg-green-500/5' 
                      : 'border-orange-500/30 bg-orange-500/5'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span className="font-medium text-sm">{component.name}</span>
                      </div>
                      <Badge 
                        variant={component.assigned ? "secondary" : "destructive"}
                        className="text-xs"
                      >
                        {component.assigned ? "Assigned" : "Missing"}
                      </Badge>
                    </div>
                    
                    {component.assigned ? (
                      <div className="space-y-2">
                        <div className="text-xs text-explorer-text-muted">
                          ID: {component.value}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAssignComponent(component.type)}
                            className="flex-1 bg-explorer-card border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
                          >
                            Change
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUnlinkComponent(component.type)}
                            disabled={isUnlinking}
                            className="flex-1 text-orange-400 border-orange-400/30 hover:bg-orange-400/20"
                          >
                            <Unlink className="h-3 w-3 mr-1" />
                            {isUnlinking ? "..." : "Unlink"}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleAssignComponent(component.type)}
                        className="w-full mt-2 bg-accent-teal text-black hover:bg-accent-teal/80"
                      >
                        Assign Component
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Component Assignment Modal */}
      {assignmentModal.isOpen && assignmentModal.componentType && selectedConfig && (
        <ComponentAssignmentModal
          isOpen={assignmentModal.isOpen}
          onClose={handleCloseModal}
          componentType={assignmentModal.componentType}
          configuration={selectedConfig}
          onAssignmentComplete={handleAssignmentComplete}
        />
      )}
    </>
  );
};

export default ComponentsSection;
