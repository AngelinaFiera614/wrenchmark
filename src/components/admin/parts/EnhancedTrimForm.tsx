import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Save, X, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { Configuration, ModelYear } from "@/types/motorcycle";
import { useEnhancedTrimForm } from "./enhanced-trim-form/useEnhancedTrimForm";
import BasicInfoSection from "./enhanced-trim-form/BasicInfoSection";
import ComponentOverridesSection from "./enhanced-trim-form/ComponentOverridesSection";
import ColorManagementSection from "./enhanced-trim-form/ColorManagementSection";
import ValidationSummary from "./enhanced-trim-form/ValidationSummary";
import CompletenessTracker from "./enhanced-trim-form/CompletenessTracker";

interface EnhancedTrimFormProps {
  modelYears: ModelYear[];
  configuration?: Configuration;
  onSave: (config: Configuration) => void;
  onCancel: () => void;
  className?: string;
}

const EnhancedTrimForm = ({
  modelYears,
  configuration,
  onSave,
  onCancel,
  className = ""
}: EnhancedTrimFormProps) => {
  const [activeTab, setActiveTab] = useState("basic");
  
  const {
    formData,
    componentOverrides,
    selectedColors,
    validation,
    completeness,
    saving,
    handleInputChange,
    handleComponentOverride,
    handleColorSelection,
    handleSave,
    resetForm
  } = useEnhancedTrimForm(modelYears, configuration, onSave);

  const getTabStatus = (tabId: string) => {
    const errors = validation.errors.filter(error => error.section === tabId);
    if (errors.length > 0) return "error";
    
    const sectionCompleteness = completeness.sections[tabId];
    if (sectionCompleteness >= 80) return "complete";
    if (sectionCompleteness >= 30) return "partial";
    return "empty";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete": return <CheckCircle className="h-4 w-4 text-accent-teal" />;
      case "partial": return <Clock className="h-4 w-4 text-amber-500" />;
      case "error": return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default: return null;
    }
  };

  const isFormValid = validation.isValid;
  const overallCompleteness = completeness.overall;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-explorer-text">
            {configuration ? "Edit Trim Configuration" : "Create New Trim Configuration"}
          </h2>
          <p className="text-explorer-text/70 mt-1">
            Configure components, colors, and specifications across model years
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <CompletenessTracker 
            completeness={completeness} 
            className="mr-4" 
          />
          <Button
            variant="ghost"
            onClick={onCancel}
            disabled={saving}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isFormValid || saving}
            className="bg-accent-teal text-black hover:bg-accent-teal/90"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Configuration"}
          </Button>
        </div>
      </div>

      {/* Validation Summary */}
      {validation.errors.length > 0 && (
        <ValidationSummary validation={validation} />
      )}

      {/* Main Form */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-explorer-dark border-explorer-chrome/30">
              <TabsTrigger 
                value="basic" 
                className="data-[state=active]:bg-accent-teal data-[state=active]:text-black flex items-center gap-2"
              >
                {getStatusIcon(getTabStatus("basic"))}
                Basic Info
              </TabsTrigger>
              <TabsTrigger 
                value="components" 
                className="data-[state=active]:bg-accent-teal data-[state=active]:text-black flex items-center gap-2"
              >
                {getStatusIcon(getTabStatus("components"))}
                Component Overrides
              </TabsTrigger>
              <TabsTrigger 
                value="colors" 
                className="data-[state=active]:bg-accent-teal data-[state=active]:text-black flex items-center gap-2"
              >
                {getStatusIcon(getTabStatus("colors"))}
                Color Management
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="basic" className="m-0">
                <BasicInfoSection
                  formData={formData}
                  modelYears={modelYears}
                  validation={validation}
                  onInputChange={handleInputChange}
                />
              </TabsContent>

              <TabsContent value="components" className="m-0">
                <ComponentOverridesSection
                  formData={formData}
                  modelYears={modelYears}
                  componentOverrides={componentOverrides}
                  validation={validation}
                  onComponentOverride={handleComponentOverride}
                />
              </TabsContent>

              <TabsContent value="colors" className="m-0">
                <ColorManagementSection
                  formData={formData}
                  modelYears={modelYears}
                  selectedColors={selectedColors}
                  validation={validation}
                  onColorSelection={handleColorSelection}
                />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Debug Info - Development Only */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="bg-explorer-dark border-explorer-chrome/30">
          <CardHeader>
            <CardTitle className="text-sm text-explorer-text/70">Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <strong>Form Data:</strong>
                <pre className="mt-1 text-explorer-text/60 overflow-auto max-h-32">
                  {JSON.stringify(formData, null, 2)}
                </pre>
              </div>
              <div>
                <strong>Validation:</strong>
                <pre className="mt-1 text-explorer-text/60 overflow-auto max-h-32">
                  {JSON.stringify(validation, null, 2)}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedTrimForm;