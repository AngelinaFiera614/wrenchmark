
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
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
import { useConsolidatedAdminState } from "@/hooks/admin/useConsolidatedAdminState";

const ConsolidatedAdminPartsLayout = () => {
  const { toast } = useToast();
  
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
    modelsError,
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
    <div className="space-y-6">
      {/* Status Header */}
      <div className="flex items-center justify-between p-4 bg-explorer-card rounded-lg border border-explorer-chrome/30">
        <div>
          <h3 className="text-lg font-semibold text-explorer-text">Management Interface</h3>
          <p className="text-sm text-explorer-text-muted">
            Select models, years, and configurations to manage components
          </p>
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Model Selection - 3 columns */}
        <div className="xl:col-span-3">
          <ModelSelectionPanel
            models={models}
            selectedModel={selectedModel}
            onModelSelect={handleModelSelect}
            loading={modelsLoading}
            error={modelsError}
            onRefresh={refreshData}
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
                selectedYearData={selectedYearData}
                onColorAssigned={() => refreshData()}
                onRefresh={refreshData}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsolidatedAdminPartsLayout;
