
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wrench, Zap, Disc, Frame, Cog, Circle, Unlink, Inheritance, Settings, Eye } from "lucide-react";
import { Configuration } from "@/types/motorcycle";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import ComponentAssignmentModal from "@/components/admin/parts/ComponentAssignmentModal";
import { unlinkComponentFromConfiguration } from "@/services/componentLinkingService";
import { getEffectiveComponents, setTrimComponentOverride, EffectiveComponents } from "@/services/modelComponentService";
import ModelComponentAssignmentDialog from "./ModelComponentAssignmentDialog";

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
  const [modelAssignmentDialog, setModelAssignmentDialog] = useState(false);
  const [unlinkingComponent, setUnlinkingComponent] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch effective components with inheritance info
  const { data: effectiveComponents, refetch: refetchEffective } = useQuery({
    queryKey: ['effective-components', selectedConfig?.id],
    queryFn: () => selectedConfig ? getEffectiveComponents(selectedConfig.id) : null,
    enabled: !!selectedConfig
  });

  const handleAssignComponent = (componentType: "engine" | "brakes" | "frame" | "suspension" | "wheels") => {
    if (!selectedConfig) return;
    
    setAssignmentModal({
      isOpen: true,
      componentType
    });
  };

  const handleOverrideComponent = async (
    componentType: "engine" | "brakes" | "frame" | "suspension" | "wheels",
    componentId: string | null
  ) => {
    if (!selectedConfig) return;

    const componentTypeDbFields = {
      engine: "engine",
      brakes: "brake_system",
      frame: "frame", 
      suspension: "suspension",
      wheels: "wheel"
    };

    try {
      await setTrimComponentOverride(
        selectedConfig.id,
        componentTypeDbFields[componentType] as any,
        componentId
      );

      await Promise.all([refetchEffective(), onRefresh()]);
      
      toast({
        title: componentId ? "Override Set" : "Override Removed",
        description: `${componentType} ${componentId ? 'override has been set' : 'now inherits from model'} for ${selectedConfig.name || "Standard"}.`
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Override Failed",
        description: error.message || "Failed to set component override."
      });
    }
  };

  const handleUnlinkComponent = async (componentType: "engine" | "brakes" | "frame" | "suspension" | "wheels") => {
    if (!selectedConfig) return;

    setUnlinkingComponent(componentType);

    try {
      // Remove the override by setting it to null
      await handleOverrideComponent(componentType, null);
    } finally {
      setUnlinkingComponent(null);
    }
  };

  const handleAssignmentComplete = () => {
    refetchEffective();
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
      type: "engine" as const,
      effectiveId: effectiveComponents?.engine_id,
      inherited: effectiveComponents?.engine_inherited
    },
    {
      name: "Brake System",
      icon: Disc,
      type: "brakes" as const,
      effectiveId: effectiveComponents?.brake_system_id,
      inherited: effectiveComponents?.brake_system_inherited
    },
    {
      name: "Frame",
      icon: Frame,
      type: "frame" as const,
      effectiveId: effectiveComponents?.frame_id,
      inherited: effectiveComponents?.frame_inherited
    },
    {
      name: "Suspension",
      icon: Cog,
      type: "suspension" as const,
      effectiveId: effectiveComponents?.suspension_id,
      inherited: effectiveComponents?.suspension_inherited
    },
    {
      name: "Wheels",
      icon: Circle,
      type: "wheels" as const,
      effectiveId: effectiveComponents?.wheel_id,
      inherited: effectiveComponents?.wheel_inherited
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
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setModelAssignmentDialog(true)}
                className="bg-explorer-card border-explorer-chrome/30"
              >
                <Settings className="h-4 w-4 mr-2" />
                Model Assignments
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => Promise.all([refetchEffective(), onRefresh()])}
                className="bg-explorer-card border-explorer-chrome/30"
              >
                Refresh
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Inheritance className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <div className="font-medium text-blue-800 dark:text-blue-200">Component Inheritance</div>
                <div className="text-blue-700 dark:text-blue-300">
                  Components marked as "Inherited" come from model-level assignments. You can override them for this specific trim level.
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {componentTypes.map((component) => {
              const Icon = component.icon;
              const isUnlinking = unlinkingComponent === component.type;
              const hasComponent = !!component.effectiveId;
              const isInherited = component.inherited;
              
              return (
                <Card
                  key={component.name}
                  className={`bg-explorer-dark border ${
                    hasComponent 
                      ? isInherited 
                        ? 'border-blue-500/30 bg-blue-500/5' 
                        : 'border-green-500/30 bg-green-500/5'
                      : 'border-orange-500/30 bg-orange-500/5'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span className="font-medium text-sm">{component.name}</span>
                      </div>
                      <div className="flex gap-1">
                        {hasComponent && (
                          <Badge 
                            variant={isInherited ? "outline" : "secondary"}
                            className="text-xs"
                          >
                            {isInherited ? "Inherited" : "Override"}
                          </Badge>
                        )}
                        {!hasComponent && (
                          <Badge variant="destructive" className="text-xs">
                            Missing
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {hasComponent ? (
                      <div className="space-y-2">
                        <div className="text-xs text-explorer-text-muted">
                          ID: {component.effectiveId}
                          {isInherited && (
                            <div className="flex items-center gap-1 mt-1">
                              <Inheritance className="h-3 w-3 text-blue-500" />
                              <span className="text-blue-500">From model assignment</span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAssignComponent(component.type)}
                            className="flex-1 bg-explorer-card border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
                          >
                            {isInherited ? "Override" : "Change"}
                          </Button>
                          {!isInherited && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUnlinkComponent(component.type)}
                              disabled={isUnlinking}
                              className="flex-1 text-blue-400 border-blue-400/30 hover:bg-blue-400/20"
                            >
                              <Inheritance className="h-3 w-3 mr-1" />
                              {isUnlinking ? "..." : "Inherit"}
                            </Button>
                          )}
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

      {/* Model Component Assignment Dialog */}
      {modelAssignmentDialog && selectedConfig && (
        <ModelComponentAssignmentDialog
          open={modelAssignmentDialog}
          onClose={() => setModelAssignmentDialog(false)}
          modelId={selectedConfig.model_year?.motorcycle_id || ''}
          modelName={selectedConfig.model_year?.motorcycle_model?.name || 'Unknown Model'}
          onSuccess={() => {
            refetchEffective();
            onRefresh();
          }}
        />
      )}
    </>
  );
};

export default ComponentsSection;
