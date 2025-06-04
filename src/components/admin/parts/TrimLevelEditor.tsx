
import React, { useState } from "react";
import { Configuration } from "@/types/motorcycle";
import { useConfigurationMetrics } from "@/hooks/useConfigurationMetrics";
import TrimLevelEditorHeader from "./trim-level-editor/TrimLevelEditorHeader";
import TrimLevelEditorTabs from "./trim-level-editor/TrimLevelEditorTabs";
import ErrorDisplay from "./trim-level-editor/ErrorDisplay";
import { useTrimLevelForm } from "./trim-level-editor/useTrimLevelForm";
import { useTrimLevelSave } from "./trim-level-editor/useTrimLevelSave";

interface TrimLevelEditorProps {
  modelYearId: string;
  configuration?: Configuration;
  onSave: (config: Configuration) => void;
  onCancel: () => void;
}

const TrimLevelEditor = ({ 
  modelYearId, 
  configuration, 
  onSave, 
  onCancel 
}: TrimLevelEditorProps) => {
  const [activeTab, setActiveTab] = useState("basic");
  
  const {
    formData,
    selectedComponents,
    existingDefault,
    hasCheckedDefault,
    handleInputChange,
    handleComponentSelect,
    getMockConfiguration,
    getCleanConfigData
  } = useTrimLevelForm(modelYearId, configuration);

  const {
    handleSave,
    saving,
    lastError,
    setLastError
  } = useTrimLevelSave([modelYearId], configuration, onSave);

  const metrics = useConfigurationMetrics(getMockConfiguration());

  // Clear error when user makes changes
  const handleInputChangeWithErrorClear = (field: string, value: any) => {
    handleInputChange(field, value);
    if (lastError) setLastError(null);
  };

  const onSaveClick = () => {
    handleSave(formData, getCleanConfigData);
  };

  return (
    <div className="space-y-6">
      <TrimLevelEditorHeader
        isEditing={!!configuration}
        onSave={onSaveClick}
        onCancel={onCancel}
        saving={saving}
        formData={formData}
      />

      {/* Error Display */}
      {lastError && <ErrorDisplay error={lastError} />}

      <TrimLevelEditorTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        formData={formData}
        onInputChange={handleInputChangeWithErrorClear}
        onComponentSelect={handleComponentSelect}
        metrics={metrics}
        existingDefault={existingDefault}
      />
    </div>
  );
};

export default TrimLevelEditor;
