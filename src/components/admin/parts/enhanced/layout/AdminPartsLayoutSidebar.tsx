
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
      <ContextSidebar {...props} />
    </div>
  );
};

export default AdminPartsLayoutSidebar;
