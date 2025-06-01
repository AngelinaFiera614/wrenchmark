
import React, { useState } from "react";
import { Configuration } from "@/types/motorcycle";
import { useConfigurationMetrics } from "@/hooks/useConfigurationMetrics";
import TrimLevelEditorHeader from "./trim-level-editor/TrimLevelEditorHeader";
import TrimLevelEditorTabs from "./trim-level-editor/TrimLevelEditorTabs";
import EnhancedValidationDisplay from "./trim-level-editor/EnhancedValidationDisplay";
import CompletenessIndicator from "./trim-level-editor/CompletenessIndicator";
import { useTrimLevelFormEnhanced } from "./trim-level-editor/useTrimLevelFormEnhanced";
import { useTrimLevelSave } from "./trim-level-editor/useTrimLevelSave";

interface TrimLevelEditorEnhancedProps {
  modelYearId: string;
  configuration?: Configuration;
  onSave: (config: Configuration) => void;
  onCancel: () => void;
}

const TrimLevelEditorEnhanced = ({ 
  modelYearId, 
  configuration, 
  onSave, 
  onCancel 
}: TrimLevelEditorEnhancedProps) => {
  const [activeTab, setActiveTab] = useState("basic");
  
  const {
    formData,
    selectedComponents,
    validation,
    completeness,
    handleInputChange,
    handleComponentSelect,
    getMockConfiguration,
    getCleanConfigData
  } = useTrimLevelFormEnhanced(modelYearId, configuration);

  const {
    handleSave,
    saving,
    lastError,
    setLastError
  } = useTrimLevelSave(modelYearId, configuration, onSave);

  const metrics = useConfigurationMetrics(getMockConfiguration());

  // Clear error when user makes changes
  const handleInputChangeWithErrorClear = (field: string, value: any) => {
    handleInputChange(field, value);
    if (lastError) setLastError(null);
  };

  const onSaveClick = () => {
    // Use the enhanced validation instead of the old one
    if (!validation.isValid) {
      setLastError("Please fix all validation errors before saving.");
      return;
    }
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

      {/* Completeness Indicator */}
      <CompletenessIndicator completeness={completeness} />

      {/* Enhanced Validation Display */}
      <EnhancedValidationDisplay validation={validation} />

      <TrimLevelEditorTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        formData={formData}
        onInputChange={handleInputChangeWithErrorClear}
        onComponentSelect={handleComponentSelect}
        metrics={metrics}
      />
    </div>
  );
};

export default TrimLevelEditorEnhanced;
