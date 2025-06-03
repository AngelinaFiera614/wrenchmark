
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wrench, Engine, Disc, Frame, Cog, Wheel } from "lucide-react";
import { Configuration } from "@/types/motorcycle";

interface ComponentsSectionProps {
  selectedConfig?: Configuration;
  onRefresh: () => void;
}

const ComponentsSection = ({
  selectedConfig,
  onRefresh
}: ComponentsSectionProps) => {
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
      icon: Engine,
      assigned: !!selectedConfig.engine_id,
      value: selectedConfig.engine_id
    },
    {
      name: "Brake System",
      icon: Disc,
      assigned: !!selectedConfig.brake_system_id,
      value: selectedConfig.brake_system_id
    },
    {
      name: "Frame",
      icon: Frame,
      assigned: !!selectedConfig.frame_id,
      value: selectedConfig.frame_id
    },
    {
      name: "Suspension",
      icon: Cog,
      assigned: !!selectedConfig.suspension_id,
      value: selectedConfig.suspension_id
    },
    {
      name: "Wheels",
      icon: Wheel,
      assigned: !!selectedConfig.wheel_id,
      value: selectedConfig.wheel_id
    }
  ];

  return (
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
                    <div className="text-xs text-explorer-text-muted">
                      ID: {component.value}
                    </div>
                  ) : (
                    <Button
                      size="sm"
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
  );
};

export default ComponentsSection;
