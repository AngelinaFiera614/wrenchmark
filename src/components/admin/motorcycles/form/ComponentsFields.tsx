
import React, { useState } from "react";
import { Control } from "react-hook-form";
import { ComponentSelection } from "./ComponentSelection";
import { ComponentDialogManager } from "./ComponentDialogManager";

interface ComponentsFieldsProps {
  control: Control<any>;
}

export function ComponentsFields({ control }: ComponentsFieldsProps) {
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  
  const handleAddNew = (componentType: string) => {
    setActiveDialog(componentType);
  };
  
  const handleComponentCreated = (type: string, id: string) => {
    // The ComponentSelection will be updated automatically thanks to 
    // the useQuery React Query hook and cache invalidation
  };
  
  return (
    <div className="space-y-4">
      <ComponentSelection 
        control={control} 
        onAddNew={handleAddNew} 
      />
      
      <ComponentDialogManager
        activeDialog={activeDialog}
        onClose={() => setActiveDialog(null)}
        onComponentCreated={handleComponentCreated}
      />
    </div>
  );
}
