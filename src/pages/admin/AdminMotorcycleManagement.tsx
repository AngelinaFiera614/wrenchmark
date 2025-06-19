
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Download, 
  Upload,
  RefreshCw
} from "lucide-react";
import { Motorcycle } from "@/types";
import { useMotorcycleManagement } from "@/hooks/useMotorcycleManagement";
import MotorcycleStatsCards from "@/components/admin/motorcycles/MotorcycleStatsCards";
import MotorcycleFilters from "@/components/admin/motorcycles/MotorcycleFilters";
import CompactModelBrowser from "@/components/admin/motorcycles/browser/CompactModelBrowser";
import MotorcycleDetailsPanel from "@/components/admin/motorcycles/unified/MotorcycleDetailsPanel";
import MotorcycleQuickActions from "@/components/admin/motorcycles/unified/MotorcycleQuickActions";
import MotorcycleCompletionDashboard from "@/components/admin/motorcycles/unified/MotorcycleCompletionDashboard";

const AdminMotorcycleManagement = () => {
  const [activeTab, setActiveTab] = useState("browse");

  const {
    motorcycles,
    brands,
    stats,
    selectedMotorcycles,
    selectedMotorcycle,
    filters,
    isLoading,
    isUpdating,
    handleFilterChange,
    handleMotorcycleSelect,
    handleToggleSelection,
    handleSelectAll,
    handleClearSelection,
    handleBulkPublish,
    handleBulkUnpublish,
    refetch
  } = useMotorcycleManagement();

  const clearFilters = () => {
    handleFilterChange({
      search: undefined,
      brandId: undefined,
      category: undefined,
      isDraft: undefined
    });
  };

  const handleMotorcycleUpdate = () => {
    refetch();
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
            onClick={refetch}
            disabled={isLoading || isUpdating}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading || isUpdating ? 'animate-spin' : ''}`} />
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
      <MotorcycleStatsCards stats={stats} isLoading={isLoading} />

      {/* Main Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Browse & Edit</TabsTrigger>
          <TabsTrigger value="completion">Data Completion</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Operations</TabsTrigger>
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

          {/* Model Browser */}
          <CompactModelBrowser
            motorcycles={motorcycles}
            selectedMotorcycle={selectedMotorcycle}
            selectedMotorcycles={selectedMotorcycles}
            onSelectMotorcycle={handleMotorcycleSelect}
            onToggleMotorcycleSelection={handleToggleSelection}
            onSelectAll={handleSelectAll}
            onClearSelection={handleClearSelection}
            isLoading={isLoading}
          />

          {/* Details Panel */}
          {selectedMotorcycle && (
            <MotorcycleDetailsPanel
              motorcycle={selectedMotorcycle}
              onUpdate={handleMotorcycleUpdate}
            />
          )}
        </TabsContent>

        <TabsContent value="completion" className="flex-1 mt-4">
          <MotorcycleCompletionDashboard motorcycles={motorcycles} />
        </TabsContent>

        <TabsContent value="bulk" className="flex-1 mt-4">
          <MotorcycleQuickActions
            selectedMotorcycles={selectedMotorcycles.map(id => 
              motorcycles.find(m => m.id === id)
            ).filter(Boolean) as Motorcycle[]}
            onRefresh={refetch}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminMotorcycleManagement;
