
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Cog, 
  Disc, 
  Box, 
  Waves, 
  Circle,
  Link,
  Unlink,
  Settings,
  Info,
  Search,
  CheckCircle,
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchEngines } from "@/services/engineService";
import { fetchBrakes } from "@/services/brakeService";
import { fetchFrames } from "@/services/frameService";
import { fetchSuspensions } from "@/services/suspensionService";
import { fetchWheels } from "@/services/wheelService";
import { linkComponentToModel, linkComponentToConfiguration, getModelComponentAssignments } from "@/services/componentLinkingService";

interface SimpleComponentsManagerProps {
  selectedModel?: any;
  selectedConfiguration?: any;
  onComponentLinked: () => void;
  showManagementView?: boolean;
}

// Helper function to normalize component types from plural (UI) to singular (database)
const normalizeComponentType = (componentType: string): string => {
  const typeMap: Record<string, string> = {
    'engines': 'engine',
    'brakes': 'brake_system',
    'frames': 'frame',
    'suspension': 'suspension',
    'wheels': 'wheel'
  };
  
  return typeMap[componentType] || componentType;
};

const SimpleComponentsManager = ({
  selectedModel,
  selectedConfiguration,
  onComponentLinked,
  showManagementView = false
}: SimpleComponentsManagerProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("engines");
  const [linkingComponent, setLinkingComponent] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all component types
  const { data: engines = [] } = useQuery({
    queryKey: ["engines"],
    queryFn: fetchEngines
  });

  const { data: brakeSystems = [] } = useQuery({
    queryKey: ["brake-systems"],
    queryFn: fetchBrakes
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

  // Fetch model component assignments with proper invalidation
  const { data: modelAssignments = [], refetch: refetchAssignments } = useQuery({
    queryKey: ["model-assignments", selectedModel?.id],
    queryFn: () => selectedModel?.id ? getModelComponentAssignments(selectedModel.id) : [],
    enabled: !!selectedModel?.id
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
      console.log("Linking component to model:", {
        modelId: selectedModel.id,
        componentType: normalizeComponentType(componentType),
        componentId
      });

      const result = await linkComponentToModel(
        selectedModel.id,
        normalizeComponentType(componentType) as any,
        componentId
      );

      if (result.success) {
        toast({
          title: "Success",
          description: `Component linked to ${selectedModel.name} as default`
        });
        
        // Refresh model assignments and trigger parent refresh
        await refetchAssignments();
        onComponentLinked();
      } else {
        console.error("Link failed:", result.error);
        toast({
          variant: "destructive", 
          title: "Error",
          description: `Failed to link component: ${result.error}`
        });
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
      console.log("Linking component to configuration:", {
        configId: selectedConfiguration.id,
        componentType: normalizeComponentType(componentType),
        componentId
      });

      const result = await linkComponentToConfiguration(
        selectedConfiguration.id,
        normalizeComponentType(componentType) as any,
        componentId
      );

      if (result.success) {
        toast({
          title: "Success",
          description: `Component linked to ${selectedConfiguration.name || 'trim level'} as override`
        });
        onComponentLinked();
      } else {
        console.error("Link failed:", result.error);
        toast({
          variant: "destructive",
          title: "Error", 
          description: `Failed to link component: ${result.error}`
        });
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

  // Check if a component is assigned to the current model
  const isComponentAssignedToModel = (componentId: string, componentType: string) => {
    const normalizedType = normalizeComponentType(componentType);
    return modelAssignments.some(assignment => 
      assignment.component_type === normalizedType && 
      assignment.component_id === componentId
    );
  };

  // Check if a component is assigned to the current configuration
  const isComponentAssignedToConfig = (componentId: string, componentType: string) => {
    if (!selectedConfiguration) return false;
    const normalizedType = normalizeComponentType(componentType);
    const fieldName = `${normalizedType}_id`;
    return selectedConfiguration[fieldName] === componentId;
  };

  // Filter components based on search term
  const filterComponents = (components: any[]) => {
    if (!searchTerm.trim()) return components;
    
    const search = searchTerm.toLowerCase();
    return components.filter(component => 
      component.name?.toLowerCase().includes(search) ||
      component.brand?.toLowerCase().includes(search) ||
      component.type?.toLowerCase().includes(search) ||
      component.displacement_cc?.toString().includes(search) ||
      component.power_hp?.toString().includes(search) ||
      component.material?.toLowerCase().includes(search)
    );
  };

  const componentTabs = [
    { id: 'engines', label: 'Engines', data: engines, icon: Cog },
    { id: 'brakes', label: 'Brakes', data: brakeSystems, icon: Disc },
    { id: 'frames', label: 'Frames', data: frames, icon: Box },
    { id: 'suspension', label: 'Suspension', data: suspensions, icon: Waves },
    { id: 'wheels', label: 'Wheels', data: wheels, icon: Circle }
  ];

  const filteredComponentsForActiveTab = useMemo(() => {
    const activeTabData = componentTabs.find(tab => tab.id === activeTab);
    return activeTabData ? filterComponents(activeTabData.data) : [];
  }, [activeTab, searchTerm, engines, brakeSystems, frames, suspensions, wheels]);

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
        {searchTerm && (
          <Badge variant="secondary" className="text-xs">
            {filteredComponentsForActiveTab.length} filtered
          </Badge>
        )}
      </div>

      {components.length === 0 ? (
        <div className="text-center py-8 text-explorer-text-muted">
          {searchTerm ? `No ${componentType} match your search` : `No ${componentType} found`}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {components.map((component) => {
            const isAssignedToModel = isComponentAssignedToModel(component.id, componentType);
            const isAssignedToConfig = isComponentAssignedToConfig(component.id, componentType);
            const isLinking = linkingComponent === component.id;

            return (
              <Card key={component.id} className={`bg-explorer-dark border-explorer-chrome/30 hover:border-accent-teal/30 transition-colors ${
                isAssignedToModel || isAssignedToConfig ? 'ring-1 ring-accent-teal/30' : ''
              }`}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-explorer-text">{component.name}</h4>
                        <div className="flex gap-1">
                          {isAssignedToModel && (
                            <Badge variant="outline" className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/30">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Model
                            </Badge>
                          )}
                          {isAssignedToConfig && (
                            <Badge variant="outline" className="text-xs bg-accent-teal/20 text-accent-teal border-accent-teal/30">
                              <Settings className="h-3 w-3 mr-1" />
                              Trim
                            </Badge>
                          )}
                        </div>
                      </div>
                      {component.brand && (
                        <p className="text-sm text-explorer-text-muted">{component.brand}</p>
                      )}
                    </div>

                    <div className="text-xs text-explorer-text-muted space-y-1">
                      {componentType === 'engines' && (
                        <>
                          <div>Type: {component.type || component.engine_type || 'N/A'}</div>
                          <div>Displacement: {component.displacement_cc ? `${component.displacement_cc}cc` : 'N/A'}</div>
                          {component.power_hp && <div>Power: {component.power_hp}hp</div>}
                        </>
                      )}
                      {componentType === 'brakes' && (
                        <>
                          <div>Type: {component.type || 'N/A'}</div>
                          <div>Front: {component.brake_type_front || component.front_brake_type || 'N/A'}</div>
                          {component.brake_type_rear && <div>Rear: {component.brake_type_rear}</div>}
                        </>
                      )}
                      {componentType === 'frames' && (
                        <>
                          <div>Type: {component.type || 'N/A'}</div>
                          <div>Material: {component.material || 'N/A'}</div>
                          {component.rake_degrees && <div>Rake: {component.rake_degrees}°</div>}
                        </>
                      )}
                      {componentType === 'suspension' && (
                        <>
                          <div>Front: {component.front_type || 'N/A'}</div>
                          <div>Rear: {component.rear_type || 'N/A'}</div>
                          {component.brand && <div>Brand: {component.brand}</div>}
                        </>
                      )}
                      {componentType === 'wheels' && (
                        <>
                          <div>Front: {component.front_size || 'N/A'}</div>
                          <div>Rear: {component.rear_size || 'N/A'}</div>
                          {component.type && <div>Type: {component.type}</div>}
                        </>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleLinkToModel(componentType, component.id)}
                        disabled={!selectedModel || isLinking}
                        className={`flex-1 text-xs ${
                          isAssignedToModel 
                            ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' 
                            : 'hover:bg-blue-500/20 hover:border-blue-500/50'
                        }`}
                      >
                        {isLinking && linkingComponent === component.id ? (
                          <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                        ) : isAssignedToModel ? (
                          <CheckCircle className="mr-1 h-3 w-3" />
                        ) : (
                          <Link className="mr-1 h-3 w-3" />
                        )}
                        {isLinking && linkingComponent === component.id ? "Linking..." : 
                         isAssignedToModel ? "Model Default" : "Set as Model Default"}
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleLinkToTrim(componentType, component.id)}
                        disabled={!selectedConfiguration || isLinking}
                        className={`flex-1 text-xs ${
                          isAssignedToConfig 
                            ? 'bg-accent-teal/20 border-accent-teal/50 text-accent-teal' 
                            : 'hover:bg-accent-teal/20 hover:border-accent-teal/50'
                        }`}
                      >
                        {isLinking && linkingComponent === component.id ? (
                          <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                        ) : isAssignedToConfig ? (
                          <CheckCircle className="mr-1 h-3 w-3" />
                        ) : (
                          <Settings className="mr-1 h-3 w-3" />
                        )}
                        {isLinking && linkingComponent === component.id ? "Linking..." : 
                         isAssignedToConfig ? "Trim Override" : "Set Trim Override"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Context Information */}
      <Card className="bg-explorer-dark border-explorer-chrome/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-4 w-4 text-accent-teal" />
            <span className="text-sm font-medium text-explorer-text">Component Assignment Context</span>
          </div>
          <div className="text-sm text-explorer-text-muted space-y-1">
            {selectedModel && (
              <div>Model: <span className="text-explorer-text">{selectedModel.name}</span></div>
            )}
            {selectedConfiguration && (
              <div>Selected Trim: <span className="text-explorer-text">{selectedConfiguration.name || 'Standard'}</span></div>
            )}
            <div className="text-xs mt-2 space-y-1">
              <div>• <strong className="text-blue-400">Model Default:</strong> Component assigned to all trims of this model (inherited)</div>
              <div>• <strong className="text-accent-teal">Trim Override:</strong> Component assigned specifically to the selected trim (overrides model default)</div>
              {!selectedModel && (
                <div className="flex items-center gap-1 text-amber-400">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Select a model to enable component assignment</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <Card className="bg-explorer-dark border-explorer-chrome/30">
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-explorer-text-muted h-4 w-4" />
              <Input
                placeholder="Search components by name, brand, or specifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-explorer-card border-explorer-chrome/30 text-explorer-text"
              />
            </div>
            {searchTerm && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchTerm("")}
                className="bg-explorer-card border-explorer-chrome/30 text-explorer-text"
              >
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Component Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          {componentTabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              <Badge variant="secondary" className="text-xs">
                {tab.data.length}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {componentTabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="space-y-4">
            <ComponentGrid 
              components={tab.id === activeTab ? filteredComponentsForActiveTab : tab.data}
              componentType={tab.id} 
              icon={tab.icon}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default SimpleComponentsManager;
