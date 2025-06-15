import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Database, 
  Settings, 
  Keyboard, 
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Monitor
} from "lucide-react";
import { useAdminPartsLayoutState } from "@/hooks/admin/useAdminPartsLayoutState";
import { useAdminKeyboardShortcuts } from "@/hooks/admin/useAdminKeyboardShortcuts";
import PaginatedModelSelector from "./PaginatedModelSelector";
import BulkOperationsPanel from "./BulkOperationsPanel";
import { useToast } from "@/hooks/use-toast";
import HeaderSection from "./HeaderSection";
import YearSelectorSection from "./YearSelectorSection";
import ConfigurationListSection from "./ConfigurationListSection";
import DetailPanelSection from "./DetailPanelSection";
import KeyboardHelpModal from "./KeyboardHelpModal";

const ComprehensiveAdminPartsLayout = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("management");
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [selectedConfigs, setSelectedConfigs] = useState<Set<string>>(new Set());
  const [showBulkOps, setShowBulkOps] = useState(false);

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
    refreshConfigurations,
    optimizedData
  } = useAdminPartsLayoutState();

  // Keyboard shortcuts
  const shortcuts = useAdminKeyboardShortcuts({
    onRefresh: () => optimizedData.refreshCache('all'),
    onSearch: () => console.log("Focus search"),
    onCreateNew: () => toast({ title: "Create New", description: "Feature coming soon" }),
    onEdit: () => toast({ title: "Edit", description: "Feature coming soon" }),
    onDelete: () => toast({ title: "Delete", description: "Feature coming soon" })
  });

  const handleBulkOperation = async (operation: string, configs: any[]) => {
    toast({
      title: "Bulk Operation",
      description: `${operation} operation on ${configs.length} configurations`
    });
    // Implementation would go here
  };

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
      <HeaderSection
        completeness={completeness}
        selectedModel={selectedModel}
        isLoading={isLoading}
        onShowKeyboardHelp={() => setShowKeyboardHelp(true)}
        onRefresh={() => optimizedData.refreshCache('all')}
      />

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
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Model Selection */}
              <div className="xl:col-span-1">
                <PaginatedModelSelector
                  selectedModel={selectedModel}
                  onModelSelect={handleModelSelect}
                />
              </div>
              {/* Years and Configurations */}
              <div className="xl:col-span-2 space-y-6">
                {selectedModel && (
                  <YearSelectorSection
                    years={modelYears}
                    selectedYear={selectedYear}
                    onYearSelect={handleYearSelect}
                    loading={yearsLoading}
                  />
                )}
                {selectedYear && (
                  <ConfigurationListSection
                    configurations={configurations}
                    selectedConfig={selectedConfig}
                    onSelectConfig={handleConfigSelect}
                    loading={configsLoading}
                    onShowBulkOps={() => setShowBulkOps(true)}
                  />
                )}
              </div>
              {/* Details Panel */}
              <div className="xl:col-span-1">
                <DetailPanelSection config={selectedConfigData} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <Card className="bg-explorer-card border-explorer-chrome/30">
              <CardHeader>
                <CardTitle className="text-explorer-text">Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-explorer-text-muted">Analytics features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bulk" className="mt-6">
            <Card className="bg-explorer-card border-explorer-chrome/30">
              <CardHeader>
                <CardTitle className="text-explorer-text">Bulk Operations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-explorer-text-muted">Bulk operation tools coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Bulk Operations Panel */}
      <BulkOperationsPanel
        configurations={configurations}
        selectedConfigs={selectedConfigs}
        onSelectionChange={setSelectedConfigs}
        onBulkOperation={handleBulkOperation}
        isVisible={showBulkOps}
        onClose={() => setShowBulkOps(false)}
      />

      {/* Keyboard Help Modal */}
      {showKeyboardHelp && (
        <KeyboardHelpModal
          onClose={() => setShowKeyboardHelp(false)}
        />
      )}
    </div>
  );
};

export default ComprehensiveAdminPartsLayout;
