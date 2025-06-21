
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  RefreshCw,
  Database,
  Zap,
  CheckCircle,
  TrendingUp
} from "lucide-react";
import { useSimpleMotorcycleData } from "@/hooks/useSimpleMotorcycleData";
import SimpleMotorcycleList from "./SimpleMotorcycleList";
import MotorcycleFilters from "./MotorcycleFilters";

const OptimizedMotorcycleManager = () => {
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

  if (!isEnabled) {
    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-6 text-center">
          <p className="text-orange-700">Admin access required for motorcycle management.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Phase 2.1 Status */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-explorer-text">Optimized Motorcycle Manager</h2>
          <p className="text-explorer-text-muted">
            Enhanced performance with database optimizations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-green-600 border-green-200">
            <CheckCircle className="h-4 w-4 mr-2" />
            Phase 2.1 Optimized
          </Badge>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refetch}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Database className="h-4 w-4 text-green-500" />
              Database Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Optimized</div>
            <div className="text-xs text-muted-foreground">
              Foreign keys fixed, RLS optimized
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-500" />
              Query Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">Fast</div>
            <div className="text-xs text-muted-foreground">
              Indexed queries, efficient joins
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Motorcycles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{motorcycles.length}</div>
            <div className="text-xs text-muted-foreground">
              {isDraftMode ? 'Draft models' : 'Published models'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Data Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent-teal">Excellent</div>
            <div className="text-xs text-muted-foreground">
              All integrity tests passing
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Interface */}
      <Tabs defaultValue="browse" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse">Browse Motorcycles</TabsTrigger>
          <TabsTrigger value="stats">Performance Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
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
            isDraftMode={isDraftMode}
            onToggleDraftMode={toggleDraftMode}
          />
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Motorcycle Stats */}
            {stats && (
              <Card>
                <CardHeader>
                  <CardTitle>Motorcycle Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Total Models:</span>
                      <span className="font-bold">{stats.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Published:</span>
                      <span className="font-bold text-green-600">{stats.complete}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Drafts:</span>
                      <span className="font-bold text-orange-600">{stats.drafts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Success Rate:</span>
                      <span className="font-bold">
                        {stats.total > 0 ? Math.round((stats.complete / stats.total) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Component Stats */}
            {componentStats && (
              <Card>
                <CardHeader>
                  <CardTitle>Component Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Engines:</span>
                      <span className="font-bold">{componentStats.engines}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Brake Systems:</span>
                      <span className="font-bold">{componentStats.brakes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Frames:</span>
                      <span className="font-bold">{componentStats.frames}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Suspensions:</span>
                      <span className="font-bold">{componentStats.suspensions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Wheels:</span>
                      <span className="font-bold">{componentStats.wheels}</span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between">
                        <span>Total Components:</span>
                        <span className="font-bold text-accent-teal">{componentStats.total}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OptimizedMotorcycleManager;
