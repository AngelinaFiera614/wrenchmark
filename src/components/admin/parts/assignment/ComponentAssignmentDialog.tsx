
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Wrench } from "lucide-react";
import { useComponentData } from "./hooks/useComponentData";
import { useAssignmentActions } from "./hooks/useAssignmentActions";
import { componentTypes } from "./utils/componentNameUtils";
import AssignmentCard from "./components/AssignmentCard";

interface ComponentAssignmentDialogProps {
  open: boolean;
  onClose: () => void;
  model: any;
  onSuccess: () => void;
}

const ComponentAssignmentDialog: React.FC<ComponentAssignmentDialogProps> = ({
  open,
  onClose,
  model,
  onSuccess
}) => {
  const componentData = useComponentData();
  const { assignments, loading, handleAssignComponent, handleRemoveComponent } = useAssignmentActions(model);

  const renderAssignmentCard = (componentType: any) => {
    const assignment = assignments.find(a => a.component_type === componentType.key);
    const data = componentData.getComponentDataByType(componentType.key);
    
    return (
      <AssignmentCard
        key={componentType.key}
        componentType={componentType}
        assignment={assignment}
        componentData={data}
        loading={loading}
        onAssignComponent={handleAssignComponent}
        onRemoveComponent={handleRemoveComponent}
      />
    );
  };

  if (!model) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Component Assignments
            <Badge variant="outline" className="ml-2">
              {model.brands?.[0]?.name || 'Unknown'} {model.name}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Wrench className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800 dark:text-blue-200">
                  Model-Level Assignment
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Components assigned here will be inherited by all trim levels. 
                  Individual trim levels can override these assignments as needed.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {componentTypes.map(renderAssignmentCard)}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-6 border-t border-explorer-chrome/30">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onSuccess} className="bg-accent-teal text-black hover:bg-accent-teal/80">
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComponentAssignmentDialog;
