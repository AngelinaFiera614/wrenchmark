
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, AlertCircle } from "lucide-react";
import { Configuration } from "@/types/motorcycle";
import { deleteConfiguration, getAvailableTargetYears } from "@/services/models/configurationService";
import { supabase } from "@/integrations/supabase/client";
import TrimLevelEditorEnhanced from "./TrimLevelEditorEnhanced";
import TrimLevelActions from "./trim-level/TrimLevelActions";
import TrimLevelGrid from "./trim-level/TrimLevelGrid";
import TrimLevelDetails from "./trim-level/TrimLevelDetails";
import EnhancedCopyTrimLevelDialog from "./EnhancedCopyTrimLevelDialog";
import EnhancedDeleteTrimDialog from "./enhanced/EnhancedDeleteTrimDialog";
import QuickCopyDialog from "./enhanced/QuickCopyDialog";
import EnhancedTrimLevelActions from "./enhanced/EnhancedTrimLevelActions";

interface TrimLevelManagerEnhancedProps {
  modelYearId: string;
  configurations: Configuration[];
  selectedConfig: string | null;
  onConfigSelect: (configId: string) => void;
  onConfigChange: () => void;
}

const TrimLevelManagerEnhanced = ({
  modelYearId,
  configurations,
  selectedConfig,
  onConfigSelect,
  onConfigChange
}: TrimLevelManagerEnhancedProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editingConfig, setEditingConfig] = useState<Configuration | null>(null);
  const [copyDialogOpen, setCopyDialogOpen] = useState(false);
  const [copyingConfig, setCopyingConfig] = useState<Configuration | null>(null);
  const [availableYears, setAvailableYears] = useState<any[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingConfig, setDeletingConfig] = useState<Configuration | null>(null);
  const [quickCopyOpen, setQuickCopyOpen] = useState(false);
  const [quickCopyType, setQuickCopyType] = useState<'components' | 'dimensions' | 'colors' | 'all'>('all');

  const selectedConfigData = configurations.find(c => c.id === selectedConfig);

  const handleCreateNew = () => {
    console.log("Creating new trim level for model year:", modelYearId);
    setEditingConfig(null);
    setIsEditing(true);
  };

  const handleEdit = (config: Configuration) => {
    console.log("Editing trim level:", config);
    setEditingConfig(config);
    setIsEditing(true);
  };

  const handleClone = (config: Configuration) => {
    console.log("Cloning trim level:", config);
    const clonedConfig = {
      ...config,
      name: `${config.name} (Copy)`,
      is_default: false
    } as Configuration;
    setEditingConfig(clonedConfig);
    setIsEditing(true);
  };

  const handlePreview = (config: Configuration) => {
    console.log("Previewing trim level:", config);
    onConfigSelect(config.id);
  };

  const handleCopy = async (config: Configuration) => {
    try {
      console.log("Opening copy dialog for config:", config);
      setCopyingConfig(config);
      
      // Get the motorcycle ID from the model year
      const { data: modelYear } = await supabase
        .from('model_years')
        .select('motorcycle_id')
        .eq('id', modelYearId)
        .single();
        
      if (modelYear) {
        // Get all years for this motorcycle (including ones with existing configs)
        const years = await getAvailableTargetYears(modelYear.motorcycle_id);
        // Exclude the current year from the list
        setAvailableYears(years.filter(y => y.id !== modelYearId));
        setCopyDialogOpen(true);
      }
    } catch (error) {
      console.error("Error preparing copy dialog:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load available years for copying."
      });
    }
  };

  const handleDelete = (config: Configuration) => {
    console.log("Opening delete dialog for config:", config);
    setDeletingConfig(config);
    setDeleteDialogOpen(true);
  };

  const handleDeleteSuccess = () => {
    if (deletingConfig && selectedConfig === deletingConfig.id) {
      onConfigSelect('');
    }
    onConfigChange();
    setDeletingConfig(null);
  };

  const handleQuickCopy = (type: 'components' | 'dimensions' | 'colors' | 'all') => {
    if (!selectedConfigData) return;
    setQuickCopyType(type);
    setQuickCopyOpen(true);
  };

  const handleEditorClose = (refreshData = false) => {
    console.log("Closing editor, refreshData:", refreshData);
    setIsEditing(false);
    setEditingConfig(null);
    if (refreshData) {
      onConfigChange();
    }
  };

  const handleSaveSuccess = (savedConfig: Configuration) => {
    console.log("Trim level saved successfully:", savedConfig);
    toast({
      title: "Success!",
      description: `Trim level "${savedConfig.name}" has been saved successfully.`,
      action: <CheckCircle className="h-4 w-4 text-green-500" />
    });
    handleEditorClose(true);
    // Auto-select the newly created/updated config
    onConfigSelect(savedConfig.id);
  };

  if (isEditing) {
    return (
      <TrimLevelEditorEnhanced
        modelYearId={modelYearId}
        configuration={editingConfig || undefined}
        onSave={handleSaveSuccess}
        onCancel={() => handleEditorClose(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Trim Level Actions */}
      <EnhancedTrimLevelActions
        selectedConfig={selectedConfigData}
        configurations={configurations}
        onCreateNew={handleCreateNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onQuickCopy={handleQuickCopy}
        onRefresh={onConfigChange}
      />

      {/* Trim Level Grid */}
      <TrimLevelGrid
        configurations={configurations}
        selectedConfig={selectedConfig}
        onConfigSelect={onConfigSelect}
        onEdit={handleEdit}
        onCopy={handleCopy}
        onPreview={handlePreview}
        onAdd={handleCreateNew}
        onClone={handleClone}
        onDelete={handleDelete}
        onCreateNew={handleCreateNew}
      />

      {/* Selected Trim Level Details */}
      {selectedConfigData && (
        <TrimLevelDetails
          selectedConfigData={selectedConfigData}
          onConfigChange={onConfigChange}
        />
      )}

      {/* Enhanced Copy Dialog */}
      {copyDialogOpen && copyingConfig && (
        <EnhancedCopyTrimLevelDialog
          open={copyDialogOpen}
          onClose={() => {
            setCopyDialogOpen(false);
            setCopyingConfig(null);
          }}
          sourceConfiguration={copyingConfig}
          availableYears={availableYears}
          onSuccess={() => {
            onConfigChange();
            setCopyDialogOpen(false);
            setCopyingConfig(null);
          }}
        />
      )}

      {/* Enhanced Delete Dialog */}
      {deleteDialogOpen && deletingConfig && (
        <EnhancedDeleteTrimDialog
          open={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setDeletingConfig(null);
          }}
          configuration={deletingConfig}
          onSuccess={handleDeleteSuccess}
        />
      )}

      {/* Quick Copy Dialog */}
      {quickCopyOpen && selectedConfigData && (
        <QuickCopyDialog
          open={quickCopyOpen}
          onClose={() => setQuickCopyOpen(false)}
          targetConfiguration={selectedConfigData}
          availableConfigurations={configurations}
          defaultCopyType={quickCopyType}
          onSuccess={() => {
            onConfigChange();
            setQuickCopyOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default TrimLevelManagerEnhanced;
