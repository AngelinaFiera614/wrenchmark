
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Database, CheckCircle, AlertTriangle } from "lucide-react";
import AdminPartsLayoutSidebar from "./layout/AdminPartsLayoutSidebar";
import SimpleComponentsManager from "./SimpleComponentsManager";
import HorizontalTrimManager from "./HorizontalTrimManager";
import { useAdminPartsLayoutState } from "./layout/useAdminPartsLayoutState";

const SimplifiedAdminPartsLayout = () => {
  const [activeTab, setActiveTab] = useState("components");
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [editingConfig, setEditingConfig] = useState<any>(null);

  const layoutState = useAdminPartsLayoutState();
  const { adminData } = layoutState;

  const selectedModel = adminData?.selectedModel || null;
  const selectedYear = adminData?.selectedYear || null;
  const selectedConfig = adminData?.selectedConfig || null;

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
    // Handle saving configuration
    setIsCreatingNew(false);
    setEditingConfig(null);
    handleComponentLinked();
  };

  const handleCancelEdit = () => {
    setIsCreatingNew(false);
    setEditingConfig(null);
  };

  // Check completeness
  const getModelCompleteness = () => {
    if (!selectedModel || !adminData.configurations) return { percentage: 0, issues: [] };
    
    const configs = adminData.configurations;
    const totalConfigs = configs.length;
    const completeConfigs = configs.filter((config: any) => 
      config.engine_id && config.brake_system_id && config.frame_id
    ).length;
    
    const percentage = totalConfigs > 0 ? Math.round((completeConfigs / totalConfigs) * 100) : 0;
    const issues = [];
    
    if (completeConfigs < totalConfigs) {
      issues.push(`${totalConfigs - completeConfigs} configurations missing required components`);
    }
    
    return { percentage, issues };
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

  const completeness = getModelCompleteness();

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-explorer-text">Parts & Components Management</CardTitle>
              <p className="text-explorer-text-muted">
                Simplified component management for motorcycle models and configurations
              </p>
            </div>
            
            {selectedModel && (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm font-medium text-explorer-text">Model Completeness</div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={completeness.percentage >= 80 ? 'text-green-400 border-green-400/30' : 'text-yellow-400 border-yellow-400/30'}
                    >
                      {completeness.percentage >= 80 ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <AlertTriangle className="h-3 w-3 mr-1" />
                      )}
                      {completeness.percentage}% Complete
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Sidebar */}
        <AdminPartsLayoutSidebar
          selectedModel={selectedModel}
          selectedYear={selectedYear}
          selectedConfig={selectedConfig}
          selectedModelData={adminData.selectedModelData}
          selectedYearData={adminData.selectedYearData}
          selectedConfigData={adminData.selectedConfigData}
          models={adminData.models}
          modelYears={adminData.modelYears}
          configurations={adminData.configurations}
          onModelSelect={adminData.handleModelSelect}
          onYearSelect={adminData.handleYearSelect}
          onConfigSelect={adminData.handleConfigSelect}
        />

        {/* Main Content */}
        <div className="xl:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="components" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Components
              </TabsTrigger>
              <TabsTrigger value="configurations" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Configurations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="components" className="space-y-6">
              <SimpleComponentsManager
                selectedModel={adminData.selectedModelData}
                selectedConfiguration={adminData.selectedConfigData}
                onComponentLinked={handleComponentLinked}
              />
            </TabsContent>

            <TabsContent value="configurations" className="space-y-6">
              <Card className="bg-explorer-card border-explorer-chrome/30">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-explorer-text">Model Configurations</CardTitle>
                    {selectedModel && (
                      <Button
                        onClick={handleCreateNew}
                        className="bg-accent-teal text-black hover:bg-accent-teal/80"
                      >
                        Create New Configuration
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {!selectedModel ? (
                    <div className="text-center py-8 text-explorer-text-muted">
                      Select a model from the sidebar to manage its configurations
                    </div>
                  ) : !adminData.configurations || adminData.configurations.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-explorer-text-muted mb-4">
                        No configurations found for this model
                      </div>
                      <Button
                        onClick={handleCreateNew}
                        className="bg-accent-teal text-black hover:bg-accent-teal/80"
                      >
                        Create First Configuration
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {adminData.configurations.map((config: any) => (
                        <Card key={config.id} className="bg-explorer-dark border-explorer-chrome/30">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-medium text-explorer-text">
                                  {config.name || "Standard"}
                                </h3>
                                <div className="text-sm text-explorer-text-muted">
                                  {config.trim_level && `${config.trim_level} • `}
                                  {config.market_region || 'Global Market'}
                                </div>
                              </div>
                              {config.is_default && (
                                <Badge variant="outline" className="text-xs">Default</Badge>
                              )}
                            </div>
                            
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-explorer-text-muted">Engine:</span>
                                <span className="text-explorer-text">
                                  {config.engine?.name || config.engines?.name || 'Not set'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-explorer-text-muted">Brakes:</span>
                                <span className="text-explorer-text">
                                  {config.brakes?.type || config.brake_systems?.type || 'Not set'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-explorer-text-muted">Frame:</span>
                                <span className="text-explorer-text">
                                  {config.frame?.type || config.frames?.type || 'Not set'}
                                </span>
                              </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-explorer-chrome/30">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditConfig(config)}
                                className="w-full border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
                              >
                                Edit Configuration
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SimplifiedAdminPartsLayout;
