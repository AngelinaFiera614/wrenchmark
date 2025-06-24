
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { getComponentName } from "../utils/componentNameUtils";

interface AssignmentCardProps {
  componentType: {
    key: string;
    label: string;
  };
  assignment: any;
  componentData: any[];
  loading: boolean;
  onAssignComponent: (componentType: string, componentId: string) => void;
  onRemoveComponent: (componentType: string) => void;
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({
  componentType,
  assignment,
  componentData,
  loading,
  onAssignComponent,
  onRemoveComponent
}) => {
  const isAssigned = !!assignment;
  
  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>{componentType.label}</span>
          <Badge variant={isAssigned ? "default" : "outline"}>
            {isAssigned ? (
              <><CheckCircle className="h-3 w-3 mr-1" />Assigned</>
            ) : (
              <><AlertTriangle className="h-3 w-3 mr-1" />Not Assigned</>
            )}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAssigned && (
          <div className="p-3 bg-explorer-dark rounded border border-accent-teal/30">
            <div className="font-medium text-accent-teal">
              {getComponentName(componentType.key, assignment.component_id, componentData)}
            </div>
            <div className="text-xs text-explorer-text-muted mt-1">
              Assigned to all trim levels by default
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <Select
            value={assignment?.component_id || ""}
            onValueChange={(value) => value && onAssignComponent(componentType.key, value)}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${componentType.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {componentData?.map((component: any) => (
                <SelectItem key={component.id} value={component.id}>
                  {getComponentName(componentType.key, component.id, componentData)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {isAssigned && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRemoveComponent(componentType.key)}
              disabled={loading}
              className="w-full text-orange-400 border-orange-400/30 hover:bg-orange-400/20"
            >
              Remove Assignment
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AssignmentCard;
