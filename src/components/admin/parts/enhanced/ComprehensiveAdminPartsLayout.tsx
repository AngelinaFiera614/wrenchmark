
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
    <TooltipProvider>
      <div className="min-h-screen bg-explorer-dark">
        {/* Header */}
        <div className="bg-explorer-card border-b border-explorer-chrome/30 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-explorer-text">Parts & Configuration Manager</h1>
              <p className="text-explorer-text-muted">
                Comprehensive motorcycle parts and configuration management
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {selectedModel && (
                <div className="text-right">
                  <div className="text-sm font-medium text-explorer-text">Completeness</div>
                  <Badge 
                    variant="outline" 
                    className={completeness.percentage >= 80 ? 'text-green-400 border-green-400/30' : 'text-yellow-400 border-yellow-400/30'}
                  >
                    {completeness.percentage >= 80 ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 mr-1" />
                    )}
                    {completeness.percentage}%
                  </Badge>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowKeyboardHelp(true)}
                      className="h-8 w-8 p-0"
                    >
                      <Keyboard className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Keyboard Shortcuts (F1)</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => optimizedData.refreshCache('all')}
                      className="h-8 w-8 p-0"
                      disabled={isLoading}
                    >
                      <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Refresh Data (R)</TooltipContent>
                </Tooltip>
              </div>
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
                    <Card className="bg-explorer-card border-explorer-chrome/30">
                      <CardHeader>
                        <CardTitle className="text-explorer-text">Model Years</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {yearsLoading ? (
                          <div className="space-y-2">
                            {Array.from({ length: 3 }).map((_, i) => (
                              <div key={i} className="h-10 bg-explorer-chrome/20 rounded animate-pulse" />
                            ))}
                          </div>
                        ) : modelYears.length > 0 ? (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {modelYears.map((year) => (
                              <Button
                                key={year.id}
                                variant={selectedYear === year.id ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleYearSelect(year.id)}
                                className={selectedYear === year.id ? 
                                  "bg-accent-teal text-black hover:bg-accent-teal/80" : 
                                  "border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
                                }
                              >
                                {year.year}
                              </Button>
                            ))}
                          </div>
                        ) : (
                          <p className="text-explorer-text-muted text-sm">No years found for this model</p>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {selectedYear && (
                    <Card className="bg-explorer-card border-explorer-chrome/30">
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-explorer-text">Configurations</CardTitle>
                          <Button
                            size="sm"
                            onClick={() => setShowBulkOps(true)}
                            className="bg-accent-teal text-black hover:bg-accent-teal/80"
                          >
                            Bulk Operations
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {configsLoading ? (
                          <div className="space-y-3">
                            {Array.from({ length: 2 }).map((_, i) => (
                              <div key={i} className="h-16 bg-explorer-chrome/20 rounded animate-pulse" />
                            ))}
                          </div>
                        ) : configurations.length > 0 ? (
                          <div className="space-y-3">
                            {configurations.map((config) => (
                              <div
                                key={config.id}
                                className={`p-3 border rounded cursor-pointer transition-all ${
                                  selectedConfig === config.id
                                    ? 'border-accent-teal bg-accent-teal/10'
                                    : 'border-explorer-chrome/30 hover:border-explorer-chrome/50'
                                }`}
                                onClick={() => handleConfigSelect(config.id)}
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium text-explorer-text">
                                      {config.name || "Standard Configuration"}
                                    </h4>
                                    <p className="text-sm text-explorer-text-muted">
                                      {config.trim_level && `${config.trim_level} • `}
                                      {config.market_region || 'Global'}
                                    </p>
                                  </div>
                                  {config.is_default && (
                                    <Badge variant="secondary" className="text-xs">Default</Badge>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-explorer-text-muted text-sm">No configurations found</p>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Details Panel */}
                <div className="xl:col-span-1">
                  {selectedConfigData ? (
                    <Card className="bg-explorer-card border-explorer-chrome/30">
                      <CardHeader>
                        <CardTitle className="text-explorer-text">Configuration Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-medium text-explorer-text">{selectedConfigData.name}</h4>
                          {selectedConfigData.msrp_usd && (
                            <p className="text-sm text-explorer-text-muted">
                              ${selectedConfigData.msrp_usd.toLocaleString()}
                            </p>
                          )}
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-explorer-text-muted">Engine:</span>
                            <span className="text-explorer-text">
                              {selectedConfigData.engines?.name || 'Not set'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-explorer-text-muted">Brakes:</span>
                            <span className="text-explorer-text">
                              {selectedConfigData.brake_systems?.type || 'Not set'}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-explorer-card border-explorer-chrome/30">
                      <CardContent className="p-8 text-center">
                        <Monitor className="h-12 w-12 text-explorer-text-muted mx-auto mb-4" />
                        <p className="text-explorer-text-muted">
                          Select a configuration to view details
                        </p>
                      </CardContent>
                    </Card>
                  )}
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="bg-explorer-card border-explorer-chrome/30 w-96 max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="text-explorer-text flex items-center gap-2">
                  <Keyboard className="h-5 w-5" />
                  Keyboard Shortcuts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-explorer-text-muted">Refresh</span>
                    <Badge variant="outline">R</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-explorer-text-muted">Search</span>
                    <Badge variant="outline">Ctrl+F</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-explorer-text-muted">New</span>
                    <Badge variant="outline">Ctrl+N</Badge>
                  </div>
                </div>
                
                <Button 
                  onClick={() => setShowKeyboardHelp(false)}
                  className="w-full bg-accent-teal text-black hover:bg-accent-teal/80"
                >
                  Close
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default ComprehensiveAdminPartsLayout;
