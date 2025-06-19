
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
  CheckCircle
} from "lucide-react";
import { useSimpleMotorcycleData } from "@/hooks/useSimpleMotorcycleData";
import SimpleMotorcycleList from "@/components/admin/motorcycles/SimpleMotorcycleList";
import MotorcycleFilters from "@/components/admin/motorcycles/MotorcycleFilters";

const AdminMotorcycleManagement = () => {
  const [activeTab, setActiveTab] = useState("browse");
  
  const {
    motorcycles,
    brands,
    stats,
    filters,
    isLoading,
    error,
    isEnabled,
    handleFilterChange,
    clearFilters,
    refetch
  } = useSimpleMotorcycleData();

  console.log('AdminMotorcycleManagement - Render state:', {
    isEnabled,
    motorcyclesCount: motorcycles.length,
    brandsCount: brands.length,
    isLoading,
    error,
    stats
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

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-explorer-text">Motorcycle Management</h1>
          <p className="text-explorer-text-muted mt-1">
            Simplified interface for motorcycle data management and testing
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
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Models</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <CheckCircle className="h-3 w-3" />
                Database Connected
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
        </div>
      )}

      {/* Main Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Browse & Test</TabsTrigger>
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

          {/* Motorcycle List */}
          <SimpleMotorcycleList
            motorcycles={motorcycles}
            isLoading={isLoading}
            error={error}
            onRefresh={refetch}
          />
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
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Active Filters</h4>
                <pre className="text-xs bg-muted p-2 rounded">
                  {JSON.stringify(filters, null, 2)}
                </pre>
              </div>

              <div>
                <h4 className="font-medium mb-2">Sample Motorcycle Data</h4>
                <pre className="text-xs bg-muted p-2 rounded max-h-40 overflow-auto">
                  {JSON.stringify(motorcycles.slice(0, 2), null, 2)}
                </pre>
              </div>
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
    </div>
  );
};

export default AdminMotorcycleManagement;
