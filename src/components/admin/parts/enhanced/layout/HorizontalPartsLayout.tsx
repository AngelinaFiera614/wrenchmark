import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Settings, ChevronDown, ChevronRight, Users, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { generateModelYears } from "@/services/models/modelYearService";
import { assignTrimToYears } from "@/services/trimAssignmentService";
import EnhancedContextSidebar from "./EnhancedContextSidebar";
import SimpleComponentsManager from "../SimpleComponentsManager";
import HorizontalTrimManager from "../HorizontalTrimManager";
import TrimLevelCard from "../../trim-level/TrimLevelCard";
import { useAdminPartsLayoutState } from "./useAdminPartsLayoutState";

const HorizontalPartsLayout = () => {
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [editingConfig, setEditingConfig] = useState<any>(null);
  const [generatingYears, setGeneratingYears] = useState(false);
  const [selectedYears, setSelectedYears] = useState<Set<string>>(new Set());
  const [selectedTrims, setSelectedTrims] = useState<Set<string>>(new Set());
  const [assigningTrims, setAssigningTrims] = useState(false);
  
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

  const handleAssignTrimsToYears = async () => {
    if (selectedTrims.size === 0 || selectedYears.size === 0) {
      toast({
        variant: "destructive",
        title: "Selection Required",
        description: "Please select both trims and years to assign."
      });
      return;
    }

    setAssigningTrims(true);
    
    try {
      const trimIds = Array.from(selectedTrims);
      const yearIds = Array.from(selectedYears);
      
      console.log("Assigning trims to years:", { trimIds, yearIds });
      
      let totalCreated = 0;
      let errors = [];

      for (const trimId of trimIds) {
        const result = await assignTrimToYears(trimId, yearIds);
        
        if (result.success) {
          totalCreated += result.createdConfigurations?.length || 0;
        } else {
          errors.push(result.error);
        }
      }

      if (errors.length > 0) {
        toast({
          variant: "destructive",
          title: "Partial Success",
          description: `Created ${totalCreated} configurations, but encountered errors: ${errors.join(', ')}`
        });
      } else {
        toast({
          title: "Success!",
          description: `Created ${totalCreated} trim configurations across selected years.`
        });
      }

      // Clear selections and refresh data
      setSelectedTrims(new Set());
      setSelectedYears(new Set());
      
      if (adminData.refreshConfigurations) {
        await adminData.refreshConfigurations();
      }
    } catch (error: any) {
      console.error("Error assigning trims to years:", error);
      toast({
        variant: "destructive",
        title: "Assignment Failed",
        description: `Failed to assign trims: ${error.message}`
      });
    } finally {
      setAssigningTrims(false);
    }
  };

  const toggleYearSelection = (yearId: string) => {
    const newSelected = new Set(selectedYears);
    if (newSelected.has(yearId)) {
      newSelected.delete(yearId);
    } else {
      newSelected.add(yearId);
    }
    setSelectedYears(newSelected);
  };

  const toggleTrimSelection = (trimId: string) => {
    const newSelected = new Set(selectedTrims);
    if (newSelected.has(trimId)) {
      newSelected.delete(trimId);
    } else {
      newSelected.add(trimId);
    }
    setSelectedTrims(newSelected);
  };

  const getAllTrims = () => {
    if (!adminData.modelYears || !adminData.configurations) return [];
    
    const allTrims = adminData.configurations.filter(config => {
      return adminData.modelYears.some(year => year.id === config.model_year_id);
    });
    
    return allTrims;
  };

  const getTrimsForYear = (yearId: string) => {
    if (!adminData.configurations) return [];
    return adminData.configurations.filter(config => config.model_year_id === yearId);
  };

  const getYearsForTrim = (trimId: string) => {
    const trim = adminData.configurations?.find(c => c.id === trimId);
    if (!trim) return [];
    
    const year = adminData.modelYears?.find(y => y.id === trim.model_year_id);
    return year ? [year] : [];
  };

  if (isCreatingNew) {
    return (
      <div className="space-y-6">
        <HorizontalTrimManager
          modelYearIds={Array.from(selectedYears)}
          configuration={editingConfig}
          onSave={handleSaveConfig}
          onCancel={handleCancelEdit}
        />
      </div>
    );
  }

  const allTrims = getAllTrims();

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
      {/* Enhanced Sidebar with Pinned Models */}
      <div className="xl:col-span-1">
        <EnhancedContextSidebar
          selectedModel={selectedModel}
          selectedYear={selectedYear}
          selectedConfig={selectedConfig}
          selectedModelData={adminData.selectedModelData}
          selectedYearData={adminData.selectedYearData}
          selectedConfigData={adminData.selectedConfigData}
          models={adminData.models || []}
          modelYears={adminData.modelYears || []}
          configurations={adminData.configurations || []}
          onModelSelect={adminData.handleModelSelect}
          onYearSelect={adminData.handleYearSelect}
          onConfigSelect={adminData.handleConfigSelect}
        />
      </div>

      {/* Main Content Area */}
      <div className="xl:col-span-3 space-y-6">
        {/* Header */}
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader>
            <CardTitle className="text-explorer-text">Parts & Components Management</CardTitle>
            <p className="text-explorer-text-muted">
              Select a model, choose years and trim levels, then assign components. Trims can be assigned to multiple years.
            </p>
          </CardHeader>
        </Card>

        {/* Assignment Actions */}
        {selectedTrims.size > 0 && selectedYears.size > 0 && (
          <Card className="bg-accent-teal/10 border-accent-teal/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-explorer-text font-medium">
                    Ready to Assign {selectedTrims.size} trim{selectedTrims.size > 1 ? 's' : ''} to {selectedYears.size} year{selectedYears.size > 1 ? 's' : ''}
                  </h3>
                  <p className="text-sm text-explorer-text-muted">
                    This will create new trim configurations for the selected years.
                  </p>
                </div>
                <Button
                  onClick={handleAssignTrimsToYears}
                  disabled={assigningTrims}
                  className="bg-accent-teal text-black hover:bg-accent-teal/80"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  {assigningTrims ? "Assigning..." : "Assign Trims"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Years Section */}
        {selectedModel && (
          <Card className="bg-explorer-card border-explorer-chrome/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-explorer-text flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Model Years ({adminData.modelYears?.length || 0})
                </CardTitle>
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
                  {selectedYears.size > 0 && (
                    <Button
                      onClick={handleCreateNew}
                      className="bg-accent-teal text-black hover:bg-accent-teal/80"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      New Trim for {selectedYears.size} Year{selectedYears.size > 1 ? 's' : ''}
                    </Button>
                  )}
                </div>
              </div>
              {selectedYears.size > 0 && (
                <p className="text-sm text-accent-teal">
                  {selectedYears.size} year{selectedYears.size > 1 ? 's' : ''} selected
                </p>
              )}
            </CardHeader>
            <CardContent>
              {!adminData.modelYears || adminData.modelYears.length === 0 ? (
                <div className="text-center py-8 text-explorer-text-muted">
                  No model years found. Generate years for this model to get started.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {adminData.modelYears.map((year) => {
                    const yearTrims = getTrimsForYear(year.id);
                    const isSelected = selectedYears.has(year.id);

                    return (
                      <Card 
                        key={year.id} 
                        className={`cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-accent-teal/20 border-accent-teal' 
                            : 'bg-explorer-dark border-explorer-chrome/30 hover:border-accent-teal/50'
                        }`}
                        onClick={() => toggleYearSelection(year.id)}
                      >
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h3 className="font-bold text-explorer-text">{year.year}</h3>
                              <Badge variant="outline" className="text-xs">
                                {yearTrims.length} trim{yearTrims.length !== 1 ? 's' : ''}
                              </Badge>
                            </div>
                            {year.changes && (
                              <p className="text-xs text-explorer-text-muted line-clamp-2">
                                {year.changes}
                              </p>
                            )}
                            {isSelected && (
                              <div className="text-xs text-accent-teal font-medium">
                                ✓ Selected
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Trims Section */}
        {selectedModel && allTrims.length > 0 && (
          <Card className="bg-explorer-card border-explorer-chrome/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-explorer-text flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Trim Levels ({allTrims.length})
                </CardTitle>
                <Button
                  onClick={handleCreateNew}
                  className="bg-accent-teal text-black hover:bg-accent-teal/80"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Trim Level
                </Button>
              </div>
              {selectedTrims.size > 0 && (
                <p className="text-sm text-accent-teal">
                  {selectedTrims.size} trim{selectedTrims.size > 1 ? 's' : ''} selected
                </p>
              )}
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allTrims.map((trim) => {
                  const trimYears = getYearsForTrim(trim.id);
                  const isSelected = selectedTrims.has(trim.id);

                  return (
                    <div key={trim.id} className="space-y-2">
                      <TrimLevelCard
                        config={trim}
                        isSelected={isSelected || selectedConfig === trim.id}
                        isDeleting={false}
                        onClick={() => {
                          toggleTrimSelection(trim.id);
                          adminData.handleConfigSelect(trim.id);
                        }}
                        onEdit={() => handleEditConfig(trim)}
                        onClone={() => {
                          // Handle clone
                        }}
                        onDelete={() => {
                          // Handle delete
                        }}
                        onCopy={() => {
                          // Handle copy
                        }}
                      />
                      <div className="text-xs text-explorer-text-muted px-2">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>
                            Assigned to: {trimYears.map(y => y.year).join(', ') || 'No years'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
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
