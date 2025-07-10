
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, Check, Wrench, AlertCircle } from "lucide-react";
import { Motorcycle } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { getModelComponentAssignments } from "@/services/modelComponentService";
import ComponentAssignmentDialog from "../../ComponentAssignmentDialog";

interface MotorcycleComponentsFormProps {
  motorcycle: Motorcycle;
  isEditing: boolean;
  onUpdate: (data: Partial<Motorcycle>) => void;
}

const MotorcycleComponentsForm = ({ motorcycle, isEditing, onUpdate }: MotorcycleComponentsFormProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: assignments = [], refetch, isLoading, error } = useQuery({
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

  const handleAssignmentComplete = async () => {
    // Refresh the assignments query
    await refetch();
    setDialogOpen(false);
  };

  const getStatusBadge = (assignment: any) => {
    if (!assignment) {
      return (
        <Badge variant="outline" className="text-yellow-600 border-yellow-400 bg-yellow-50">
          <AlertCircle className="h-3 w-3 mr-1" />
          Missing
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-green-600 border-green-400 bg-green-50">
        <Check className="h-3 w-3 mr-1" />
        Assigned
      </Badge>
    );
  };

  if (error) {
    return (
      <Card className="bg-explorer-dark border-explorer-chrome/20">
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <div className="text-red-400 font-medium mb-2">
            Error Loading Components
          </div>
          <div className="text-explorer-text-muted text-sm">
            {error.message || 'Failed to load component assignments'}
          </div>
          <Button
            variant="outline"
            onClick={() => refetch()}
            className="mt-4"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-explorer-dark border-explorer-chrome/20">
        <CardHeader>
          <CardTitle className="text-explorer-text flex items-center justify-between">
            Component Assignments
            {isEditing && (
              <Button 
                size="sm" 
                onClick={() => setDialogOpen(true)}
                className="bg-accent-teal hover:bg-accent-teal/90 text-black"
              >
                <Settings className="h-4 w-4 mr-2" />
                Manage Components
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {componentTypes.map((type) => (
                <div key={type.key} className="p-3 bg-explorer-card rounded-lg border border-explorer-chrome/20 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-5 bg-explorer-chrome/20 rounded"></div>
                      <div className="h-4 w-20 bg-explorer-chrome/20 rounded"></div>
                    </div>
                    <div className="h-6 w-16 bg-explorer-chrome/20 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
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
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
          
          {assignments.length === 0 && (
            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-400">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">No components assigned</span>
              </div>
              <div className="text-xs text-explorer-text-muted mt-1">
                Assign components to improve data completeness
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <ComponentAssignmentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedModel={motorcycle}
        onSuccess={handleAssignmentComplete}
      />
    </div>
  );
};

export default MotorcycleComponentsForm;
