
import React from "react";
import TrimLevelManagerEnhanced from "../TrimLevelManagerEnhanced";
import ComponentsSection from "./ComponentsSection";
import ColorManagementSection from "./ColorManagementSection";
import { Configuration } from "@/types/motorcycle";

interface TrimSectionProps {
  modelYearId: string;
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
        selectedConfig={selectedConfigData}
        onRefresh={onConfigChange}
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
