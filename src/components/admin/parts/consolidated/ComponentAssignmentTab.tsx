
import React from "react";
import ComponentAssignmentWorkflow from "./ComponentAssignmentWorkflow";

interface ComponentAssignmentTabProps {
  configurationData: any;
  onComponentChange: (componentType: string, componentId: string | null, isOverride: boolean) => void;
  selectedModelData?: any;
}

const ComponentAssignmentTab: React.FC<ComponentAssignmentTabProps> = ({
  configurationData,
  onComponentChange,
  selectedModelData
}) => {
  return (
    <ComponentAssignmentWorkflow
      configurationData={configurationData}
      onComponentChange={onComponentChange}
      selectedModelData={selectedModelData}
    />
  );
};

export default ComponentAssignmentTab;
