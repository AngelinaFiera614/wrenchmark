
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Edit, Trash2, Link, Unlink, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { fetchEngines } from "@/services/engineService";
import { fetchBrakes } from "@/services/brakeService";
import { fetchFrames } from "@/services/frameService";
import { fetchSuspensions } from "@/services/suspensionService";
import { fetchWheels } from "@/services/wheelService";
import { linkComponentToConfiguration, linkComponentToModel } from "@/services/componentLinkingService";
import AddComponentDialog from "./AddComponentDialog";
import EditComponentDialog from "./EditComponentDialog";

interface SimpleComponentsManagerProps {
  selectedModel: any;
  selectedConfiguration: any;
  onComponentLinked: () => void;
}

const SimpleComponentsManager = ({ 
  selectedModel, 
  selectedConfiguration, 
  onComponentLinked 
}: SimpleComponentsManagerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("engines");
  const [linkingComponent, setLinkingComponent] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingComponent, setEditingComponent] = useState<any>(null);
  const [editingType, setEditingType] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch component data
  const { data: engines, refetch: refetchEngines } = useQuery({
    queryKey: ["engines"],
    queryFn: fetchEngines
  });

  const { data: brakes, refetch: refetchBrakes } = useQuery({
    queryKey: ["brakes"], 
    queryFn: fetchBrakes
  });

  const { data: frames, refetch: refetchFrames } = useQuery({
    queryKey: ["frames"],
    queryFn: fetchFrames
  });

  const { data: suspensions, refetch: refetchSuspensions } = useQuery({
    queryKey: ["suspensions"],
    queryFn: fetchSuspensions
  });

  const { data: wheels, refetch: refetchWheels } = useQuery({
    queryKey: ["wheels"],
    queryFn: fetchWheels
  });

  const componentTypes = [
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
      component.type?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleLinkToModel = async (componentId: string, componentType: string) => {
    if (!selectedModel) return;
    
    setLinkingComponent(componentId);
    try {
      const result = await linkComponentToModel(selectedModel.id, componentType as any, componentId);
      if (result.success) {
        toast({
          title: "Linked to Model",
          description: `Component linked to ${selectedModel.name}. This will apply to all configurations.`
        });
        onComponentLinked();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to link component to model."
      });
    } finally {
      setLinkingComponent(null);
    }
  };

  const handleLinkToConfiguration = async (componentId: string, componentType: string) => {
    if (!selectedConfiguration) return;
    
    setLinkingComponent(componentId);
    try {
      const result = await linkComponentToConfiguration(selectedConfiguration.id, componentType as any, componentId);
      if (result.success) {
        toast({
          title: "Linked to Configuration",
          description: `Component linked to ${selectedConfiguration.name || 'Standard'} configuration only.`
        });
        onComponentLinked();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to link component to configuration."
      });
    } finally {
      setLinkingComponent(null);
    }
  };

  const handleDeleteComponent = async (component: any, type: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${component.name || 'this component'}"?`
    );
    
    if (!confirmed) return;

    try {
      let deleteService;
      switch (type) {
        case 'engines':
          deleteService = (await import("@/services/engineService")).deleteEngine;
          break;
        case 'brakes':
          deleteService = (await import("@/services/brakeService")).deleteBrake;
          break;
        case 'frames':
          deleteService = (await import("@/services/frameService")).deleteFrame;
          break;
        case 'suspensions':
          deleteService = (await import("@/services/suspensionService")).deleteSuspension;
          break;
        case 'wheels':
          deleteService = (await import("@/services/wheelService")).deleteWheel;
          break;
        default:
          throw new Error("Unknown component type");
      }

      await deleteService(component.id);
      toast({
        title: "Component Deleted",
        description: `"${component.name || 'Component'}" has been deleted.`
      });
      
      // Refresh data
      switch (type) {
        case 'engines': refetchEngines(); break;
        case 'brakes': refetchBrakes(); break;
        case 'frames': refetchFrames(); break;
        case 'suspensions': refetchSuspensions(); break;
        case 'wheels': refetchWheels(); break;
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Delete Failed",
        description: "Failed to delete the component."
      });
    }
  };

  const handleComponentAdded = () => {
    refetchEngines();
    refetchBrakes();
    refetchFrames();
    refetchSuspensions();
    refetchWheels();
    toast({
      title: "Component Added",
      description: "New component has been added to the library."
    });
  };

  const handleComponentEdited = () => {
    refetchEngines();
    refetchBrakes();
    refetchFrames();
    refetchSuspensions();
    refetchWheels();
    setEditingComponent(null);
    setEditingType("");
    toast({
      title: "Component Updated",
      description: "Component has been updated successfully."
    });
  };

  const renderComponentCard = (component: any, type: string) => {
    return (
      <Card key={component.id} className="bg-explorer-card border-explorer-chrome/30">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-explorer-text">{component.name}</h3>
                <Badge variant="outline" className="text-xs mt-1">
                  {type.slice(0, -1).toUpperCase()}
                </Badge>
              </div>
            </div>

            {/* Component details */}
            <div className="text-sm text-explorer-text-muted">
              {type === 'engines' && `${component.displacement_cc}cc • ${component.power_hp || '?'}hp`}
              {type === 'brakes' && component.type}
              {type === 'frames' && `${component.type} • ${component.material}`}
              {type === 'suspensions' && `${component.front_type} / ${component.rear_type}`}
              {type === 'wheels' && `${component.front_size} / ${component.rear_size}`}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => {
                  setEditingComponent(component);
                  setEditingType(type);
                }}
                className="flex-1 text-xs"
              >
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>

              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handleDeleteComponent(component, type)}
                className="flex-1 text-xs text-red-400 border-red-400/30 hover:bg-red-400/20"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Delete
              </Button>
            </div>

            {/* Link actions */}
            {selectedModel && (
              <div className="pt-2 border-t border-explorer-chrome/30">
                <div className="text-xs text-explorer-text-muted mb-2">Link Component:</div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleLinkToModel(component.id, componentTypes.find(t => t.id === type)?.dbField || type)}
                    disabled={linkingComponent === component.id}
                    className="flex-1 text-xs text-accent-teal border-accent-teal/30 hover:bg-accent-teal/20"
                  >
                    <Link className="h-3 w-3 mr-1" />
                    To Model
                  </Button>
                  
                  {selectedConfiguration && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleLinkToConfiguration(component.id, componentTypes.find(t => t.id === type)?.dbField || type)}
                      disabled={linkingComponent === component.id}
                      className="flex-1 text-xs text-blue-400 border-blue-400/30 hover:bg-blue-400/20"
                    >
                      <Link className="h-3 w-3 mr-1" />
                      To Trim
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-explorer-text">Component Library</CardTitle>
              <p className="text-sm text-explorer-text-muted mt-1">
                Manage motorcycle components and link them to models or specific trim levels
              </p>
            </div>
            <Button 
              className="bg-accent-teal text-black hover:bg-accent-teal/80"
              onClick={() => setAddDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Component
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {!selectedModel && (
            <div className="flex items-center gap-2 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded mb-4">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-yellow-600">Select a model first to link components</span>
            </div>
          )}
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-explorer-text-muted h-4 w-4" />
            <Input
              placeholder="Search components..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          {componentTypes.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              <Badge variant="secondary" className="text-xs">
                {tab.data.length}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {componentTypes.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    onClick={() => setAddDialogOpen(true)}
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

      {/* Add Component Dialog */}
      <AddComponentDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onComponentAdded={handleComponentAdded}
        defaultComponentType={activeTab}
      />

      {/* Edit Component Dialog */}
      <EditComponentDialog
        open={!!editingComponent}
        onClose={() => {
          setEditingComponent(null);
          setEditingType("");
        }}
        component={editingComponent}
        componentType={editingType}
        onComponentEdited={handleComponentEdited}
      />
    </div>
  );
};

export default SimpleComponentsManager;
