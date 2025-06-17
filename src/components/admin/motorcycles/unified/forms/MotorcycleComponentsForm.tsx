
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Settings } from "lucide-react";
import { Motorcycle } from "@/types";

interface MotorcycleComponentsFormProps {
  motorcycle: Motorcycle;
  isEditing: boolean;
  onUpdate: (data: Partial<Motorcycle>) => void;
}

const MotorcycleComponentsForm = ({ motorcycle, isEditing, onUpdate }: MotorcycleComponentsFormProps) => {
  return (
    <div className="space-y-6">
      <Card className="bg-explorer-dark border-explorer-chrome/20">
        <CardHeader>
          <CardTitle className="text-explorer-text flex items-center justify-between">
            Component Assignments
            {isEditing && (
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Assign Components
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['Engine', 'Brakes', 'Suspension', 'Frame', 'Wheels'].map((componentType) => (
              <div key={componentType} className="flex items-center justify-between p-3 bg-explorer-card rounded-lg border border-explorer-chrome/20">
                <div>
                  <div className="font-medium text-explorer-text">{componentType}</div>
                  <div className="text-sm text-explorer-text-muted">
                    No component assigned
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                    Missing
                  </Badge>
                  {isEditing && (
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-explorer-dark border-explorer-chrome/20">
        <CardHeader>
          <CardTitle className="text-explorer-text">Component Library Quick Access</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-explorer-text-muted">
            <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Component management will be integrated here</p>
            <p className="text-sm">This will allow direct assignment of parts to models</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MotorcycleComponentsForm;
