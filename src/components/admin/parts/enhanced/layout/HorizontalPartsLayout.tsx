
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Settings, ChevronDown, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { generateModelYears } from "@/services/models/modelYearService";
import ModelsColumn from "../../hierarchy/ModelsColumn";
import SimpleComponentsManager from "../SimpleComponentsManager";
import HorizontalTrimManager from "../HorizontalTrimManager";
import TrimLevelCard from "../trim-level/TrimLevelCard";
import { useAdminPartsLayoutState } from "./useAdminPartsLayoutState";

const HorizontalPartsLayout = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [editingConfig, setEditingConfig] = useState<any>(null);
  const [generatingYears, setGeneratingYears] = useState(false);
  const [expandedYears, setExpandedYears] = useState<Set<string>>(new Set());
  
  const { toast } = useToast();
  const layoutState = useAdminPartsLayoutState();
  const { adminData } = layoutState;

  const selectedModel = adminData?.selectedModel || null;
  const selectedYear = adminData?.selectedYear || null;
  const selectedConfig = adminData?.selectedConfig || null;

  const handleGenerateModelYears = async () => {
    if (!selectedModel || !adminData.selectedModelData) return;
    
    setGeneratingYears(true);
    try {
      console.log("Generating model years for model:", adminData.selectedModelData.name);
      await generateModelYears(selectedModel);
      
      toast({
        title: "Success!",
        description: "Model years generated successfully."
      });
      
      if (adminData.refreshConfigurations) {
        await adminData.refreshConfigurations();
      }
    } catch (error: any) {
      console.error("Error generating model years:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to generate model years: ${error.message}`
      });
    } finally {
      setGeneratingYears(false);
    }
  };

  const handleComponentLinked = () => {
    if (adminData.refreshConfigurations) {
      adminData.refreshConfigurations([selectedYear].filter(Boolean));
    }
  };

  const handleCreateNew = () => {
    setIsCreatingNew(true);
    setEditingConfig(null);
  };

  const handleEditConfig = (config: any) => {
    setIsCreatingNew(true);
    setEditingConfig(config);
  };

  const handleSaveConfig = async (configData: any) => {
    setIsCreatingNew(false);
    setEditingConfig(null);
    handleComponentLinked();
  };

  const handleCancelEdit = () => {
    setIsCreatingNew(false);
    setEditingConfig(null);
  };

  const toggleYearExpanded = (yearId: string) => {
    const newExpanded = new Set(expandedYears);
    if (newExpanded.has(yearId)) {
      newExpanded.delete(yearId);
    } else {
      newExpanded.add(yearId);
    }
    setExpandedYears(newExpanded);
  };

  const groupConfigurationsByYear = () => {
    if (!adminData.modelYears || !adminData.configurations) return {};
    
    const grouped: { [yearId: string]: any[] } = {};
    
    adminData.modelYears.forEach(year => {
      grouped[year.id] = adminData.configurations.filter(
        config => config.model_year_id === year.id
      );
    });
    
    return grouped;
  };

  if (isCreatingNew) {
    return (
      <div className="space-y-6">
        <HorizontalTrimManager
          modelYearIds={selectedYear ? [selectedYear] : []}
          configuration={editingConfig}
          onSave={handleSaveConfig}
          onCancel={handleCancelEdit}
        />
      </div>
    );
  }

  const configsByYear = groupConfigurationsByYear();

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
      {/* Models Sidebar */}
      <div className="xl:col-span-1">
        <ModelsColumn
          models={adminData.models || []}
          selectedModel={selectedModel}
          onModelSelect={adminData.handleModelSelect}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* Main Content Area */}
      <div className="xl:col-span-3 space-y-6">
        {/* Header */}
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader>
            <CardTitle className="text-explorer-text">Parts & Components Management</CardTitle>
            <p className="text-explorer-text-muted">
              Select a model, then manage years and trim levels with their component assignments
            </p>
          </CardHeader>
        </Card>

        {/* Years and Trim Levels Section */}
        {selectedModel && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-explorer-text">
                Model Years & Trim Levels
              </h2>
              <div className="flex gap-2">
                <Button
                  onClick={handleGenerateModelYears}
                  disabled={generatingYears}
                  variant="outline"
                  className="border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  {generatingYears ? "Generating..." : "Generate Years"}
                </Button>
                <Button
                  onClick={handleCreateNew}
                  className="bg-accent-teal text-black hover:bg-accent-teal/80"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Trim Level
                </Button>
              </div>
            </div>

            {!adminData.modelYears || adminData.modelYears.length === 0 ? (
              <Card className="bg-explorer-card border-explorer-chrome/30">
                <CardContent className="p-8 text-center">
                  <div className="text-explorer-text-muted">
                    No model years found. Generate years for this model to get started.
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {adminData.modelYears.map((year) => {
                  const yearConfigs = configsByYear[year.id] || [];
                  const isExpanded = expandedYears.has(year.id);

                  return (
                    <Card key={year.id} className="bg-explorer-card border-explorer-chrome/30">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => toggleYearExpanded(year.id)}
                            className="flex items-center gap-2 text-left hover:text-accent-teal transition-colors"
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                            <CardTitle className="text-explorer-text">
                              {year.year}
                            </CardTitle>
                            <Badge variant="outline" className="ml-2">
                              {yearConfigs.length} {yearConfigs.length === 1 ? 'trim' : 'trims'}
                            </Badge>
                          </button>
                          <Button
                            onClick={() => {
                              adminData.handleYearSelect(year.id);
                              handleCreateNew();
                            }}
                            size="sm"
                            variant="outline"
                            className="border-accent-teal/30 text-accent-teal hover:bg-accent-teal/10"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Trim
                          </Button>
                        </div>
                        {year.changes && (
                          <p className="text-sm text-explorer-text-muted">{year.changes}</p>
                        )}
                      </CardHeader>

                      {isExpanded && (
                        <CardContent>
                          {yearConfigs.length === 0 ? (
                            <div className="text-center py-8 text-explorer-text-muted">
                              No trim levels for this year. Click "Add Trim" to create one.
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {yearConfigs.map((config) => (
                                <TrimLevelCard
                                  key={config.id}
                                  configuration={config}
                                  onEdit={() => handleEditConfig(config)}
                                  onDelete={() => {
                                    // Handle delete
                                  }}
                                  onCopy={() => {
                                    // Handle copy
                                  }}
                                />
                              ))}
                            </div>
                          )}
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Component Library */}
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader>
            <CardTitle className="text-explorer-text flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Component Library
            </CardTitle>
            <p className="text-explorer-text-muted">
              Assign components as model defaults or trim-specific overrides
            </p>
          </CardHeader>
          <CardContent>
            {!selectedModel ? (
              <div className="text-center py-8 text-explorer-text-muted">
                Select a model from the sidebar to assign components
              </div>
            ) : (
              <SimpleComponentsManager
                selectedModel={adminData.selectedModelData}
                selectedConfiguration={adminData.selectedConfigData}
                onComponentLinked={handleComponentLinked}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HorizontalPartsLayout;
