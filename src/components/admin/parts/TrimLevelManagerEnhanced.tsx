
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, AlertCircle } from "lucide-react";
import { Configuration } from "@/types/motorcycle";
import { deleteConfiguration, getAvailableTargetYears } from "@/services/models/configurationService";
import { supabase } from "@/integrations/supabase/client";
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
  activeSectionTab?: string;
  validation?: any;
  onEditConfig?: (config: Configuration) => void;
}

const TrimLevelManagerEnhanced = ({
  modelYearId,
  configurations,
  selectedConfig,
  onConfigSelect,
  onConfigChange,
  activeSectionTab,
  validation,
  onEditConfig
}: TrimLevelManagerEnhancedProps) => {
  const { toast } = useToast();
  const [copyDialogOpen, setCopyDialogOpen] = useState(false);
  const [copyingConfig, setCopyingConfig] = useState<Configuration | null>(null);
  const [availableYears, setAvailableYears] = useState<any[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingConfig, setDeletingConfig] = useState<Configuration | null>(null);
  const [quickCopyOpen, setQuickCopyOpen] = useState(false);
  const [quickCopyType, setQuickCopyType] = useState<'components' | 'dimensions' | 'colors' | 'all'>('all');

  const selectedConfigData = configurations.find(c => c.id === selectedConfig);

  const handleEdit = (config: Configuration) => {
    console.log("Editing trim level:", config);
    if (onEditConfig) {
      onEditConfig(config);
    }
  };

  const handleClone = (config: Configuration) => {
    console.log("Cloning trim level:", config);
    const clonedConfig = {
      ...config,
      name: `${config.name} (Copy)`,
      is_default: false
    } as Configuration;
    if (onEditConfig) {
      onEditConfig(clonedConfig);
    }
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

  // Show message when no model year is selected
  if (!modelYearId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-2">
          <div className="text-lg text-explorer-text">Select a Model and Year</div>
          <div className="text-sm text-explorer-text-muted">
            Choose a motorcycle model and year from the sidebar to manage trim levels
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Trim Level Actions */}
      <EnhancedTrimLevelActions
        selectedConfig={selectedConfigData}
        configurations={configurations}
        onCreateNew={() => {}} // Handled by parent component
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
        onAdd={() => {}} // Handled by parent component
        onClone={handleClone}
        onDelete={handleDelete}
        onCreateNew={() => {}} // Handled by parent component
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
