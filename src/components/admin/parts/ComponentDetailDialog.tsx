
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface ComponentDetailDialogProps {
  component: any;
  componentType: string;
  isOpen: boolean;
  onClose: () => void;
}

const ComponentDetailDialog: React.FC<ComponentDetailDialogProps> = ({
  component,
  componentType,
  isOpen,
  onClose
}) => {
  if (!component) return null;

  const renderComponentDetails = () => {
    switch (componentType) {
      case 'engines':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-explorer-text mb-2">Basic Info</h4>
                <div className="space-y-2 text-sm">
                  <div>Displacement: {component.displacement_cc}cc</div>
                  {component.power_hp && <div>Power: {component.power_hp}hp</div>}
                  {component.torque_nm && <div>Torque: {component.torque_nm}Nm</div>}
                  {component.engine_type && <div>Type: {component.engine_type}</div>}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-explorer-text mb-2">Technical</h4>
                <div className="space-y-2 text-sm">
                  {component.cylinder_count && <div>Cylinders: {component.cylinder_count}</div>}
                  {component.cooling && <div>Cooling: {component.cooling}</div>}
                  {component.fuel_system && <div>Fuel System: {component.fuel_system}</div>}
                </div>
              </div>
            </div>
            {component.notes && (
              <div>
                <h4 className="font-medium text-explorer-text mb-2">Notes</h4>
                <p className="text-sm text-explorer-text-muted">{component.notes}</p>
              </div>
            )}
          </div>
        );

      case 'brakes':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-explorer-text mb-2">System Info</h4>
                <div className="space-y-2 text-sm">
                  <div>Type: {component.type}</div>
                  {component.brake_brand && <div>Brand: {component.brake_brand}</div>}
                  {component.front_type && <div>Front: {component.front_type}</div>}
                  {component.rear_type && <div>Rear: {component.rear_type}</div>}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-explorer-text mb-2">Features</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex gap-2">
                    {component.has_abs && <Badge variant="outline">ABS</Badge>}
                    {component.has_traction_control && <Badge variant="outline">TC</Badge>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div className="text-sm text-explorer-text-muted">
              Component details for {componentType}
            </div>
            <pre className="text-xs bg-explorer-dark p-4 rounded overflow-auto">
              {JSON.stringify(component, null, 2)}
            </pre>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-explorer-card border-explorer-chrome/30">
        <DialogHeader>
          <DialogTitle className="text-explorer-text">
            {component.name || `${componentType} Component`}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {renderComponentDetails()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComponentDetailDialog;
