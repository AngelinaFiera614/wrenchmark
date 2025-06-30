
import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle } from "lucide-react";
import { useSimpleMotorcycleData } from "@/hooks/useSimpleMotorcycleData";
import { useBulkMotorcycleActions } from "@/hooks/useBulkMotorcycleActions";
import { useDebounceRefresh } from "@/hooks/useDebounceRefresh";
import { clearCompletenessCache } from "@/hooks/useMotorcycleCompleteness";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Motorcycle } from "@/types";

// Import components
import AdminMotorcycleHeader from "@/components/admin/motorcycles/AdminMotorcycleHeader";
import AdminMotorcycleStats from "@/components/admin/motorcycles/AdminMotorcycleStats";
import AdminMotorcycleList from "@/components/admin/motorcycles/AdminMotorcycleList";
import AdminMotorcycleDebug from "@/components/admin/motorcycles/AdminMotorcycleDebug";
import AdminMotorcycleDialogs from "@/components/admin/motorcycles/AdminMotorcycleDialogs";
import BulkSelectionToolbar from "@/components/admin/motorcycles/BulkSelectionToolbar";
import EnhancedMotorcycleFilters from "@/components/admin/motorcycles/EnhancedMotorcycleFilters";
import MotorcyclePagination from "@/components/admin/motorcycles/MotorcyclePagination";

interface EnhancedFilters {
  search: string;
  brands: string[];
  categories: string[];
  statuses: string[];
  yearRange: [number, number];
  engineSizeRange: [number, number];
  hasAbs: 'all' | 'yes' | 'no';
}

const AdminMotorcycleManagement = () => {
  const [activeTab, setActiveTab] = useState("browse");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [componentDialogOpen, setComponentDialogOpen] = useState(false);
  const [selectedMotorcycleForEdit, setSelectedMotorcycleForEdit] = useState<Motorcycle | null>(null);
  const [selectedMotorcycleForComponents, setSelectedMotorcycleForComponents] = useState<any | null>(null);
  const [isComponentOperationInProgress, setIsComponentOperationInProgress] = useState(false);
  
  // Enhanced filtering state
  const [enhancedFilters, setEnhancedFilters] = useState<EnhancedFilters>({
    search: '',
    brands: [],
    categories: [],
    statuses: [],
    yearRange: [1900, 2030],
    engineSizeRange: [0, 3000],
    hasAbs: 'all'
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  
  const { toast } = useToast();
  
  const {
    motorcycles: allMotorcycles,
    brands,
    stats,
    componentStats,
    filters: oldFilters,
    isLoading,
    error,
    isEnabled,
    handleFilterChange: oldHandleFilterChange,
    clearFilters: oldClearFilters,
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

  // Apply enhanced filters to motorcycles
  const filteredMotorcycles = useMemo(() => {
    return allMotorcycles.filter(motorcycle => {
      // Search filter
      if (enhancedFilters.search) {
        const searchTerm = enhancedFilters.search.toLowerCase();
        const searchMatch = 
          motorcycle.name?.toLowerCase().includes(searchTerm) ||
          motorcycle.brand?.name?.toLowerCase().includes(searchTerm) ||
          motorcycle.brands?.name?.toLowerCase().includes(searchTerm) ||
          motorcycle.type?.toLowerCase().includes(searchTerm);
        if (!searchMatch) return false;
      }
      
      // Brand filter
      if (enhancedFilters.brands.length > 0) {
        const brandName = motorcycle.brand?.name || motorcycle.brands?.name;
        if (!brandName || !enhancedFilters.brands.includes(brandName)) return false;
      }
      
      // Category filter
      if (enhancedFilters.categories.length > 0) {
        if (!motorcycle.type || !enhancedFilters.categories.includes(motorcycle.type)) return false;
      }
      
      // Status filter
      if (enhancedFilters.statuses.length > 0) {
        const status = motorcycle.is_draft ? 'draft' : 'published';
        if (!enhancedFilters.statuses.includes(status)) return false;
      }
      
      // ABS filter
      if (enhancedFilters.hasAbs !== 'all') {
        const hasAbs = motorcycle.has_abs === true;
        if (enhancedFilters.hasAbs === 'yes' && !hasAbs) return false;
        if (enhancedFilters.hasAbs === 'no' && hasAbs) return false;
      }
      
      return true;
    });
  }, [allMotorcycles, enhancedFilters]);

  // Paginated motorcycles
  const paginatedMotorcycles = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredMotorcycles.slice(startIndex, startIndex + pageSize);
  }, [filteredMotorcycles, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredMotorcycles.length / pageSize);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [enhancedFilters]);

  // Create debounced refresh function
  const debouncedRefresh = useDebounceRefresh(() => {
    console.log('Performing debounced refresh after component operation...');
    clearCompletenessCache();
    refetch();
    setIsComponentOperationInProgress(false);
  }, 1000);

  // Handle component dialog operations with proper loading states
  useEffect(() => {
    if (!componentDialogOpen && selectedMotorcycleForComponents && isComponentOperationInProgress) {
      console.log('Component dialog closed, starting debounced refresh...');
      debouncedRefresh();
    }
  }, [componentDialogOpen, selectedMotorcycleForComponents, isComponentOperationInProgress, debouncedRefresh]);

  const handleClearEnhancedFilters = () => {
    setEnhancedFilters({
      search: '',
      brands: [],
      categories: [],
      statuses: [],
      yearRange: [1900, 2030],
      engineSizeRange: [0, 3000],
      hasAbs: 'all'
    });
  };

  const handleEditMotorcycle = (motorcycle: Motorcycle) => {
    setSelectedMotorcycleForEdit(motorcycle);
    setEditDialogOpen(true);
  };

  const handleManageComponents = (motorcycle: Motorcycle) => {
    setSelectedMotorcycleForComponents(motorcycle);
    setComponentDialogOpen(true);
    setIsComponentOperationInProgress(true);
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
    const motorcycle = allMotorcycles.find(m => m.id === id);
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
    const exportData = filteredMotorcycles.map(motorcycle => ({
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
    
    const exportFileDefaultName = `filtered_motorcycles_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast({
      title: "Export Complete",
      description: `${filteredMotorcycles.length} motorcycles exported successfully.`
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

  const allSelected = selectedIds.length === paginatedMotorcycles.length && paginatedMotorcycles.length > 0;

  return (
    <div className="h-full flex flex-col space-y-4">
      <AdminMotorcycleHeader
        onRefresh={refetch}
        onExportAll={handleExportAll}
        onImport={() => setImportDialogOpen(true)}
        onAddMotorcycle={() => setAddDialogOpen(true)}
        isLoading={isLoading || isComponentOperationInProgress}
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
          <EnhancedMotorcycleFilters
            filters={enhancedFilters}
            motorcycles={allMotorcycles}
            onFilterChange={setEnhancedFilters}
            onClearFilters={handleClearEnhancedFilters}
            isLoading={isLoading}
          />

          <BulkSelectionToolbar
            selectedCount={selectedIds.length}
            totalCount={paginatedMotorcycles.length}
            allSelected={allSelected}
            onSelectAll={() => handleSelectAll(paginatedMotorcycles)}
            onClearSelection={handleClearSelection}
            onBulkPublish={() => handleBulkPublish(refetch)}
            onBulkDraft={() => handleBulkDraft(refetch)}
            onBulkExport={() => handleBulkExport(paginatedMotorcycles)}
            onBulkDelete={() => handleBulkDelete(refetch)}
          />

          <AdminMotorcycleList
            motorcycles={paginatedMotorcycles}
            selectedIds={selectedIds}
            isLoading={isLoading || isComponentOperationInProgress}
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

          <MotorcyclePagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filteredMotorcycles.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="debug" className="flex-1 mt-4">
          <AdminMotorcycleDebug
            isEnabled={isEnabled}
            motorcyclesCount={allMotorcycles.length}
            brandsCount={brands.length}
            isLoading={isLoading}
            error={error}
            isDraftMode={isDraftMode}
            filters={oldFilters}
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
