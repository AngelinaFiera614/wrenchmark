
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Settings, Check, X, Wrench } from "lucide-react";
import { Motorcycle } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { getModelComponentAssignments } from "@/services/modelComponentService";
import EnhancedComponentSelectionDialog from "@/components/admin/parts/consolidated/EnhancedComponentSelectionDialog";

interface MotorcycleComponentsFormProps {
  motorcycle: Motorcycle;
  isEditing: boolean;
  onUpdate: (data: Partial<Motorcycle>) => void;
}

const MotorcycleComponentsForm = ({ motorcycle, isEditing, onUpdate }: MotorcycleComponentsFormProps) => {
  const [selectedComponentType, setSelectedComponentType] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: assignments = [], refetch } = useQuery({
    queryKey: ["model-component-assignments", motorcycle.id],
    queryFn: () => getModelComponentAssignments(motorcycle.id),
    enabled: !!motorcycle.id
  });

  const componentTypes = [
    { key: 'engine', label: 'Engine', icon: Wrench },
    { key: 'brake_system', label: 'Brake System', icon: Settings },
    { key: 'suspension', label: 'Suspension', icon: Settings },
    { key: 'frame', label: 'Frame', icon: Settings },
    { key: 'wheel', label: 'Wheels', icon: Settings }
  ];

  const getAssignmentForType = (componentType: string) => {
    return assignments.find(a => a.component_type === componentType);
  };

  const handleComponentAssign = (componentType: string) => {
    setSelectedComponentType(componentType);
    setDialogOpen(true);
  };

  const handleAssignmentComplete = () => {
    refetch();
    setDialogOpen(false);
    setSelectedComponentType(null);
  };

  const getStatusBadge = (assignment: any) => {
    if (!assignment) {
      return <Badge variant="outline" className="text-yellow-400 border-yellow-400">Missing</Badge>;
    }
    return <Badge variant="outline" className="text-green-400 border-green-400">Assigned</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-explorer-dark border-explorer-chrome/20">
        <CardHeader>
          <CardTitle className="text-explorer-text flex items-center justify-between">
            Component Assignments
            {isEditing && (
              <Button size="sm" variant="outline" disabled>
                <Plus className="h-4 w-4 mr-2" />
                Bulk Assign
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {componentTypes.map((componentType) => {
              const assignment = getAssignmentForType(componentType.key);
              const Icon = componentType.icon;
              
              return (
                <div key={componentType.key} className="flex items-center justify-between p-3 bg-explorer-card rounded-lg border border-explorer-chrome/20">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-explorer-text-muted" />
                    <div>
                      <div className="font-medium text-explorer-text">{componentType.label}</div>
                      <div className="text-sm text-explorer-text-muted">
                        {assignment ? `Component assigned` : "No component assigned"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(assignment)}
                    {isEditing && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleComponentAssign(componentType.key)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-explorer-dark border-explorer-chrome/20">
        <CardHeader>
          <CardTitle className="text-explorer-text">Assignment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {assignments.length}
              </div>
              <div className="text-sm text-explorer-text-muted">Assigned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {componentTypes.length - assignments.length}
              </div>
              <div className="text-sm text-explorer-text-muted">Missing</div>
            </div>
          </div>
          
          {assignments.length === componentTypes.length && (
            <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-green-400">
                <Check className="h-4 w-4" />
                <span className="text-sm font-medium">All components assigned</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <EnhancedComponentSelectionDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        componentType={selectedComponentType}
        currentComponentId={selectedComponentType ? getAssignmentForType(selectedComponentType)?.component_id : undefined}
        onComponentAssigned={handleAssignmentComplete}
      />
    </div>
  );
};

export default MotorcycleComponentsForm;
