
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Plus, Wrench } from "lucide-react";

interface ComponentsSectionProps {
  selectedYears: string[];
  onManageComponents: () => void;
  onBulkAssign: () => void;
}

const ComponentsSection = ({
  selectedYears,
  onManageComponents,
  onBulkAssign
}: ComponentsSectionProps) => {
  const componentTypes = [
    { id: 'engines', label: 'Engines', count: 12, icon: Wrench },
    { id: 'brakes', label: 'Brake Systems', count: 8, icon: Wrench },
    { id: 'frames', label: 'Frames', count: 6, icon: Wrench },
    { id: 'suspension', label: 'Suspension', count: 10, icon: Wrench },
    { id: 'wheels', label: 'Wheels', count: 15, icon: Wrench },
  ];

  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-explorer-text flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Component Library
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onBulkAssign}
              disabled={selectedYears.length === 0}
              className="border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
            >
              <Settings className="h-3 w-3 mr-1" />
              Bulk Assign
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onManageComponents}
              className="border-accent-teal/30 text-accent-teal hover:bg-accent-teal/10"
            >
              <Plus className="h-3 w-3 mr-1" />
              Manage Components
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {componentTypes.map(component => (
            <Card key={component.id} className="bg-explorer-dark border-explorer-chrome/30 hover:border-accent-teal/50 transition-colors cursor-pointer">
              <CardContent className="p-4 text-center">
                <component.icon className="h-6 w-6 mx-auto mb-2 text-accent-teal" />
                <div className="text-sm font-medium text-explorer-text mb-1">
                  {component.label}
                </div>
                <Badge variant="secondary" className="text-xs">
                  {component.count} available
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {selectedYears.length === 0 && (
          <div className="mt-4 p-4 bg-explorer-dark/50 rounded-lg border border-explorer-chrome/30">
            <div className="text-sm text-explorer-text-muted text-center">
              Select model years above to assign components to trim levels
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ComponentsSection;
