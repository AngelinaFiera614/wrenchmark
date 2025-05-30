
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Settings, ExternalLink, AlertTriangle, CheckCircle } from "lucide-react";
import { Configuration } from "@/types/motorcycle";
import ComponentSelector from "@/components/admin/models/ComponentSelector";

interface ComponentAssignmentGridProps {
  configuration: Configuration;
  onComponentChange: (componentType: string, componentId: string) => void;
}

const ComponentAssignmentGrid = ({
  configuration,
  onComponentChange
}: ComponentAssignmentGridProps) => {
  const [selectedComponentType, setSelectedComponentType] = useState<string | null>(null);

  const componentTypes = [
    {
      id: 'engine',
      name: 'Engine',
      icon: '🔧',
      assignedId: configuration.engine_id,
      assignedComponent: configuration.engine,
      color: 'bg-red-500/20 text-red-400 border-red-500/30'
    },
    {
      id: 'brakes',
      name: 'Brake System',
      icon: '🛑',
      assignedId: configuration.brake_system_id,
      assignedComponent: configuration.brakes,
      color: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    },
    {
      id: 'frame',
      name: 'Frame',
      icon: '🏗️',
      assignedId: configuration.frame_id,
      assignedComponent: configuration.frame,
      color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    },
    {
      id: 'suspension',
      name: 'Suspension',
      icon: '🔩',
      assignedId: configuration.suspension_id,
      assignedComponent: configuration.suspension,
      color: 'bg-green-500/20 text-green-400 border-green-500/30'
    },
    {
      id: 'wheels',
      name: 'Wheels',
      icon: '⚫',
      assignedId: configuration.wheel_id,
      assignedComponent: configuration.wheels,
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    }
  ];

  const getComponentDescription = (componentType: string, component: any) => {
    if (!component) return null;

    switch (componentType) {
      case 'engine':
        return `${component.displacement_cc}cc${component.power_hp ? `, ${component.power_hp}hp` : ''}`;
      case 'brakes':
        return component.type || 'Brake System';
      case 'frame':
        return `${component.type}${component.material ? ` - ${component.material}` : ''}`;
      case 'suspension':
        return `${component.front_type || 'Front'} / ${component.rear_type || 'Rear'}`;
      case 'wheels':
        return `${component.front_size || ''} / ${component.rear_size || ''}`.trim();
      default:
        return component.name || 'Component';
    }
  };

  const handleComponentSelect = (componentId: string, component: any) => {
    if (selectedComponentType) {
      onComponentChange(selectedComponentType, componentId);
      setSelectedComponentType(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Component Assignment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {componentTypes.map((type) => (
              <Card
                key={type.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  type.assignedId
                    ? 'border-green-500/30 bg-green-500/10'
                    : 'border-orange-500/30 bg-orange-500/10'
                }`}
                onClick={() => setSelectedComponentType(type.id)}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{type.icon}</span>
                        <span className="font-medium text-explorer-text">{type.name}</span>
                      </div>
                      {type.assignedId ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                      )}
                    </div>

                    {type.assignedComponent ? (
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-explorer-text">
                          {type.assignedComponent.name || 'Assigned Component'}
                        </div>
                        <div className="text-xs text-explorer-text-muted">
                          {getComponentDescription(type.id, type.assignedComponent)}
                        </div>
                        <Badge variant="outline" className="text-xs bg-green-500/20 text-green-400">
                          Assigned
                        </Badge>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-sm text-explorer-text-muted">
                          No {type.name.toLowerCase()} assigned
                        </div>
                        <Badge variant="outline" className="text-xs bg-orange-500/20 text-orange-400">
                          Not Assigned
                        </Badge>
                      </div>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedComponentType(type.id);
                      }}
                    >
                      <ExternalLink className="mr-1 h-3 w-3" />
                      {type.assignedId ? 'Change' : 'Assign'} Component
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Component Selection Dialog */}
      <Dialog
        open={!!selectedComponentType}
        onOpenChange={(open) => !open && setSelectedComponentType(null)}
      >
        <DialogContent className="max-w-4xl bg-explorer-dark border-explorer-chrome/30">
          <DialogHeader>
            <DialogTitle className="text-explorer-text">
              Select {selectedComponentType && componentTypes.find(t => t.id === selectedComponentType)?.name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedComponentType && (
            <div className="mt-4">
              <ComponentSelector
                componentType={selectedComponentType as any}
                selectedId={
                  selectedComponentType === 'engine' ? configuration.engine_id :
                  selectedComponentType === 'brakes' ? configuration.brake_system_id :
                  selectedComponentType === 'frame' ? configuration.frame_id :
                  selectedComponentType === 'suspension' ? configuration.suspension_id :
                  selectedComponentType === 'wheels' ? configuration.wheel_id :
                  undefined
                }
                onSelect={handleComponentSelect}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ComponentAssignmentGrid;
