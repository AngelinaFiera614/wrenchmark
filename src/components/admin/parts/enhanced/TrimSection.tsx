
import React from "react";
import TrimLevelManagerEnhanced from "../TrimLevelManagerEnhanced";
import ComponentsSection from "./ComponentsSection";
import ColorManagementSection from "./ColorManagementSection";
import { Configuration } from "@/types/motorcycle";

interface TrimSectionProps {
  modelYearId: string | null;
  configurations: Configuration[];
  selectedConfig: string | null;
  onConfigSelect: (configId: string) => void;
  onConfigChange: () => void;
}

const TrimSection = ({
  modelYearId,
  configurations,
  selectedConfig,
  onConfigSelect,
  onConfigChange
}: TrimSectionProps) => {
  const selectedConfigData = configurations.find(c => c.id === selectedConfig);

  if (!modelYearId) {
    return null;
  }

  const handleManageComponents = () => {
    console.log("Opening component library...");
    // Implement component management
  };

  const handleBulkAssign = () => {
    console.log("Opening bulk assign dialog...");
    // Implement bulk assignment
  };

  return (
    <div className="space-y-6">
      {/* Trim Level Manager */}
      <TrimLevelManagerEnhanced
        modelYearId={modelYearId}
        configurations={configurations}
        selectedConfig={selectedConfig}
        onConfigSelect={onConfigSelect}
        onConfigChange={onConfigChange}
      />

      {/* Components Section */}
      <ComponentsSection
        selectedYears={modelYearId ? [modelYearId] : []}
        onManageComponents={handleManageComponents}
        onBulkAssign={handleBulkAssign}
      />

      {/* Color Management Section */}
      <ColorManagementSection
        selectedConfig={selectedConfigData}
        onRefresh={onConfigChange}
      />
    </div>
  );
};

export default TrimSection;
