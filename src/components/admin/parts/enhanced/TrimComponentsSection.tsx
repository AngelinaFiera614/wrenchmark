
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, CheckCircle, AlertCircle } from "lucide-react";

interface TrimComponentsSectionProps {
  formData: any;
  selectedComponents: any;
  onComponentSelect: (componentType: string, componentId: string, component: any) => void;
}

const TrimComponentsSection = ({ formData, selectedComponents, onComponentSelect }: TrimComponentsSectionProps) => {
  const componentTypes = [
    { id: 'engine', label: 'Engine', fieldId: 'engine_id' },
    { id: 'brake_system', label: 'Brake System', fieldId: 'brake_system_id' },
    { id: 'frame', label: 'Frame', fieldId: 'frame_id' },
    { id: 'suspension', label: 'Suspension', fieldId: 'suspension_id' },
    { id: 'wheel', label: 'Wheels', fieldId: 'wheel_id' },
  ];

  const getComponentStatus = (componentType: string) => {
    const fieldId = componentTypes.find(c => c.id === componentType)?.fieldId;
    return formData[fieldId] ? 'assigned' : 'missing';
  };

  const getStatusIcon = (status: string) => {
    return status === 'assigned' 
      ? <CheckCircle className="h-4 w-4 text-green-500" />
      : <AlertCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusBadge = (status: string) => {
    return status === 'assigned'
      ? <Badge className="bg-green-100 text-green-800">Assigned</Badge>
      : <Badge className="bg-red-100 text-red-800">Missing</Badge>;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {componentTypes.map((componentType) => {
          const status = getComponentStatus(componentType.id);
          const component = selectedComponents[componentType.id];
          
          return (
            <Card key={componentType.id} className="bg-explorer-dark border-explorer-chrome/30">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm text-explorer-text">{componentType.label}</CardTitle>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(status)}
                    {getStatusBadge(status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {component ? (
                  <div className="space-y-2">
                    <div className="text-sm text-explorer-text font-medium">
                      {component.name || component.model || 'Unnamed Component'}
                    </div>
                    <div className="text-xs text-explorer-text-muted">
                      {component.description || component.specifications || 'No description available'}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Open component selector dialog
                        console.log(`Select ${componentType.label} component`);
                      }}
                      className="w-full mt-2 border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
                    >
                      <Settings className="h-3 w-3 mr-2" />
                      Change Component
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-sm text-explorer-text-muted">
                      No {componentType.label.toLowerCase()} assigned
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Open component selector dialog
                        console.log(`Select ${componentType.label} component`);
                      }}
                      className="w-full border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
                    >
                      <Settings className="h-3 w-3 mr-2" />
                      Select Component
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TrimComponentsSection;
