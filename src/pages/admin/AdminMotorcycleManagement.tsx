
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Download, 
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Database,
  Cpu
} from "lucide-react";
import { useSimpleMotorcycleData } from "@/hooks/useSimpleMotorcycleData";
import MotorcycleFilters from "@/components/admin/motorcycles/MotorcycleFilters";
import BulkSelectionToolbar from "@/components/admin/motorcycles/BulkSelectionToolbar";
import EnhancedMotorcycleCard from "@/components/admin/motorcycles/EnhancedMotorcycleCard";
import AddMotorcycleDialog from "@/components/admin/motorcycles/AddMotorcycleDialog";
import { useBulkMotorcycleActions } from "@/hooks/useBulkMotorcycleActions";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminMotorcycleManagement = () => {
  const [activeTab, setActiveTab] = useState("browse");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const {
    motorcycles,
    brands,
    stats,
    componentStats,
    filters,
    isLoading,
    error,
    isEnabled,
    handleFilterChange,
    clearFilters,
    refetch,
    toggleDraftMode,
    isDraftMode
  } = useSimpleMotorcycleData();

  const {
    selectedIds,
    handleSelect,
    handleSelectAll,
    handleClearSelection,
    handleBulkPublish,
    handleBulkDraft,
    handleBulkExport,
    handleBulkDelete
  } = useBulkMotorcycleActions();

  const handleEditMotorcycle = (motorcycle: any) => {
    // TODO: Implement edit dialog
    toast({
      title: "Edit Feature",
      description: "Edit functionality will be implemented in the next phase."
    });
  };

  const handleDeleteMotorcycle = async (id: string) => {
    if (!confirm("Are you sure you want to delete this motorcycle?")) return;

    try {
      const { error } = await supabase
        .from('motorcycle_models')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Motorcycle Deleted",
        description: "Motorcycle has been successfully deleted."
      });

      refetch();
    } catch (error) {
      console.error('Error deleting motorcycle:', error);
      toast({
        title: "Error",
        description: "Failed to delete motorcycle.",
        variant: "destructive"
      });
    }
  };

  const handleToggleStatus = async (id: string) => {
    const motorcycle = motorcycles.find(m => m.id === id);
    if (!motorcycle) return;

    try {
      const { error } = await supabase
        .from('motorcycle_models')
        .update({ is_draft: !motorcycle.is_draft })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: motorcycle.is_draft ? "Motorcycle Published" : "Motorcycle Drafted",
        description: `${motorcycle.name} has been ${motorcycle.is_draft ? 'published' : 'marked as draft'}.`
      });

      refetch();
    } catch (error) {
      console.error('Error updating motorcycle status:', error);
      toast({
        title: "Error",
        description: "Failed to update motorcycle status.",
        variant: "destructive"
      });
    }
  };

  const handleExportAll = () => {
    const exportData = motorcycles.map(motorcycle => ({
      id: motorcycle.id,
      name: motorcycle.name,
      brand: motorcycle.brand?.name || motorcycle.brands?.name || 'Unknown',
      type: motorcycle.type,
      production_start_year: motorcycle.production_start_year,
      is_draft: motorcycle.is_draft,
      engine_size: motorcycle.engine_size,
      horsepower: motorcycle.horsepower,
      weight_kg: motorcycle.weight_kg
    }));

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `all_motorcycles_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast({
      title: "Export Complete",
      description: `${motorcycles.length} motorcycles exported successfully.`
    });
  };

  console.log('AdminMotorcycleManagement - Render state:', {
    isEnabled,
    motorcyclesCount: motorcycles.length,
    brandsCount: brands.length,
    isLoading,
    error,
    stats,
    componentStats
  });

  // Show authentication warning if not enabled
  if (!isEnabled) {
    return (
      <div className="h-full flex flex-col space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-explorer-text">Motorcycle Management</h1>
            <p className="text-explorer-text-muted mt-1">
              Admin access required
            </p>
          </div>
        </div>
        
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-orange-800 mb-4">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">Admin Access Required</span>
            </div>
            <p className="text-orange-700">
              You need to be signed in as an administrator to access motorcycle management.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const allSelected = selectedIds.length === motorcycles.length && motorcycles.length > 0;

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-explorer-text">Motorcycle Management</h1>
          <p className="text-explorer-text-muted mt-1">
            Enhanced interface with bulk operations and detailed motorcycle information
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refetch}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportAll}>
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button 
            size="sm" 
            className="bg-accent-teal text-black hover:bg-accent-teal/80"
            onClick={() => setAddDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Model
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      {(stats || componentStats) && (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {stats && (
            <>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Models</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <CheckCircle className="h-3 w-3" />
                    Database Optimized
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Published</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.complete}</div>
                  <div className="text-xs text-muted-foreground">
                    {stats.total > 0 ? Math.round((stats.complete / stats.total) * 100) : 0}% of total
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Drafts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{stats.drafts}</div>
                  <div className="text-xs text-muted-foreground">
                    {stats.total > 0 ? Math.round((stats.drafts / stats.total) * 100) : 0}% of total
                  </div>
                </CardContent>
              </Card>
            </>
          )}
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Brands Available</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{brands.length}</div>
              <div className="text-xs text-muted-foreground">
                Active brands
              </div>
            </CardContent>
          </Card>

          {componentStats && (
            <>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-1">
                    <Cpu className="h-4 w-4" />
                    Components
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{componentStats.total}</div>
                  <div className="text-xs text-muted-foreground">
                    Published components
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-1">
                    <Database className="h-4 w-4" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent-teal">Fast</div>
                  <div className="text-xs text-muted-foreground">
                    Indexed & optimized
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )}

      {/* Main Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Enhanced Browse</TabsTrigger>
          <TabsTrigger value="debug">Debug Info</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="flex-1 flex flex-col mt-4 space-y-3">
          {/* Filters */}
          <MotorcycleFilters
            filters={filters}
            brands={brands}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
            resultCount={motorcycles.length}
          />

          {/* Bulk Selection Toolbar */}
          <BulkSelectionToolbar
            selectedCount={selectedIds.length}
            totalCount={motorcycles.length}
            allSelected={allSelected}
            onSelectAll={() => handleSelectAll(motorcycles)}
            onClearSelection={handleClearSelection}
            onBulkPublish={() => handleBulkPublish(refetch)}
            onBulkDraft={() => handleBulkDraft(refetch)}
            onBulkExport={() => handleBulkExport(motorcycles)}
            onBulkDelete={() => handleBulkDelete(refetch)}
          />

          {/* Enhanced Motorcycle List */}
          <div className="space-y-4">
            {isLoading ? (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Loading motorcycles...</span>
                  </div>
                </CardContent>
              </Card>
            ) : error ? (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-red-800 mb-4">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="font-medium">Error Loading Motorcycles</span>
                  </div>
                  <p className="text-red-700 mb-4">{error}</p>
                  <Button variant="outline" onClick={refetch}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            ) : motorcycles.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground mb-4">
                    No {isDraftMode ? 'draft' : 'published'} motorcycles found
                  </p>
                  <Button 
                    className="bg-accent-teal text-black hover:bg-accent-teal/80"
                    onClick={() => setAddDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Motorcycle
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {motorcycles.map((motorcycle) => (
                  <EnhancedMotorcycleCard
                    key={motorcycle.id}
                    motorcycle={motorcycle}
                    isSelected={selectedIds.includes(motorcycle.id)}
                    onSelect={handleSelect}
                    onEdit={handleEditMotorcycle}
                    onDelete={handleDeleteMotorcycle}
                    onToggleStatus={handleToggleStatus}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="debug" className="flex-1 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Debug Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Connection Status</h4>
                <div className="flex items-center gap-2">
                  <Badge variant={isEnabled ? "default" : "destructive"}>
                    {isEnabled ? "Connected" : "Disconnected"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Admin authentication: {isEnabled ? "Valid" : "Invalid"}
                  </span>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Data Counts</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>Motorcycles: {motorcycles.length}</div>
                  <div>Brands: {brands.length}</div>
                  <div>Loading: {isLoading ? "Yes" : "No"}</div>
                  <div>Error: {error || "None"}</div>
                  <div>Draft Mode: {isDraftMode ? "On" : "Off"}</div>
                  {componentStats && <div>Components: {componentStats.total}</div>}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Performance Improvements</h4>
                <div className="grid grid-cols-2 gap-4 text-sm text-green-600">
                  <div>✓ Database indexes added</div>
                  <div>✓ Draft filtering enabled</div>
                  <div>✓ Foreign key queries optimized</div>
                  <div>✓ Stats table created</div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Active Filters</h4>
                <pre className="text-xs bg-muted p-2 rounded">
                  {JSON.stringify(filters, null, 2)}
                </pre>
              </div>

              {componentStats && (
                <div>
                  <h4 className="font-medium mb-2">Component Stats</h4>
                  <pre className="text-xs bg-muted p-2 rounded">
                    {JSON.stringify(componentStats, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="flex-1 mt-4">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Advanced features will be available here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Motorcycle Dialog */}
      <AddMotorcycleDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        brands={brands}
        onSuccess={refetch}
      />
    </div>
  );
};

export default AdminMotorcycleManagement;
