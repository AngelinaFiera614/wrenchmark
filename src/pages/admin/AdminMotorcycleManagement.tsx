
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Download, 
  Upload,
  CheckCircle,
  AlertCircle,
  Clock,
  Eye,
  RefreshCw
} from "lucide-react";
import { fetchAllMotorcyclesForAdmin } from "@/services/motorcycles/adminQueries";
import { calculateDataCompleteness } from "@/utils/dataCompleteness";
import { Motorcycle } from "@/types";
import { useMotorcycleFilters } from "@/hooks/useMotorcycleFilters";
import EnhancedMotorcycleSearch from "@/components/admin/motorcycles/search/EnhancedMotorcycleSearch";
import ImprovedMotorcycleFilters from "@/components/admin/motorcycles/filters/ImprovedMotorcycleFilters";
import CompactModelBrowser from "@/components/admin/motorcycles/browser/CompactModelBrowser";
import MotorcycleDetailsPanel from "@/components/admin/motorcycles/unified/MotorcycleDetailsPanel";
import MotorcycleQuickActions from "@/components/admin/motorcycles/unified/MotorcycleQuickActions";
import MotorcycleCompletionDashboard from "@/components/admin/motorcycles/unified/MotorcycleCompletionDashboard";

const AdminMotorcycleManagement = () => {
  const [selectedMotorcycle, setSelectedMotorcycle] = useState<Motorcycle | null>(null);
  const [selectedMotorcycles, setSelectedMotorcycles] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("browse");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const { data: motorcycles, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["admin-motorcycle-management"],
    queryFn: fetchAllMotorcyclesForAdmin,
    refetchOnWindowFocus: false
  });

  const {
    filters,
    filteredMotorcycles,
    handleSearchChange,
    handleFilterChange,
    resetFilters
  } = useMotorcycleFilters(motorcycles || []);

  const stats = {
    total: motorcycles?.length || 0,
    published: motorcycles?.filter(m => !m.is_draft).length || 0,
    drafts: motorcycles?.filter(m => m.is_draft).length || 0,
    incomplete: motorcycles?.filter(m => calculateDataCompleteness(m).completionPercentage < 100).length || 0
  };

  const handleRefresh = () => {
    refetch();
    setSelectedMotorcycle(null);
    setSelectedMotorcycles([]);
  };

  const handleMotorcycleUpdate = () => {
    refetch();
    if (selectedMotorcycle && motorcycles) {
      const updatedMotorcycle = motorcycles.find(m => m.id === selectedMotorcycle.id);
      if (updatedMotorcycle) {
        setSelectedMotorcycle(updatedMotorcycle);
      }
    }
  };

  const handleToggleMotorcycleSelection = (motorcycleId: string) => {
    setSelectedMotorcycles(prev => 
      prev.includes(motorcycleId) 
        ? prev.filter(id => id !== motorcycleId)
        : [...prev, motorcycleId]
    );
  };

  const handleSelectAll = () => {
    setSelectedMotorcycles(filteredMotorcycles.map(m => m.id));
  };

  const handleClearSelection = () => {
    setSelectedMotorcycles([]);
  };

  const getActiveFiltersCount = () => {
    return [
      filters.categories.length > 0,
      filters.make !== "",
      filters.yearRange[0] !== 1900 || filters.yearRange[1] !== 2030,
      filters.engineSizeRange[0] !== 0 || filters.engineSizeRange[1] !== 3000,
      filters.weightRange[0] !== 0 || filters.weightRange[1] !== 600,
      filters.seatHeightRange[0] !== 400 || filters.seatHeightRange[1] !== 1300,
      filters.abs !== null
    ].filter(Boolean).length;
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-explorer-text">Motorcycle Management</h1>
          <p className="text-explorer-text-muted mt-1">
            Enhanced interface for managing all motorcycle data with improved search and filtering
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefetching}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button size="sm" className="bg-accent-teal text-black hover:bg-accent-teal/80">
            <Plus className="h-4 w-4 mr-2" />
            Add Model
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-explorer-text-muted">Total Models</p>
                <p className="text-2xl font-bold text-explorer-text">{stats.total}</p>
              </div>
              <div className="h-8 w-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Eye className="h-4 w-4 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-explorer-text-muted">Published</p>
                <p className="text-2xl font-bold text-green-400">{stats.published}</p>
              </div>
              <div className="h-8 w-8 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-explorer-text-muted">Drafts</p>
                <p className="text-2xl font-bold text-orange-400">{stats.drafts}</p>
              </div>
              <div className="h-8 w-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-explorer-text-muted">Incomplete</p>
                <p className="text-2xl font-bold text-red-400">{stats.incomplete}</p>
              </div>
              <div className="h-8 w-8 bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertCircle className="h-4 w-4 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Browse & Edit</TabsTrigger>
          <TabsTrigger value="completion">Data Completion</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Operations</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="flex-1 flex flex-col mt-4 space-y-3">
          {/* Enhanced Search */}
          <EnhancedMotorcycleSearch
            motorcycles={motorcycles || []}
            searchTerm={filters.searchTerm}
            onSearchChange={handleSearchChange}
            onAdvancedToggle={() => setIsFiltersOpen(!isFiltersOpen)}
            isAdvancedOpen={isFiltersOpen}
            activeFiltersCount={getActiveFiltersCount()}
          />

          {/* Improved Filters */}
          <ImprovedMotorcycleFilters
            filters={filters}
            motorcycles={motorcycles || []}
            filteredCount={filteredMotorcycles.length}
            onFilterChange={handleFilterChange}
            onClearFilters={resetFilters}
            isOpen={isFiltersOpen}
          />

          {/* Compact Model Browser */}
          <CompactModelBrowser
            motorcycles={filteredMotorcycles}
            selectedMotorcycle={selectedMotorcycle}
            selectedMotorcycles={selectedMotorcycles}
            onSelectMotorcycle={setSelectedMotorcycle}
            onToggleMotorcycleSelection={handleToggleMotorcycleSelection}
            onSelectAll={handleSelectAll}
            onClearSelection={handleClearSelection}
            isLoading={isLoading}
          />

          {/* Details Panel - Only show when a motorcycle is selected */}
          {selectedMotorcycle && (
            <MotorcycleDetailsPanel
              motorcycle={selectedMotorcycle}
              onUpdate={handleMotorcycleUpdate}
            />
          )}
        </TabsContent>

        <TabsContent value="completion" className="flex-1 mt-4">
          <MotorcycleCompletionDashboard motorcycles={motorcycles || []} />
        </TabsContent>

        <TabsContent value="bulk" className="flex-1 mt-4">
          <MotorcycleQuickActions
            selectedMotorcycles={selectedMotorcycles.map(id => 
              motorcycles?.find(m => m.id === id)
            ).filter(Boolean) as Motorcycle[]}
            onRefresh={handleRefresh}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminMotorcycleManagement;
