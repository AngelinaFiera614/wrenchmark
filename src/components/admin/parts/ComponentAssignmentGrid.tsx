
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Unlink, ExternalLink, Plus, AlertCircle, CheckCircle } from "lucide-react";
import { Configuration } from "@/types/motorcycle";
import { unlinkComponentFromConfiguration } from "@/services/componentLinkingService";
import { useToast } from "@/hooks/use-toast";

interface ComponentAssignmentGridProps {
  configuration: Configuration;
  onComponentChange: (componentType: string, componentId: string | null) => void;
}

const ComponentAssignmentGrid = ({ configuration, onComponentChange }: ComponentAssignmentGridProps) => {
  const [unlinkingComponent, setUnlinkingComponent] = useState<string | null>(null);
  const { toast } = useToast();

  const componentTypes = [
    {
      type: 'engine',
      label: 'Engine',
      icon: '🔧',
      component: configuration.engine,
      componentId: configuration.engine_id,
      required: true
    },
    {
      type: 'brake_system',
      label: 'Brake System',
      icon: '🛑',
      component: configuration.brakes,
      componentId: configuration.brake_system_id,
      required: true
    },
    {
      type: 'frame',
      label: 'Frame',
      icon: '🏗️',
      component: configuration.frame,
      componentId: configuration.frame_id,
      required: true
    },
    {
      type: 'suspension',
      label: 'Suspension',
      icon: '🔩',
      component: configuration.suspension,
      componentId: configuration.suspension_id,
      required: false
    },
    {
      type: 'wheel',
      label: 'Wheels',
      icon: '⚫',
      component: configuration.wheels,
      componentId: configuration.wheel_id,
      required: false
    }
  ];

  const handleUnlinkComponent = async (componentType: string) => {
    setUnlinkingComponent(componentType);
    
    try {
      const result = await unlinkComponentFromConfiguration(
        configuration.id,
        componentType as any
      );

      if (result.success) {
        toast({
          title: "Component Unlinked",
          description: "Component has been successfully unlinked from the configuration."
        });
        onComponentChange(componentType, null);
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
    } finally {
      setUnlinkingComponent(null);
    }
  };

  const getComponentDisplayName = (componentType: any, component: any) => {
    if (!component) return null;
    
    switch (componentType.type) {
      case 'engine':
        return `${component.name} - ${component.displacement_cc}cc`;
      case 'brake_system':
        return `${component.type} - ${component.brake_brand || 'Standard'}`;
      case 'frame':
        return `${component.type} - ${component.material || 'Standard'}`;
      case 'suspension':
        return `${component.front_type || 'Front'} / ${component.rear_type || 'Rear'}`;
      case 'wheel':
        return `${component.front_size || ''} / ${component.rear_size || ''} ${component.type || 'Wheels'}`.trim();
      default:
        return component.name || 'Unknown Component';
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text flex items-center gap-2">
            Component Assignment
            <Badge variant="outline" className="text-xs">
              {componentTypes.filter(ct => ct.componentId).length}/{componentTypes.length} assigned
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {componentTypes.map((componentType) => (
              <Card 
                key={componentType.type} 
                className={`border transition-colors ${
                  componentType.componentId 
                    ? 'border-accent-teal/30 bg-accent-teal/5' 
                    : componentType.required 
                      ? 'border-orange-400/30 bg-orange-400/5' 
                      : 'border-explorer-chrome/30'
                }`}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{componentType.icon}</span>
                        <h3 className="font-medium text-explorer-text">{componentType.label}</h3>
                      </div>
                      <div className="flex items-center gap-1">
                        {componentType.required && (
                          <Badge variant="outline" className="text-xs text-orange-400 border-orange-400/30">
                            Required
                          </Badge>
                        )}
                        {componentType.componentId ? (
                          <CheckCircle className="h-4 w-4 text-accent-teal" />
                        ) : componentType.required ? (
                          <AlertCircle className="h-4 w-4 text-orange-400" />
                        ) : null}
                      </div>
                    </div>

                    {componentType.componentId ? (
                      <div className="space-y-2">
                        <div className="p-2 bg-explorer-chrome/10 rounded border">
                          <p className="text-sm text-explorer-text font-medium">
                            {getComponentDisplayName(componentType, componentType.component)}
                          </p>
                          {componentType.component && (
                            <p className="text-xs text-explorer-text-muted mt-1">
                              ID: {componentType.componentId}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline"
                                disabled={unlinkingComponent === componentType.type}
                                className="flex-1 text-orange-400 border-orange-400/30 hover:bg-orange-400/20"
                              >
                                <Unlink className="h-3 w-3 mr-1" />
                                {unlinkingComponent === componentType.type ? "Unlinking..." : "Unlink"}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-explorer-card border-explorer-chrome/30">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-explorer-text">Unlink Component</AlertDialogTitle>
                                <AlertDialogDescription className="text-explorer-text-muted">
                                  Are you sure you want to unlink this {componentType.label.toLowerCase()} from the configuration? 
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="bg-explorer-chrome/20 border-explorer-chrome/30 text-explorer-text">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleUnlinkComponent(componentType.type)}
                                  className="bg-orange-500 hover:bg-orange-600 text-white"
                                >
                                  Unlink Component
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="p-3 border-2 border-dashed border-explorer-chrome/30 rounded text-center">
                          <p className="text-sm text-explorer-text-muted">
                            No {componentType.label.toLowerCase()} assigned
                          </p>
                          {componentType.required && (
                            <p className="text-xs text-orange-400 mt-1">
                              This component is required
                            </p>
                          )}
                        </div>
                        
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full text-accent-teal border-accent-teal/30 hover:bg-accent-teal/20"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Link {componentType.label}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComponentAssignmentGrid;
