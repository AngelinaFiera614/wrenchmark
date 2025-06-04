
import React, { useState } from "react";
import ExpandableSection from "./ExpandableSection";
import TrimBasicInfoSection from "./TrimBasicInfoSection";
import TrimComponentsSection from "./TrimComponentsSection";
import TrimPreviewSection from "./TrimPreviewSection";
import TrimNotesSection from "./TrimNotesSection";
import { useTrimLevelFormEnhanced } from "../trim-level-editor/useTrimLevelFormEnhanced";
import { useTrimLevelSave } from "../trim-level-editor/useTrimLevelSave";
import { useConfigurationMetrics } from "@/hooks/useConfigurationMetrics";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";
import { Configuration } from "@/types/motorcycle";

interface HorizontalTrimManagerProps {
  modelYearIds: string[];
  configuration?: Configuration;
  onSave: (config: Configuration) => void;
  onCancel: () => void;
}

const HorizontalTrimManager = ({
  modelYearIds,
  configuration,
  onSave,
  onCancel
}: HorizontalTrimManagerProps) => {
  const [expandedSection, setExpandedSection] = useState<string>("basic");

  // Use the first model year ID for form initialization if editing existing config
  const primaryModelYearId = configuration?.model_year_id || modelYearIds[0] || "";

  const {
    formData,
    selectedComponents,
    validation,
    completeness,
    handleInputChange,
    handleComponentSelect,
    getMockConfiguration,
    getCleanConfigData
  } = useTrimLevelFormEnhanced(primaryModelYearId, configuration);

  const {
    handleSave,
    saving,
    lastError,
    setLastError
  } = useTrimLevelSave(modelYearIds, configuration, onSave);

  const metrics = useConfigurationMetrics(getMockConfiguration());

  const handleSectionToggle = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? "" : sectionId);
  };

  const handleInputChangeWithErrorClear = (field: string, value: any) => {
    handleInputChange(field, value);
    if (lastError) setLastError(null);
  };

  const onSaveClick = () => {
    if (!validation.isValid) {
      setLastError("Please fix all validation errors before saving.");
      return;
    }
    handleSave(formData, getCleanConfigData);
  };

  const getSectionSummary = (sectionId: string) => {
    switch (sectionId) {
      case 'basic':
        const basicItems = [];
        if (formData.name) basicItems.push(`Name: ${formData.name}`);
        if (formData.msrp_usd) basicItems.push(`MSRP: $${formData.msrp_usd}`);
        if (formData.seat_height_mm) basicItems.push(`Seat: ${formData.seat_height_mm}mm`);
        return basicItems.length > 0 ? basicItems.join(', ') : 'No basic information provided';
        
      case 'components':
        const components = [];
        if (formData.engine_id) components.push('Engine');
        if (formData.brake_system_id) components.push('Brakes');
        if (formData.frame_id) components.push('Frame');
        return components.length > 0 ? `${components.join(', ')} assigned` : 'No components assigned';
        
      case 'preview':
        return `${completeness.overall}% complete, ${validation.errors.length} errors, ${validation.warnings.length} warnings`;

      case 'notes':
        return formData.notes ? 'Documentation added' : 'No notes added';
        
      default:
        return 'Section content';
    }
  };

  const isMultiYear = modelYearIds.length > 1;

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-explorer-text">
            {configuration ? 'Edit Trim Level' : 'Create New Trim Level'}
          </h2>
          {isMultiYear && !configuration && (
            <p className="text-sm text-explorer-text-muted">
              This trim level will be created for {modelYearIds.length} model years
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            className="border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={onSaveClick}
            disabled={saving || !validation.isValid}
            className="bg-accent-teal text-black hover:bg-accent-teal/90"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : `Save Configuration${isMultiYear && !configuration ? ` (${modelYearIds.length} years)` : ''}`}
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {lastError && (
        <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
          {lastError}
        </div>
      )}

      {/* Horizontal Expandable Sections */}
      <div className="space-y-4">
        <ExpandableSection
          id="basic"
          title="Trim, Price & Dimensions"
          status={validation.sectionStatus?.basic || 'missing'}
          summary={getSectionSummary('basic')}
          isExpanded={expandedSection === 'basic'}
          onToggle={handleSectionToggle}
        >
          <TrimBasicInfoSection
            formData={formData}
            onInputChange={handleInputChangeWithErrorClear}
          />
        </ExpandableSection>

        <ExpandableSection
          id="components"
          title="Component Assignment"
          status={validation.sectionStatus?.components || 'missing'}
          summary={getSectionSummary('components')}
          isExpanded={expandedSection === 'components'}
          onToggle={handleSectionToggle}
        >
          <TrimComponentsSection
            formData={formData}
            selectedComponents={selectedComponents}
            onComponentSelect={handleComponentSelect}
          />
        </ExpandableSection>

        <ExpandableSection
          id="preview"
          title="Preview & Validation"
          status={validation.isValid ? 'complete' : validation.errors.length > 0 ? 'missing' : 'partial'}
          summary={getSectionSummary('preview')}
          isExpanded={expandedSection === 'preview'}
          onToggle={handleSectionToggle}
        >
          <TrimPreviewSection
            formData={formData}
            validation={validation}
            completeness={completeness}
            metrics={metrics}
          />
        </ExpandableSection>

        <ExpandableSection
          id="notes"
          title="Notes & Documentation"
          status={formData.notes ? 'complete' : 'missing'}
          summary={getSectionSummary('notes')}
          isExpanded={expandedSection === 'notes'}
          onToggle={handleSectionToggle}
        >
          <TrimNotesSection
            formData={formData}
            validation={validation}
            completeness={completeness}
            onInputChange={handleInputChangeWithErrorClear}
          />
        </ExpandableSection>
      </div>
    </div>
  );
};

export default HorizontalTrimManager;
