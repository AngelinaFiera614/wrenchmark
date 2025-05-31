
import React from "react";
import ComponentSelector from "@/components/admin/models/ComponentSelector";

interface ComponentsTabProps {
  formData: {
    engine_id: string;
    brake_system_id: string;
    frame_id: string;
    suspension_id: string;
    wheel_id: string;
  };
  onComponentSelect: (componentType: string, componentId: string, component: any) => void;
}

const ComponentsTab = ({ formData, onComponentSelect }: ComponentsTabProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ComponentSelector
        componentType="engine"
        selectedId={formData.engine_id}
        onSelect={(id, component) => onComponentSelect('engine', id, component)}
      />
      
      <ComponentSelector
        componentType="brakes"
        selectedId={formData.brake_system_id}
        onSelect={(id, component) => onComponentSelect('brake_system', id, component)}
      />
      
      <ComponentSelector
        componentType="frame"
        selectedId={formData.frame_id}
        onSelect={(id, component) => onComponentSelect('frame', id, component)}
      />
      
      <ComponentSelector
        componentType="suspension"
        selectedId={formData.suspension_id}
        onSelect={(id, component) => onComponentSelect('suspension', id, component)}
      />
      
      <ComponentSelector
        componentType="wheels"
        selectedId={formData.wheel_id}
        onSelect={(id, component) => onComponentSelect('wheel', id, component)}
      />
    </div>
  );
};

export default ComponentsTab;
