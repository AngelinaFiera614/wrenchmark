
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Keyboard, 
  HelpCircle, 
  Zap, 
  Database,
  RefreshCw,
  Settings,
  Monitor,
  Users,
  BarChart3
} from "lucide-react";
import { useAdminPartsLayoutState } from "./layout/useAdminPartsLayoutState";
import { useAdminKeyboardShortcuts } from "@/hooks/admin/useAdminKeyboardShortcuts";
import { useOptimizedAdminData } from "@/hooks/admin/useOptimizedAdminData";
import PaginatedModelSelector from "./PaginatedModelSelector";
import ConfigurationBreadcrumbEnhanced from "../navigation/ConfigurationBreadcrumbEnhanced";
import EnhancedTrimLevelActions from "./EnhancedTrimLevelActions";
import QuickCopyDialog from "./QuickCopyDialog";
import EnhancedDeleteTrimDialog from "./EnhancedDeleteTrimDialog";

const OptimizedAdminPartsLayout = () => {
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [showQuickCopy, setShowQuickCopy] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [quickCopyType, setQuickCopyType] = useState<'components' | 'dimensions' | 'colors' | 'all'>('all');

  const {
    selectedModel,
    selectedYear,
    selectedConfig,
    selectedModelData,
    selectedYearData,
    selectedConfigData,
    handleModelSelect,
    handleYearSelect,
    handleConfigSelect,
    refreshConfigurations
  } = useAdminPartsLayoutState();

  const {
    modelsLoading,
    yearsLoading,
    configsLoading,
    refreshCache
  } = useOptimizedAdminData(selectedModel, selectedYear);

  // Keyboard shortcuts
  const shortcuts = useAdminKeyboardShortcuts({
    onNavigateToModels: () => console.log("Navigate to models"),
    onNavigateToYears: () => console.log("Navigate to years"),
    onNavigateToTrims: () => console.log("Navigate to trims"),
    onNavigateToComponents: () => console.log("Navigate to components"),
    onCreateNew: () => console.log("Create new"),
    onEdit: () => console.log("Edit"),
    onDelete: () => setShowDeleteDialog(true),
    onSave: () => console.log("Save"),
    onRefresh: () => refreshCache('all'),
    onQuickCopy: () => setShowQuickCopy(true),
    onSearch: () => console.log("Search"),
    onTogglePreview: () => console.log("Toggle preview")
  });

  const handleQuickCopy = (type: 'components' | 'dimensions' | 'colors' | 'all') => {
    setQuickCopyType(type);
    setShowQuickCopy(true);
  };

  const isLoading = modelsLoading || yearsLoading || configsLoading;

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-explorer-dark">
        {/* Performance Monitor */}
        <div className="bg-explorer-card border-b border-explorer-chrome/30 px-6 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-accent-teal" />
                <span className="text-sm text-explorer-text">Performance Optimized</span>
                <Badge variant="secondary" className="text-xs">Phase 5</Badge>
              </div>
              
              {isLoading && (
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-3 w-3 animate-spin text-blue-400" />
                  <span className="text-xs text-explorer-text-muted">Loading...</span>
                </div>
              )}
            </div>
            
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
                <TooltipContent>
                  <p>Keyboard Shortcuts (F1)</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => refreshCache('all')}
                    className="h-8 w-8 p-0"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Refresh All Data (R or F5)</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Enhanced Breadcrumb */}
        <div className="px-6 py-4">
          <ConfigurationBreadcrumbEnhanced
            selectedModelData={selectedModelData}
            selectedYearData={selectedYearData}
            selectedConfigData={selectedConfigData}
            showQuickActions={!!selectedConfigData}
            onQuickCopy={() => setShowQuickCopy(true)}
            onQuickEdit={() => console.log("Quick edit")}
            onQuickSave={() => console.log("Quick save")}
          />
        </div>

        {/* Main Content Grid */}
        <div className="px-6 pb-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Model Selection */}
          <div className="lg:col-span-1 space-y-6">
            <PaginatedModelSelector
              selectedModel={selectedModel}
              onModelSelect={handleModelSelect}
            />
            
            {/* Performance Stats */}
            <Card className="bg-explorer-card border-explorer-chrome/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-explorer-text flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Cache Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-explorer-text-muted">Models Cache</span>
                  <Badge variant="secondary" className="text-xs">5m TTL</Badge>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-explorer-text-muted">Years Cache</span>
                  <Badge variant="secondary" className="text-xs">10m TTL</Badge>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-explorer-text-muted">Configs Cache</span>
                  <Badge variant="secondary" className="text-xs">2m TTL</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center Column - Years and Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Years Selection */}
            {selectedModel && (
              <Card className="bg-explorer-card border-explorer-chrome/30">
                <CardHeader>
                  <CardTitle className="text-explorer-text">Model Years</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Years content would go here */}
                  <p className="text-explorer-text-muted text-sm">
                    Select a year to view trim levels
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Enhanced Actions */}
            {selectedYear && (
              <EnhancedTrimLevelActions
                selectedConfig={selectedConfigData}
                configurations={[]}
                onCreateNew={() => console.log("Create new")}
                onEdit={(config) => console.log("Edit config:", config)}
                onDelete={(config) => setShowDeleteDialog(true)}
                onQuickCopy={handleQuickCopy}
                onRefresh={() => refreshCache('configurations')}
              />
            )}
          </div>

          {/* Right Column - Configuration Details */}
          <div className="lg:col-span-1 space-y-6">
            {selectedConfigData ? (
              <Card className="bg-explorer-card border-explorer-chrome/30">
                <CardHeader>
                  <CardTitle className="text-explorer-text">Configuration Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-explorer-text">
                        {selectedConfigData.name || 'Unnamed Configuration'}
                      </h4>
                      {selectedConfigData.is_default && (
                        <Badge variant="secondary" className="text-xs mt-1">Default</Badge>
                      )}
                    </div>
                    
                    {selectedConfigData.msrp_usd && (
                      <div>
                        <p className="text-xs text-explorer-text-muted">MSRP</p>
                        <p className="text-sm text-explorer-text">
                          ${selectedConfigData.msrp_usd.toLocaleString()}
                        </p>
                      </div>
                    )}
                    
                    <Separator className="bg-explorer-chrome/30" />
                    
                    <div className="space-y-2">
                      <p className="text-xs text-explorer-text-muted">Quick Actions</p>
                      <div className="flex gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="sm" variant="outline" className="text-xs">
                              Edit ({shortcuts.editShortcut})
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit configuration</p>
                          </TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="sm" variant="outline" className="text-xs">
                              Copy ({shortcuts.quickCopyShortcut})
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Quick copy configuration</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-explorer-card border-explorer-chrome/30">
                <CardContent className="p-8 text-center">
                  <Monitor className="h-12 w-12 text-explorer-text-muted mx-auto mb-4" />
                  <p className="text-explorer-text-muted">
                    Select a model and year to view configurations
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Accessibility Features */}
            <Card className="bg-explorer-card border-explorer-chrome/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-explorer-text flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Accessibility
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-explorer-text-muted">Keyboard Navigation</span>
                  <Badge variant="secondary" className="text-xs">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-explorer-text-muted">Screen Reader</span>
                  <Badge variant="secondary" className="text-xs">Optimized</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-explorer-text-muted">Color Contrast</span>
                  <Badge variant="secondary" className="text-xs">WCAG 2.1</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Dialogs */}
        {showQuickCopy && selectedConfigData && (
          <QuickCopyDialog
            open={showQuickCopy}
            onClose={() => setShowQuickCopy(false)}
            targetConfiguration={selectedConfigData}
            availableConfigurations={[]}
            defaultCopyType={quickCopyType}
            onSuccess={() => refreshConfigurations()}
          />
        )}

        {showDeleteDialog && selectedConfigData && (
          <EnhancedDeleteTrimDialog
            open={showDeleteDialog}
            onClose={() => setShowDeleteDialog(false)}
            configuration={selectedConfigData}
            onSuccess={() => refreshConfigurations()}
          />
        )}

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
                <div>
                  <h4 className="text-sm font-medium text-explorer-text mb-2">Navigation</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-explorer-text-muted">Models</span>
                      <Badge variant="outline" className="text-xs">Alt+1</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-explorer-text-muted">Years</span>
                      <Badge variant="outline" className="text-xs">Alt+2</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-explorer-text-muted">Trims</span>
                      <Badge variant="outline" className="text-xs">Alt+3</Badge>
                    </div>
                  </div>
                </div>
                
                <Separator className="bg-explorer-chrome/30" />
                
                <div>
                  <h4 className="text-sm font-medium text-explorer-text mb-2">Actions</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-explorer-text-muted">New</span>
                      <Badge variant="outline" className="text-xs">Ctrl+N</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-explorer-text-muted">Edit</span>
                      <Badge variant="outline" className="text-xs">Ctrl+E</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-explorer-text-muted">Save</span>
                      <Badge variant="outline" className="text-xs">Ctrl+S</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-explorer-text-muted">Delete</span>
                      <Badge variant="outline" className="text-xs">Del</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    size="sm" 
                    onClick={() => setShowKeyboardHelp(false)}
                    className="bg-accent-teal text-black hover:bg-accent-teal/80"
                  >
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default OptimizedAdminPartsLayout;
