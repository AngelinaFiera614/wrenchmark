
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, AlertCircle } from "lucide-react";
import { Configuration } from "@/types/motorcycle";
import { deleteConfiguration } from "@/services/models/configurationService";
import { getAvailableTargetYears } from "@/services/models/configurationCopy";
import { supabase } from "@/integrations/supabase/client";
import TrimLevelEditor from "./TrimLevelEditor";
import TrimLevelActions from "./trim-level/TrimLevelActions";
import TrimLevelGrid from "./trim-level/TrimLevelGrid";
import TrimLevelDetails from "./trim-level/TrimLevelDetails";
import CopyTrimLevelDialog from "./CopyTrimLevelDialog";

interface TrimLevelManagerProps {
  modelYearId: string;
  configurations: Configuration[];
  selectedConfig: string | null;
  onConfigSelect: (configId: string) => void;
  onConfigChange: () => void;
}

const TrimLevelManager = ({
  modelYearId,
  configurations,
  selectedConfig,
  onConfigSelect,
  onConfigChange
}: TrimLevelManagerProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editingConfig, setEditingConfig] = useState<Configuration | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copyDialogOpen, setCopyDialogOpen] = useState(false);
  const [copyingConfig, setCopyingConfig] = useState<Configuration | null>(null);
  const [availableYears, setAvailableYears] = useState<any[]>([]);

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
        const years = await getAvailableTargetYears(modelYear.motorcycle_id);
        setAvailableYears(years.filter(y => y.id !== modelYearId)); // Exclude current year
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

  const handleDelete = async (config: Configuration) => {
    if (!confirm(`Are you sure you want to delete the "${config.name}" trim level? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(config.id);
    
    try {
      console.log("Deleting trim level:", config.id);
      const success = await deleteConfiguration(config.id);
      
      if (success) {
        toast({
          title: "Success!",
          description: `Trim level "${config.name}" has been deleted successfully.`,
          action: <CheckCircle className="h-4 w-4 text-green-500" />
        });
        
        // If the deleted config was selected, clear selection
        if (selectedConfig === config.id) {
          onConfigSelect('');
        }
        
        onConfigChange();
      }
    } catch (error: any) {
      console.error("Error deleting trim level:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete trim level: ${error.message}`,
        action: <AlertCircle className="h-4 w-4 text-red-500" />
      });
    } finally {
      setDeletingId(null);
    }
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
      <TrimLevelEditor
        modelYearId={modelYearId}
        configuration={editingConfig || undefined}
        onSave={handleSaveSuccess}
        onCancel={() => handleEditorClose(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Trim Level Actions */}
      <TrimLevelActions 
        onCreateNew={handleCreateNew}
        onRefresh={onConfigChange}
      />

      {/* Trim Level Grid */}
      <TrimLevelGrid
        configurations={configurations}
        selectedConfig={selectedConfig}
        deletingId={deletingId}
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

      {/* Copy Dialog */}
      {copyDialogOpen && copyingConfig && (
        <CopyTrimLevelDialog
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
    </div>
  );
};

export default TrimLevelManager;
