
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Save, 
  X, 
  AlertCircle
} from "lucide-react";
import { useConfigurationForm } from "./hooks/useConfigurationForm";
import ConfigurationFormTabs from "./ConfigurationFormTabs";

interface EnhancedConfigurationFormProps {
  open: boolean;
  onClose: () => void;
  selectedYearData?: any;
  configurationToEdit?: any;
  onSuccess: () => void;
}

const EnhancedConfigurationForm: React.FC<EnhancedConfigurationFormProps> = ({
  open,
  onClose,
  selectedYearData,
  configurationToEdit,
  onSuccess
}) => {
  const [activeTab, setActiveTab] = useState("basic");

  const {
    formData,
    errors,
    saving,
    handleInputChange,
    handleArrayChange,
    handleSave
  } = useConfigurationForm(selectedYearData, configurationToEdit, () => {
    onSuccess();
    onClose();
  });

  const getCompletionBadge = () => {
    const fieldsCompleted = [
      formData.name,
      formData.seat_height_mm,
      formData.weight_kg,
      formData.msrp_usd
    ].filter(Boolean).length;
    
    const totalFields = 4;
    const percentage = Math.round((fieldsCompleted / totalFields) * 100);
    
    return (
      <Badge variant={percentage >= 75 ? "default" : "secondary"} className="ml-2">
        {percentage}% Complete
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-explorer-card border-explorer-chrome/30">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-explorer-text flex items-center">
                {configurationToEdit ? 'Edit Configuration' : 'Create New Configuration'}
                {getCompletionBadge()}
              </DialogTitle>
              <p className="text-sm text-explorer-text-muted mt-1">
                {configurationToEdit 
                  ? `Editing: ${configurationToEdit.name}`
                  : selectedYearData 
                    ? `Creating for ${selectedYearData.year} ${selectedYearData.motorcycle?.name}`
                    : "No model year selected"
                }
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={onClose}
                variant="outline"
                className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving || !!errors.general}
                className="bg-accent-teal text-black hover:bg-accent-teal/80"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : configurationToEdit ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </DialogHeader>

        {errors.general && (
          <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <span className="text-red-400 text-sm">{errors.general}</span>
          </div>
        )}

        <ConfigurationFormTabs
          formData={formData}
          errors={errors}
          onInputChange={handleInputChange}
          onArrayChange={handleArrayChange}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedConfigurationForm;
