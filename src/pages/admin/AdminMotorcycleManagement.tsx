
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle } from "lucide-react";
import { useSimpleMotorcycleData } from "@/hooks/useSimpleMotorcycleData";
import { useBulkMotorcycleActions } from "@/hooks/useBulkMotorcycleActions";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Motorcycle } from "@/types";

// Import new components
import AdminMotorcycleHeader from "@/components/admin/motorcycles/AdminMotorcycleHeader";
import AdminMotorcycleStats from "@/components/admin/motorcycles/AdminMotorcycleStats";
import AdminMotorcycleList from "@/components/admin/motorcycles/AdminMotorcycleList";
import AdminMotorcycleDebug from "@/components/admin/motorcycles/AdminMotorcycleDebug";
import AdminMotorcycleDialogs from "@/components/admin/motorcycles/AdminMotorcycleDialogs";
import MotorcycleFilters from "@/components/admin/motorcycles/MotorcycleFilters";
import BulkSelectionToolbar from "@/components/admin/motorcycles/BulkSelectionToolbar";

const AdminMotorcycleManagement = () => {
  const [activeTab, setActiveTab] = useState("browse");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [componentDialogOpen, setComponentDialogOpen] = useState(false);
  const [selectedMotorcycleForEdit, setSelectedMotorcycleForEdit] = useState<Motorcycle | null>(null);
  const [selectedMotorcycleForComponents, setSelectedMotorcycleForComponents] = useState<any | null>(null);
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

  const handleEditMotorcycle = (motorcycle: Motorcycle) => {
    setSelectedMotorcycleForEdit(motorcycle);
    setEditDialogOpen(true);
  };

  const handleManageComponents = (motorcycle: Motorcycle) => {
    setSelectedMotorcycleForComponents(motorcycle);
    setComponentDialogOpen(true);
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

  const handleSetAllDrafts = async () => {
    // Get current counts for confirmation
    const currentPublished = motorcycles.filter(m => !m.is_draft).length;
    const currentDrafts = motorcycles.filter(m => m.is_draft).length;
    
    if (currentPublished === 0) {
      toast({
        title: "No Action Needed",
        description: "All motorcycles are already drafts."
      });
      return;
    }

    const confirmMessage = `Are you sure you want to set ALL motorcycles as drafts?\n\nThis will affect:\n• ${currentPublished} published motorcycles → drafts\n• ${currentDrafts} already drafts (no change)\n\nTotal: ${motorcycles.length} motorcycles`;
    
    if (!confirm(confirmMessage)) return;

    console.log('Starting bulk draft update...');
    console.log(`Current state: ${currentPublished} published, ${currentDrafts} drafts`);

    try {
      // First, get the count of records that will be updated
      const { count: recordsToUpdate, error: countError } = await supabase
        .from('motorcycle_models')
        .select('*', { count: 'exact', head: true })
        .eq('is_draft', false);

      if (countError) {
        console.error('Error counting records:', countError);
        throw countError;
      }

      console.log(`Records to update: ${recordsToUpdate}`);

      // Then perform the update
      const { data, error } = await supabase
        .from('motorcycle_models')
        .update({ 
          is_draft: true,
          updated_at: new Date().toISOString()
        })
        .eq('is_draft', false)
        .select('id');

      console.log('Update result:', { data, error, updatedCount: data?.length });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      const updatedCount = data?.length || 0;
      
      toast({
        title: "Bulk Update Complete",
        description: `Successfully set ${updatedCount} motorcycles as drafts. ${currentDrafts} were already drafts.`
      });

      console.log(`Successfully updated ${updatedCount} motorcycles to draft status`);
      refetch();
    } catch (error) {
      console.error('Error setting all motorcycles as drafts:', error);
      toast({
        title: "Error",
        description: `Failed to set motorcycles as drafts. Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
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

  // Show authentication warning if not enabled
  if (!isEnabled) {
    return (
      <div className="h-full flex flex-col space-y-4">
        <AdminMotorcycleHeader
          onRefresh={refetch}
          onExportAll={handleExportAll}
          onImport={() => setImportDialogOpen(true)}
          onAddMotorcycle={() => setAddDialogOpen(true)}
          onSetAllDrafts={handleSetAllDrafts}
          isLoading={isLoading}
        />
        
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
      <AdminMotorcycleHeader
        onRefresh={refetch}
        onExportAll={handleExportAll}
        onImport={() => setImportDialogOpen(true)}
        onAddMotorcycle={() => setAddDialogOpen(true)}
        onSetAllDrafts={handleSetAllDrafts}
        isLoading={isLoading}
      />

      <AdminMotorcycleStats
        stats={stats}
        componentStats={componentStats}
        brandsCount={brands.length}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Enhanced Browse</TabsTrigger>
          <TabsTrigger value="debug">Debug Info</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="flex-1 flex flex-col mt-4 space-y-3">
          <MotorcycleFilters
            filters={filters}
            brands={brands}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
            resultCount={motorcycles.length}
          />

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

          <AdminMotorcycleList
            motorcycles={motorcycles}
            selectedIds={selectedIds}
            isLoading={isLoading}
            error={error}
            isDraftMode={isDraftMode}
            onSelect={handleSelect}
            onEdit={handleEditMotorcycle}
            onDelete={handleDeleteMotorcycle}
            onToggleStatus={handleToggleStatus}
            onManageComponents={handleManageComponents}
            onRefresh={refetch}
            onAddMotorcycle={() => setAddDialogOpen(true)}
          />
        </TabsContent>

        <TabsContent value="debug" className="flex-1 mt-4">
          <AdminMotorcycleDebug
            isEnabled={isEnabled}
            motorcyclesCount={motorcycles.length}
            brandsCount={brands.length}
            isLoading={isLoading}
            error={error}
            isDraftMode={isDraftMode}
            filters={filters}
            componentStats={componentStats}
          />
        </TabsContent>

        <TabsContent value="advanced" className="flex-1 mt-4">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Advanced features will be available here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AdminMotorcycleDialogs
        addDialogOpen={addDialogOpen}
        editDialogOpen={editDialogOpen}
        importDialogOpen={importDialogOpen}
        componentDialogOpen={componentDialogOpen}
        selectedMotorcycleForEdit={selectedMotorcycleForEdit}
        selectedMotorcycleForComponents={selectedMotorcycleForComponents}
        brands={brands}
        onAddDialogChange={setAddDialogOpen}
        onEditDialogChange={setEditDialogOpen}
        onImportDialogChange={setImportDialogOpen}
        onComponentDialogChange={setComponentDialogOpen}
        onSuccess={refetch}
      />
    </div>
  );
};

export default AdminMotorcycleManagement;
