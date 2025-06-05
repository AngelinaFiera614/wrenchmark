
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Engine, 
  Disc, 
  Box, 
  Waves, 
  Circle,
  Link,
  Unlink,
  Settings,
  Info
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { fetchEngines } from "@/services/engineService";
import { fetchBrakeSystems } from "@/services/brakeService";
import { fetchFrames } from "@/services/frameService";
import { fetchSuspensions } from "@/services/suspensionService";
import { fetchWheels } from "@/services/wheelService";
import { linkComponentToModel, linkComponentToConfiguration } from "@/services/componentLinkingService";

interface SimpleComponentsManagerProps {
  selectedModel?: any;
  selectedConfiguration?: any;
  onComponentLinked: () => void;
  showManagementView?: boolean;
}

const SimpleComponentsManager = ({
  selectedModel,
  selectedConfiguration,
  onComponentLinked,
  showManagementView = false
}: SimpleComponentsManagerProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("engines");
  const [linkingComponent, setLinkingComponent] = useState<string | null>(null);

  // Fetch all component types
  const { data: engines = [] } = useQuery({
    queryKey: ["engines"],
    queryFn: fetchEngines
  });

  const { data: brakeSystems = [] } = useQuery({
    queryKey: ["brake-systems"],
    queryFn: fetchBrakeSystems
  });

  const { data: frames = [] } = useQuery({
    queryKey: ["frames"],
    queryFn: fetchFrames
  });

  const { data: suspensions = [] } = useQuery({
    queryKey: ["suspensions"],
    queryFn: fetchSuspensions
  });

  const { data: wheels = [] } = useQuery({
    queryKey: ["wheels"],
    queryFn: fetchWheels
  });

  const handleLinkToModel = async (componentType: string, componentId: string) => {
    if (!selectedModel) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No model selected"
      });
      return;
    }

    setLinkingComponent(componentId);
    try {
      const result = await linkComponentToModel(
        selectedModel.id,
        componentType as any,
        componentId
      );

      if (result.success) {
        toast({
          title: "Success",
          description: `Component linked to ${selectedModel.name} as default`
        });
        onComponentLinked();
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("Error linking component to model:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to link component: ${error.message}`
      });
    } finally {
      setLinkingComponent(null);
    }
  };

  const handleLinkToTrim = async (componentType: string, componentId: string) => {
    if (!selectedConfiguration) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No trim level selected"
      });
      return;
    }

    setLinkingComponent(componentId);
    try {
      const result = await linkComponentToConfiguration(
        selectedConfiguration.id,
        componentType as any,
        componentId
      );

      if (result.success) {
        toast({
          title: "Success",
          description: `Component linked to ${selectedConfiguration.name || 'trim level'} as override`
        });
        onComponentLinked();
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("Error linking component to configuration:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to link component: ${error.message}`
      });
    } finally {
      setLinkingComponent(null);
    }
  };

  const ComponentGrid = ({ 
    components, 
    componentType, 
    icon: Icon 
  }: { 
    components: any[], 
    componentType: string, 
    icon: any 
  }) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="h-5 w-5 text-accent-teal" />
        <h3 className="text-lg font-medium text-explorer-text">
          {componentType.charAt(0).toUpperCase() + componentType.slice(1)}
        </h3>
        <Badge variant="outline">{components.length}</Badge>
      </div>

      {components.length === 0 ? (
        <div className="text-center py-8 text-explorer-text-muted">
          No {componentType} found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {components.map((component) => (
            <Card key={component.id} className="bg-explorer-dark border-explorer-chrome/30">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-explorer-text">{component.name}</h4>
                    {component.brand && (
                      <p className="text-sm text-explorer-text-muted">{component.brand}</p>
                    )}
                  </div>

                  <div className="text-xs text-explorer-text-muted space-y-1">
                    {componentType === 'engines' && (
                      <>
                        <div>Type: {component.type || 'N/A'}</div>
                        <div>Displacement: {component.displacement_cc ? `${component.displacement_cc}cc` : 'N/A'}</div>
                      </>
                    )}
                    {componentType === 'brake_systems' && (
                      <>
                        <div>Type: {component.type || 'N/A'}</div>
                        <div>Front: {component.front_brake_type || 'N/A'}</div>
                      </>
                    )}
                    {componentType === 'frames' && (
                      <>
                        <div>Type: {component.type || 'N/A'}</div>
                        <div>Material: {component.material || 'N/A'}</div>
                      </>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleLinkToModel(componentType, component.id)}
                      disabled={!selectedModel || linkingComponent === component.id}
                      className="flex-1 text-xs"
                    >
                      <Link className="mr-1 h-3 w-3" />
                      {linkingComponent === component.id ? "..." : "Model Default"}
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleLinkToTrim(componentType, component.id)}
                      disabled={!selectedConfiguration || linkingComponent === component.id}
                      className="flex-1 text-xs"
                    >
                      <Settings className="mr-1 h-3 w-3" />
                      {linkingComponent === component.id ? "..." : "Trim Override"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Context Information */}
      {(selectedModel || selectedConfiguration) && (
        <Card className="bg-explorer-dark border-explorer-chrome/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-4 w-4 text-accent-teal" />
              <span className="text-sm font-medium text-explorer-text">Assignment Context</span>
            </div>
            <div className="text-sm text-explorer-text-muted space-y-1">
              {selectedModel && (
                <div>Model: <span className="text-explorer-text">{selectedModel.name}</span></div>
              )}
              {selectedConfiguration && (
                <div>Trim Level: <span className="text-explorer-text">{selectedConfiguration.name || 'Standard'}</span></div>
              )}
              <div className="text-xs mt-2 text-explorer-text-muted">
                • <strong>Model Default:</strong> Assigns component as default for all trims of this model
                <br />
                • <strong>Trim Override:</strong> Assigns component specifically to this trim level (overrides model default)
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Component Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="engines">Engines</TabsTrigger>
          <TabsTrigger value="brakes">Brakes</TabsTrigger>
          <TabsTrigger value="frames">Frames</TabsTrigger>
          <TabsTrigger value="suspension">Suspension</TabsTrigger>
          <TabsTrigger value="wheels">Wheels</TabsTrigger>
        </TabsList>

        <TabsContent value="engines">
          <ComponentGrid 
            components={engines} 
            componentType="engine" 
            icon={Engine}
          />
        </TabsContent>

        <TabsContent value="brakes">
          <ComponentGrid 
            components={brakeSystems} 
            componentType="brake_system" 
            icon={Disc}
          />
        </TabsContent>

        <TabsContent value="frames">
          <ComponentGrid 
            components={frames} 
            componentType="frame" 
            icon={Box}
          />
        </TabsContent>

        <TabsContent value="suspension">
          <ComponentGrid 
            components={suspensions} 
            componentType="suspension" 
            icon={Waves}
          />
        </TabsContent>

        <TabsContent value="wheels">
          <ComponentGrid 
            components={wheels} 
            componentType="wheel" 
            icon={Circle}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SimpleComponentsManager;
