
import React from "react";
import ContextSidebar from "../ContextSidebar";

interface AdminPartsLayoutSidebarProps {
  selectedModel: string | null;
  selectedYear: string | null;
  selectedConfig: string | null;
  selectedModelData: any;
  selectedYearData: any;
  selectedConfigData: any;
  models: any[];
  modelYears: any[];
  configurations: any[];
  onModelSelect: (modelId: string) => void;
  onYearSelect: (yearId: string) => void;
  onConfigSelect: (configId: string) => void;
}

const AdminPartsLayoutSidebar = (props: AdminPartsLayoutSidebarProps) => {
  return (
    <div className="xl:col-span-1">
      <div className="mb-4 p-4 bg-explorer-card border border-explorer-chrome/30 rounded-lg">
        <h3 className="text-lg font-semibold text-explorer-text mb-2">Navigation</h3>
        <p className="text-sm text-explorer-text-muted">
          Component management is now integrated within configurations. 
          Use the Component Library section to manage engines, brakes, frames, 
          suspensions, and wheels.
        </p>
      </div>
      <ContextSidebar {...props} />
    </div>
  );
};

export default AdminPartsLayoutSidebar;
