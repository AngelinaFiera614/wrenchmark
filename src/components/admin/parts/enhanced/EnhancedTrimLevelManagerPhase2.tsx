
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Configuration } from "@/types/motorcycle";
import ConfigurationBreadcrumbEnhanced from "../navigation/ConfigurationBreadcrumbEnhanced";
import BulkOperationsToolbar from "../bulk/BulkOperationsToolbar";
import ConfigurationTemplates from "../templates/ConfigurationTemplates";
import SmartDataEntry from "../smart-entry/SmartDataEntry";
import TrimLevelManagerEnhanced from "../TrimLevelManagerEnhanced";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

interface EnhancedTrimLevelManagerPhase2Props {
  modelYearId: string;
  configurations: Configuration[];
  selectedConfig: string | null;
  selectedModelData?: any;
  selectedYearData?: any;
  selectedConfigData?: any;
  onConfigSelect: (configId: string) => void;
  onConfigChange: () => void;
}

const EnhancedTrimLevelManagerPhase2 = ({
  modelYearId,
  configurations,
  selectedConfig,
  selectedModelData,
  selectedYearData,
  selectedConfigData,
  onConfigSelect,
  onConfigChange
}: EnhancedTrimLevelManagerPhase2Props) => {
  const { toast } = useToast();
  const [selectedConfigurations, setSelectedConfigurations] = useState<string[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [formData, setFormData] = useState({});

  // Keyboard shortcuts
  const shortcuts = useKeyboardShortcuts({
    onSave: () => handleQuickSave(),
    onCopy: () => handleQuickCopy(),
    onEdit: () => handleQuickEdit(),
    onNew: () => setShowTemplates(true),
    onSelectAll: () => handleSelectAll(),
    onCancel: () => setSelectedConfigurations([])
  });

  const handleQuickCopy = () => {
    if (selectedConfigData) {
      toast({
        title: "Quick Copy",
        description: `Copying "${selectedConfigData.name}" configuration...`
      });
      // Implementation would trigger copy dialog
    }
  };

  const handleQuickEdit = () => {
    if (selectedConfigData) {
      toast({
        title: "Quick Edit",
        description: `Editing "${selectedConfigData.name}" configuration...`
      });
      // Implementation would trigger edit mode
    }
  };

  const handleQuickSave = () => {
    toast({
      title: "Quick Save",
      description: "Saving current changes..."
    });
    // Implementation would save current form state
  };

  const handleSelectAll = () => {
    setSelectedConfigurations(configurations.map(c => c.id));
  };

  const handleBulkCopy = (configIds: string[]) => {
    toast({
      title: "Bulk Copy",
      description: `Copying ${configIds.length} configurations...`
    });
    // Implementation for bulk copy
  };

  const handleBulkEdit = (configIds: string[]) => {
    toast({
      title: "Bulk Edit", 
      description: `Editing ${configIds.length} configurations...`
    });
    // Implementation for bulk edit
  };

  const handleBulkDelete = (configIds: string[]) => {
    toast({
      title: "Bulk Delete",
      description: `Deleting ${configIds.length} configurations...`
    });
    // Implementation for bulk delete
  };

  const handleBulkExport = (configIds: string[]) => {
    toast({
      title: "Bulk Export",
      description: `Exporting ${configIds.length} configurations...`
    });
    // Implementation for bulk export
  };

  const handleTemplateSelect = (template: any) => {
    toast({
      title: "Template Applied",
      description: `Applied "${template.name}" template`
    });
    setShowTemplates(false);
    // Implementation would apply template to form
  };

  const handleApplySuggestion = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    toast({
      title: "Suggestion Applied",
      description: `Updated ${field} with suggested value`
    });
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Breadcrumb with Quick Actions */}
      <ConfigurationBreadcrumbEnhanced
        selectedModelData={selectedModelData}
        selectedYearData={selectedYearData}
        selectedConfigData={selectedConfigData}
        onQuickCopy={handleQuickCopy}
        onQuickEdit={handleQuickEdit}
        onQuickSave={handleQuickSave}
        showQuickActions={true}
      />

      {/* Configuration Templates */}
      {showTemplates && (
        <ConfigurationTemplates
          onTemplateSelect={handleTemplateSelect}
          onCreateTemplate={() => toast({ title: "Create Template", description: "Template creation feature coming soon" })}
        />
      )}

      {/* Smart Data Entry Assistance */}
      {Object.keys(formData).length > 0 && (
        <SmartDataEntry
          formData={formData}
          onFieldChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
          onApplySuggestion={handleApplySuggestion}
          motorcycleCategory={selectedModelData?.category}
          brandName={selectedModelData?.brands?.[0]?.name}
        />
      )}

      {/* Enhanced Trim Level Manager */}
      <TrimLevelManagerEnhanced
        modelYearId={modelYearId}
        configurations={configurations}
        selectedConfig={selectedConfig}
        onConfigSelect={onConfigSelect}
        onConfigChange={onConfigChange}
      />

      {/* Bulk Operations Toolbar */}
      <BulkOperationsToolbar
        selectedConfigurations={selectedConfigurations}
        totalConfigurations={configurations.length}
        onBulkCopy={handleBulkCopy}
        onBulkEdit={handleBulkEdit}
        onBulkDelete={handleBulkDelete}
        onBulkExport={handleBulkExport}
        onSelectAll={handleSelectAll}
        onClearSelection={() => setSelectedConfigurations([])}
        isVisible={true}
      />

      {/* Keyboard Shortcuts Helper */}
      <div className="fixed bottom-4 right-4 text-xs text-muted-foreground bg-explorer-card p-2 rounded border border-explorer-chrome/30">
        <div className="font-medium mb-1">Keyboard Shortcuts:</div>
        <div>{shortcuts.saveShortcut} Save • {shortcuts.copyShortcut} Copy • {shortcuts.editShortcut} Edit</div>
        <div>{shortcuts.newShortcut} New • {shortcuts.selectAllShortcut} Select All • {shortcuts.cancelShortcut} Cancel</div>
      </div>
    </div>
  );
};

export default EnhancedTrimLevelManagerPhase2;
