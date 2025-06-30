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
import AdminMotorcycleList from "@/components/admin/motorcycles/AdminMotorcycleList";
import AdminMotorcycleDebug from "@/components/admin/motorcycles/AdminMotorcycleDebug";
import AdminMotorcycleDialogs from "@/components/admin/motorcycles/AdminMotorcycleDialogs";
import BulkSelectionToolbar from "@/components/admin/motorcycles/BulkSelectionToolbar";
import MotorcyclePagination from "@/components/admin/motorcycles/MotorcyclePagination";
import ConsolidatedMotorcycleHeader from "@/components/admin/motorcycles/ConsolidatedMotorcycleHeader";
import ConsolidatedFilters from "@/components/admin/motorcycles/ConsolidatedFilters";

interface ConsolidatedFilters {
  search: string;
  brands: string[];
  categories: string[];
  statuses: string[];
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
  
  // Consolidated filtering state
  const [consolidatedFilters, setConsolidatedFilters] = useState<ConsolidatedFilters>({
    search: '',
    brands: [],
    categories: [],
    statuses: [],
    hasAbs: 'all'
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  
  // Complete brand and category data
  const [allBrands, setAllBrands] = useState<Array<{ id: string; name: string; count: number }>>([]);
  const [allCategories, setAllCategories] = useState<Array<{ value: string; label: string; count: number }>>([]);
  
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

  // Fetch complete brand and category data on component mount
  useEffect(() => {
    const fetchCompleteData = async () => {
      try {
        // Fetch all brands with counts
        const { data: brandsData } = await supabase
          .from('brands')
          .select(`
            id,
            name,
            motorcycle_models!inner(id)
          `);

        if (brandsData) {
          const brandOptions = brandsData.map(brand => ({
            id: brand.id,
            name: brand.name,
            count: brand.motorcycle_models?.length || 0
          })).sort((a, b) => a.name.localeCompare(b.name));
          setAllBrands(brandOptions);
        }

        // Get all unique categories from motorcycles
        const uniqueCategories = Array.from(new Set(
          allMotorcycles.map(m => m.type).filter(Boolean)
        )).sort();

        const categoryOptions = uniqueCategories.map(category => ({
          value: category,
          label: category,
          count: allMotorcycles.filter(m => m.type === category).length
        }));
        setAllCategories(categoryOptions);

      } catch (error) {
        console.error('Error fetching complete data:', error);
      }
    };

    if (allMotorcycles.length > 0) {
      fetchCompleteData();
    }
  }, [allMotorcycles]);

  // Apply consolidated filters to motorcycles
  const filteredMotorcycles = useMemo(() => {
    return allMotorcycles.filter(motorcycle => {
      // Search filter
      if (consolidatedFilters.search) {
        const searchTerm = consolidatedFilters.search.toLowerCase();
        const searchMatch = 
          motorcycle.name?.toLowerCase().includes(searchTerm) ||
          motorcycle.brand?.name?.toLowerCase().includes(searchTerm) ||
          motorcycle.brands?.name?.toLowerCase().includes(searchTerm) ||
          motorcycle.type?.toLowerCase().includes(searchTerm) ||
          motorcycle.production_start_year?.toString().includes(searchTerm);
        if (!searchMatch) return false;
      }
      
      // Brand filter
      if (consolidatedFilters.brands.length > 0) {
        const brandId = motorcycle.brand?.id || motorcycle.brands?.id;
        if (!brandId || !consolidatedFilters.brands.includes(brandId)) return false;
      }
      
      // Category filter
      if (consolidatedFilters.categories.length > 0) {
        if (!motorcycle.type || !consolidatedFilters.categories.includes(motorcycle.type)) return false;
      }
      
      // Status filter - Fixed to show both when no status selected
      if (consolidatedFilters.statuses.length > 0) {
        const status = motorcycle.is_draft ? 'draft' : 'published';
        if (!consolidatedFilters.statuses.includes(status)) return false;
      }
      
      // ABS filter
      if (consolidatedFilters.hasAbs !== 'all') {
        const hasAbs = motorcycle.has_abs === true;
        if (consolidatedFilters.hasAbs === 'yes' && !hasAbs) return false;
        if (consolidatedFilters.hasAbs === 'no' && hasAbs) return false;
      }
      
      return true;
    });
  }, [allMotorcycles, consolidatedFilters]);

  // Paginated motorcycles
  const paginatedMotorcycles = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredMotorcycles.slice(startIndex, startIndex + pageSize);
  }, [filteredMotorcycles, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredMotorcycles.length / pageSize);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [consolidatedFilters]);

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

  const handleClearConsolidatedFilters = () => {
    setConsolidatedFilters({
      search: '',
      brands: [],
      categories: [],
      statuses: [],
      hasAbs: 'all'
    });
  };

  const handleConsolidatedFilterChange = (key: string, value: any) => {
    setConsolidatedFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Generate search suggestions
  const searchSuggestions = useMemo(() => {
    const suggestions = new Set<string>();
    allMotorcycles.forEach(m => {
      if (m.name) suggestions.add(m.name);
      if (m.brand?.name) suggestions.add(m.brand.name);
      if (m.brands?.name) suggestions.add(m.brands.name);
      if (m.type) suggestions.add(m.type);
    });
    return Array.from(suggestions).sort();
  }, [allMotorcycles]);

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
        <ConsolidatedMotorcycleHeader
          searchValue={consolidatedFilters.search}
          onSearchChange={(value) => handleConsolidatedFilterChange('search', value)}
          onSearchClear={() => handleConsolidatedFilterChange('search', '')}
          totalCount={0}
          filteredCount={0}
          onRefresh={refetch}
          onExportAll={handleExportAll}
          onImport={() => setImportDialogOpen(true)}
          onAddMotorcycle={() => setAddDialogOpen(true)}
          isLoading={isLoading}
          searchSuggestions={[]}
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
      <ConsolidatedMotorcycleHeader
        searchValue={consolidatedFilters.search}
        onSearchChange={(value) => handleConsolidatedFilterChange('search', value)}
        onSearchClear={() => handleConsolidatedFilterChange('search', '')}
        totalCount={allMotorcycles.length}
        filteredCount={filteredMotorcycles.length}
        onRefresh={refetch}
        onExportAll={handleExportAll}
        onImport={() => setImportDialogOpen(true)}
        onAddMotorcycle={() => setAddDialogOpen(true)}
        isLoading={isLoading || isComponentOperationInProgress}
        searchSuggestions={searchSuggestions}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Browse & Filter</TabsTrigger>
          <TabsTrigger value="debug">Debug Info</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="flex-1 flex flex-col mt-4 space-y-3">
          <ConsolidatedFilters
            filters={consolidatedFilters}
            motorcycles={allMotorcycles}
            allBrands={allBrands}
            allCategories={allCategories}
            onFilterChange={handleConsolidatedFilterChange}
            onClearFilters={handleClearConsolidatedFilters}
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
