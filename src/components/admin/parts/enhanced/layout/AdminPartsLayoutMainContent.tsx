
import React from "react";
import { Card } from "@/components/ui/card";
import MultiYearSelector from "../MultiYearSelector";
import TrimLevelsSection from "../TrimLevelsSection";
import ComponentsSection from "../ComponentsSection";

interface AdminPartsLayoutMainContentProps {
  selectedModel: string | null;
  selectedYear: string | null;
  selectedYears: string[];
  modelYears: any[];
  allConfigsForSelectedYears: any[];
  onYearToggle: (yearId: string) => void;
  onSelectAllYears: () => void;
  onClearAllYears: () => void;
  onCreateNew: (yearIds?: string[]) => void;
  onEditConfig: (config: any) => void;
  onCopyConfig: (config: any) => void;
  onDeleteConfig: (config: any) => void;
  onPreviewConfig: (config: any) => void;
  onRefreshData: () => Promise<void>;
  onManageComponents: () => void;
  onBulkAssign: () => void;
  configurations: any[];
  selectedConfig: string | null;
  onConfigSelect: (configId: string) => void;
  refreshConfigurations: () => Promise<void>;
  validation: any;
}

const AdminPartsLayoutMainContent = ({
  selectedModel,
  selectedYear,
  selectedYears,
  modelYears,
  allConfigsForSelectedYears,
  onYearToggle,
  onSelectAllYears,
  onClearAllYears,
  onCreateNew,
  onEditConfig,
  onCopyConfig,
  onDeleteConfig,
  onPreviewConfig,
  onRefreshData,
  onManageComponents,
  onBulkAssign,
  configurations,
  selectedConfig,
  onConfigSelect,
  refreshConfigurations,
  validation
}: AdminPartsLayoutMainContentProps) => {
  return (
    <div className="xl:col-span-3 space-y-6">
      {/* Years Section */}
      {selectedModel && (
        <MultiYearSelector
          modelYears={modelYears}
          selectedYears={selectedYears}
          onYearToggle={onYearToggle}
          onSelectAll={onSelectAllYears}
          onClearAll={onClearAllYears}
        />
      )}

      {/* Trim Levels Section */}
      {selectedModel && (
        <TrimLevelsSection
          selectedYears={selectedYears}
          configurations={allConfigsForSelectedYears}
          onCreateNew={onCreateNew}
          onEdit={onEditConfig}
          onCopy={onCopyConfig}
          onDelete={onDeleteConfig}
          onPreview={onPreviewConfig}
          onRefresh={onRefreshData}
        />
      )}

      {/* Components Section */}
      {selectedModel && (
        <ComponentsSection
          selectedYears={selectedYears}
          onManageComponents={onManageComponents}
          onBulkAssign={onBulkAssign}
        />
      )}
    </div>
  );
};

export default AdminPartsLayoutMainContent;
