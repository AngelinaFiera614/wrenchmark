
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wrench, Settings, ExternalLink } from "lucide-react";
import ComponentSelectionDialog from "./ComponentSelectionDialog";

interface ComponentManagementPanelProps {
  selectedConfigData?: any;
  onRefresh: () => void;
}

const ComponentManagementPanel: React.FC<ComponentManagementPanelProps> = ({
  selectedConfigData,
  onRefresh
}) => {
  const [showComponentDialog, setShowComponentDialog] = useState(false);
  const [selectedComponentType, setSelectedComponentType] = useState<string | null>(null);

  const components = [
    { 
      type: 'engine', 
      label: 'Engine', 
      data: selectedConfigData?.engines,
      field: 'engine_id',
      display: selectedConfigData?.engines ? 
        `${selectedConfigData.engines.name} (${selectedConfigData.engines.displacement_cc}cc)` : 
        'Not assigned'
    },
    { 
      type: 'brake_system', 
      label: 'Brake System', 
      data: selectedConfigData?.brake_systems,
      field: 'brake_system_id',
      display: selectedConfigData?.brake_systems?.type || 'Not assigned'
    },
    { 
      type: 'frame', 
      label: 'Frame', 
      data: selectedConfigData?.frames,
      field: 'frame_id',
      display: selectedConfigData?.frames ? 
        `${selectedConfigData.frames.type} (${selectedConfigData.frames.material || 'Unknown material'})` : 
        'Not assigned'
    },
    { 
      type: 'suspension', 
      label: 'Suspension', 
      data: selectedConfigData?.suspensions,
      field: 'suspension_id',
      display: selectedConfigData?.suspensions ? 
        `${selectedConfigData.suspensions.front_type || 'Standard'} / ${selectedConfigData.suspensions.rear_type || 'Standard'}` : 
        'Not assigned'
    },
    { 
      type: 'wheel', 
      label: 'Wheels', 
      data: selectedConfigData?.wheels,
      field: 'wheel_id',
      display: selectedConfigData?.wheels ? 
        `${selectedConfigData.wheels.front_size || 'Unknown'} / ${selectedConfigData.wheels.rear_size || 'Unknown'}` : 
        'Not assigned'
    }
  ];

  const handleComponentSelect = (componentType: string) => {
    setSelectedComponentType(componentType);
    setShowComponentDialog(true);
  };

  const handleComponentAssigned = () => {
    setShowComponentDialog(false);
    setSelectedComponentType(null);
    onRefresh();
  };

  if (!selectedConfigData) {
    return (
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Components
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Wrench className="h-12 w-12 text-explorer-text-muted mx-auto mb-4" />
            <p className="text-explorer-text-muted">Select a configuration to manage components</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Components
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {components.map((component) => (
            <div
              key={component.type}
              className="flex items-center justify-between p-3 bg-explorer-dark rounded-lg border border-explorer-chrome/20"
            >
              <div className="flex-1">
                <div className="font-medium text-explorer-text mb-1">
                  {component.label}
                </div>
                <div className="text-sm text-explorer-text-muted">
                  {component.display}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {component.data ? (
                  <Badge className="bg-green-500/20 text-green-400">
                    Assigned
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-orange-400/30 text-orange-400">
                    Missing
                  </Badge>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleComponentSelect(component.type)}
                  className="border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
                >
                  <Settings className="h-3 w-3 mr-1" />
                  {component.data ? 'Change' : 'Assign'}
                </Button>
              </div>
            </div>
          ))}
          
          <div className="pt-3 border-t border-explorer-chrome/30">
            <Button
              variant="outline"
              size="sm"
              className="w-full border-blue-400/30 text-blue-400 hover:bg-blue-400/10"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Component Library
            </Button>
          </div>
        </CardContent>
      </Card>

      <ComponentSelectionDialog
        open={showComponentDialog}
        onClose={() => setShowComponentDialog(false)}
        componentType={selectedComponentType}
        configurationId={selectedConfigData?.id}
        currentComponentId={selectedConfigData?.[components.find(c => c.type === selectedComponentType)?.field || '']}
        onComponentAssigned={handleComponentAssigned}
      />
    </>
  );
};

export default ComponentManagementPanel;
