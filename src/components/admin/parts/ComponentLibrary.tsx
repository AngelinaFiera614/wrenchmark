import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Filter, Link, Unlink, Pin, ExternalLink } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { fetchEngines } from "@/services/engineService";
import { fetchBrakes } from "@/services/brakeService";
import { fetchFrames } from "@/services/frameService";
import { fetchSuspensions } from "@/services/suspensionService";
import { fetchWheels } from "@/services/wheelService";
import { linkComponentToConfiguration, unlinkComponentFromConfiguration, getComponentUsageInConfigurations } from "@/services/componentLinkingService";
import { Configuration } from "@/types/motorcycle";
import ComponentDetailDialog from "./ComponentDetailDialog";

interface ComponentLibraryProps {
  selectedConfiguration?: Configuration | null;
  onComponentLinked?: () => void;
}

const ComponentLibrary = ({ selectedConfiguration, onComponentLinked }: ComponentLibraryProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("engines");
  const [linkingComponent, setLinkingComponent] = useState<string | null>(null);
  const [viewingComponent, setViewingComponent] = useState<any>(null);
  const [viewingComponentType, setViewingComponentType] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all component types
  const { data: engines } = useQuery({
    queryKey: ["engines"],
    queryFn: fetchEngines
  });

  const { data: brakes } = useQuery({
    queryKey: ["brakes"], 
    queryFn: fetchBrakes
  });

  const { data: frames } = useQuery({
    queryKey: ["frames"],
    queryFn: fetchFrames
  });

  const { data: suspensions } = useQuery({
    queryKey: ["suspensions"],
    queryFn: fetchSuspensions
  });

  const { data: wheels } = useQuery({
    queryKey: ["wheels"],
    queryFn: fetchWheels
  });

  const componentTabs = [
    { id: 'engines', label: 'Engines', data: engines || [], icon: '🔧', dbField: 'engine' },
    { id: 'brakes', label: 'Brakes', data: brakes || [], icon: '🛑', dbField: 'brake_system' },
    { id: 'frames', label: 'Frames', data: frames || [], icon: '🏗️', dbField: 'frame' },
    { id: 'suspensions', label: 'Suspension', data: suspensions || [], icon: '🔩', dbField: 'suspension' },
    { id: 'wheels', label: 'Wheels', data: wheels || [], icon: '⚫', dbField: 'wheel' }
  ];

  const filterComponents = (components: any[]) => {
    if (!searchTerm) return components;
    
    return components.filter(component =>
      component.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.displacement_cc?.toString().includes(searchTerm) ||
      component.power_hp?.toString().includes(searchTerm)
    );
  };

  const isComponentLinked = (componentId: string, componentType: string) => {
    if (!selectedConfiguration) return false;
    const fieldName = `${componentType}_id`;
    return selectedConfiguration[fieldName] === componentId;
  };

  const handleLinkComponent = async (componentId: string, componentType: string) => {
    if (!selectedConfiguration) {
      toast({
        variant: "destructive",
        title: "No Configuration Selected",
        description: "Please select a configuration first to link components."
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
          title: "Component Linked",
          description: "Component has been successfully linked to the configuration."
        });
        
        // Refresh the configurations data
        queryClient.invalidateQueries({ queryKey: ["configurations", selectedConfiguration.model_year_id] });
        onComponentLinked?.();
      } else {
        toast({
          variant: "destructive",
          title: "Link Failed",
          description: result.error || "Failed to link component to configuration."
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while linking the component."
      });
    } finally {
      setLinkingComponent(null);
    }
  };

  const handleUnlinkComponent = async (componentType: string) => {
    if (!selectedConfiguration) return;

    try {
      const result = await unlinkComponentFromConfiguration(
        selectedConfiguration.id,
        componentType as any
      );

      if (result.success) {
        toast({
          title: "Component Unlinked",
          description: "Component has been successfully unlinked from the configuration."
        });
        
        // Refresh the configurations data
        queryClient.invalidateQueries({ queryKey: ["configurations", selectedConfiguration.model_year_id] });
        onComponentLinked?.();
      } else {
        toast({
          variant: "destructive",
          title: "Unlink Failed",
          description: result.error || "Failed to unlink component from configuration."
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while unlinking the component."
      });
    }
  };

  const handleViewComponent = (component: any, type: string) => {
    setViewingComponent(component);
    setViewingComponentType(type);
  };

  const renderComponentCard = (component: any, type: string) => {
    const isLinked = isComponentLinked(component.id, componentTabs.find(t => t.id === type)?.dbField || type);
    const isLinking = linkingComponent === component.id;
    
    return (
      <Card key={component.id} className={`bg-explorer-card border-explorer-chrome/30 hover:border-accent-teal/30 transition-colors ${isLinked ? 'ring-2 ring-accent-teal/50' : ''}`}>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-explorer-text">{component.name}</h3>
                  {isLinked && (
                    <Badge variant="outline" className="text-xs bg-accent-teal/20 text-accent-teal border-accent-teal/30">
                      <Pin className="h-3 w-3 mr-1" />
                      Linked
                    </Badge>
                  )}
                </div>
                <Badge variant="outline" className="text-xs">
                  {type.slice(0, -1).toUpperCase()}
                </Badge>
              </div>
            </div>

            {/* Component details based on type */}
            {type === 'engines' && (
              <div className="space-y-1 text-sm">
                <div className="text-explorer-text">
                  {component.displacement_cc}cc
                  {component.power_hp && ` • ${component.power_hp}hp`}
                  {component.torque_nm && ` • ${component.torque_nm}Nm`}
                </div>
                <div className="text-explorer-text-muted">
                  {component.engine_type} • {component.cylinder_count || '?'} cylinders • {component.cooling}
                </div>
              </div>
            )}

            {type === 'brakes' && (
              <div className="space-y-1 text-sm">
                <div className="text-explorer-text">{component.type}</div>
                <div className="text-explorer-text-muted">
                  {component.brake_type_front && `Front: ${component.brake_type_front}`}
                  {component.brake_type_rear && ` • Rear: ${component.brake_type_rear}`}
                </div>
              </div>
            )}

            {type === 'frames' && (
              <div className="space-y-1 text-sm">
                <div className="text-explorer-text">{component.type}</div>
                <div className="text-explorer-text-muted">
                  {component.material}
                  {component.rake_degrees && ` • ${component.rake_degrees}° rake`}
                </div>
              </div>
            )}

            {type === 'suspensions' && (
              <div className="space-y-1 text-sm">
                <div className="text-explorer-text">
                  {component.front_type} / {component.rear_type}
                </div>
                <div className="text-explorer-text-muted">
                  {component.brand}
                  {component.adjustability && ` • ${component.adjustability}`}
                </div>
              </div>
            )}

            {type === 'wheels' && (
              <div className="space-y-1 text-sm">
                <div className="text-explorer-text">
                  {component.front_size} / {component.rear_size}
                </div>
                <div className="text-explorer-text-muted">
                  {component.type} • {component.rim_material}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2 pt-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1"
                onClick={() => handleViewComponent(component, type)}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                View
              </Button>
              
              {selectedConfiguration && (
                <div className="flex gap-2 flex-1">
                  {isLinked ? (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleUnlinkComponent(componentTabs.find(t => t.id === type)?.dbField || type)}
                      className="flex-1 text-orange-400 border-orange-400/30 hover:bg-orange-400/20"
                    >
                      <Unlink className="h-3 w-3 mr-1" />
                      Unlink
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleLinkComponent(component.id, componentTabs.find(t => t.id === type)?.dbField || type)}
                      disabled={isLinking}
                      className="flex-1 text-accent-teal border-accent-teal/30 hover:bg-accent-teal/20"
                    >
                      <Link className="h-3 w-3 mr-1" />
                      {isLinking ? "Linking..." : "Link"}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Search and Actions */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-explorer-text">Component Library</CardTitle>
              {selectedConfiguration && (
                <p className="text-sm text-explorer-text-muted mt-1">
                  Linking to: <span className="text-accent-teal">{selectedConfiguration.name || "Standard"}</span>
                </p>
              )}
            </div>
            <Button className="bg-accent-teal text-black hover:bg-accent-teal/80">
              <Plus className="mr-2 h-4 w-4" />
              Add Component
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-explorer-text-muted h-4 w-4" />
              <Input
                placeholder="Search components..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
              />
            </div>
            <Button variant="outline" className="bg-explorer-card border-explorer-chrome/30 text-explorer-text">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Component Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          {componentTabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              <Badge variant="secondary" className="text-xs">
                {tab.data.length}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {componentTabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filterComponents(tab.data).map((component) =>
                renderComponentCard(component, tab.id)
              )}
            </div>

            {filterComponents(tab.data).length === 0 && (
              <Card className="bg-explorer-card border-explorer-chrome/30">
                <CardContent className="p-8 text-center">
                  <div className="text-explorer-text-muted">
                    {searchTerm
                      ? `No ${tab.label.toLowerCase()} match your search.`
                      : `No ${tab.label.toLowerCase()} available.`
                    }
                  </div>
                  <Button
                    variant="outline"
                    className="mt-4 bg-explorer-card border-explorer-chrome/30 text-explorer-text"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add {tab.label.slice(0, -1)}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Component Detail Dialog */}
      <ComponentDetailDialog
        component={viewingComponent}
        componentType={viewingComponentType}
        isOpen={!!viewingComponent}
        onClose={() => setViewingComponent(null)}
      />
    </div>
  );
};

export default ComponentLibrary;
