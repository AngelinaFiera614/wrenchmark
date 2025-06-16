
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Database, 
  Settings, 
  BarChart3,
  RefreshCw,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ModelSelectionPanel from "./consolidated/ModelSelectionPanel";
import YearManagementPanel from "./consolidated/YearManagementPanel";
import TrimManagementPanel from "./consolidated/TrimManagementPanel";
import ComponentManagementPanel from "./consolidated/ComponentManagementPanel";
import ColorManagementPanel from "./consolidated/ColorManagementPanel";
import AnalyticsPanel from "./consolidated/AnalyticsPanel";
import { useConsolidatedAdminState } from "@/hooks/admin/useConsolidatedAdminState";

const ConsolidatedAdminPartsLayout = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("management");
  
  const {
    selectedModel,
    selectedYear,
    selectedConfig,
    models,
    modelYears,
    configurations,
    selectedModelData,
    selectedYearData,
    selectedConfigData,
    modelsLoading,
    yearsLoading,
    configsLoading,
    handleModelSelect,
    handleYearSelect,
    handleConfigSelect,
    refreshData
  } = useConsolidatedAdminState();

  const getCompleteness = () => {
    if (!configurations.length) return { percentage: 0, issues: [] };
    
    const completeConfigs = configurations.filter(config => 
      config.engine_id && config.brake_system_id && config.frame_id
    ).length;
    
    const percentage = Math.round((completeConfigs / configurations.length) * 100);
    const issues = [];
    
    if (completeConfigs < configurations.length) {
      issues.push(`${configurations.length - completeConfigs} configurations missing components`);
    }
    
    return { percentage, issues };
  };

  const completeness = getCompleteness();
  const isLoading = modelsLoading || yearsLoading || configsLoading;

  return (
    <div className="min-h-screen bg-explorer-dark">
      {/* Header */}
      <div className="bg-explorer-card border-b border-explorer-chrome/30 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-explorer-text">Parts & Configurations</h1>
            <p className="text-explorer-text-muted">Manage motorcycle models, years, trims, and components</p>
          </div>
          
          <div className="flex items-center gap-4">
            {selectedModel && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-explorer-text-muted">Completeness:</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-explorer-chrome/30 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${
                        completeness.percentage >= 80 ? 'bg-green-400' :
                        completeness.percentage >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${completeness.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-explorer-text">
                    {completeness.percentage}%
                  </span>
                </div>
              </div>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={refreshData}
              disabled={isLoading}
              className="border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="management" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Management
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="bulk" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Bulk Ops
            </TabsTrigger>
          </TabsList>

          <TabsContent value="management" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              {/* Model Selection - 3 columns */}
              <div className="xl:col-span-3">
                <ModelSelectionPanel
                  models={models}
                  selectedModel={selectedModel}
                  onModelSelect={handleModelSelect}
                  loading={modelsLoading}
                />
              </div>
              
              {/* Year Management - 3 columns */}
              <div className="xl:col-span-3">
                {selectedModel && (
                  <YearManagementPanel
                    modelYears={modelYears}
                    selectedYear={selectedYear}
                    selectedModelData={selectedModelData}
                    onYearSelect={handleYearSelect}
                    loading={yearsLoading}
                  />
                )}
              </div>
              
              {/* Trim Management - 3 columns */}
              <div className="xl:col-span-3">
                {selectedYear && (
                  <TrimManagementPanel
                    configurations={configurations}
                    selectedConfig={selectedConfig}
                    selectedYearData={selectedYearData}
                    onConfigSelect={handleConfigSelect}
                    loading={configsLoading}
                  />
                )}
              </div>
              
              {/* Component & Color Management - 3 columns */}
              <div className="xl:col-span-3 space-y-6">
                {selectedConfig && (
                  <>
                    <ComponentManagementPanel
                      selectedConfigData={selectedConfigData}
                      onRefresh={refreshData}
                    />
                    <ColorManagementPanel
                      selectedConfigData={selectedConfigData}
                      onRefresh={refreshData}
                    />
                  </>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <AnalyticsPanel
              models={models}
              configurations={configurations}
              completeness={completeness}
            />
          </TabsContent>

          <TabsContent value="bulk" className="mt-6">
            <Card className="bg-explorer-card border-explorer-chrome/30">
              <CardHeader>
                <CardTitle className="text-explorer-text">Bulk Operations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Database className="h-12 w-12 text-explorer-text-muted mx-auto mb-4" />
                  <p className="text-explorer-text-muted">
                    Bulk operations will be available once configurations are selected
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ConsolidatedAdminPartsLayout;
