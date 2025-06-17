
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Plus, 
  Filter, 
  Download, 
  Upload,
  CheckCircle,
  AlertCircle,
  Clock,
  Eye,
  Edit3,
  RefreshCw
} from "lucide-react";
import { fetchAllMotorcyclesForAdmin } from "@/services/motorcycles/adminQueries";
import { calculateDataCompleteness } from "@/utils/dataCompleteness";
import { Motorcycle } from "@/types";
import MotorcycleModelBrowser from "@/components/admin/motorcycles/unified/MotorcycleModelBrowser";
import MotorcycleDetailsPanel from "@/components/admin/motorcycles/unified/MotorcycleDetailsPanel";
import MotorcycleQuickActions from "@/components/admin/motorcycles/unified/MotorcycleQuickActions";
import MotorcycleCompletionDashboard from "@/components/admin/motorcycles/unified/MotorcycleCompletionDashboard";

const AdminMotorcycleManagement = () => {
  const [selectedMotorcycle, setSelectedMotorcycle] = useState<Motorcycle | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("browse");
  const [filterStatus, setFilterStatus] = useState<"all" | "draft" | "published" | "incomplete">("all");

  const { data: motorcycles, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["admin-motorcycle-management"],
    queryFn: fetchAllMotorcyclesForAdmin,
    refetchOnWindowFocus: false
  });

  const filteredMotorcycles = motorcycles?.filter(motorcycle => {
    const matchesSearch = searchQuery === "" || 
      motorcycle.make?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      motorcycle.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      motorcycle.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      motorcycle.category?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "draft" && motorcycle.is_draft) ||
      (filterStatus === "published" && !motorcycle.is_draft) ||
      (filterStatus === "incomplete" && calculateDataCompleteness(motorcycle).completionPercentage < 100);

    return matchesSearch && matchesStatus;
  }) || [];

  const stats = {
    total: motorcycles?.length || 0,
    published: motorcycles?.filter(m => !m.is_draft).length || 0,
    drafts: motorcycles?.filter(m => m.is_draft).length || 0,
    incomplete: motorcycles?.filter(m => calculateDataCompleteness(m).completionPercentage < 100).length || 0
  };

  const handleRefresh = () => {
    refetch();
    // Clear selection to force refresh of details panel
    setSelectedMotorcycle(null);
  };

  const handleMotorcycleUpdate = () => {
    refetch();
    // Refresh the selected motorcycle data
    if (selectedMotorcycle && motorcycles) {
      const updatedMotorcycle = motorcycles.find(m => m.id === selectedMotorcycle.id);
      if (updatedMotorcycle) {
        setSelectedMotorcycle(updatedMotorcycle);
      }
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-explorer-text">Motorcycle Management</h1>
          <p className="text-explorer-text-muted mt-1">
            Unified interface for managing all motorcycle data, specifications, and components
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

        <TabsContent value="browse" className="flex-1 flex flex-col mt-4">
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-explorer-text-muted h-4 w-4" />
              <Input
                placeholder="Search motorcycles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-explorer-dark border-explorer-chrome/30"
              />
            </div>
            <div className="flex gap-2">
              {["all", "published", "draft", "incomplete"].map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus(status as any)}
                  className={filterStatus === status ? "bg-accent-teal text-black" : ""}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Model Browser */}
            <div className="lg:col-span-1">
              <MotorcycleModelBrowser
                motorcycles={filteredMotorcycles}
                selectedMotorcycle={selectedMotorcycle}
                onSelectMotorcycle={setSelectedMotorcycle}
                isLoading={isLoading}
                onRefresh={handleRefresh}
              />
            </div>

            {/* Details Panel */}
            <div className="lg:col-span-2">
              {selectedMotorcycle ? (
                <MotorcycleDetailsPanel
                  motorcycle={selectedMotorcycle}
                  onUpdate={handleMotorcycleUpdate}
                />
              ) : (
                <Card className="bg-explorer-card border-explorer-chrome/30 h-full">
                  <CardContent className="p-8 flex items-center justify-center h-full">
                    <div className="text-center">
                      <Edit3 className="h-12 w-12 text-explorer-text-muted mx-auto mb-4" />
                      <p className="text-explorer-text-muted">
                        Select a motorcycle from the list to view and edit details
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="completion" className="flex-1 mt-4">
          <MotorcycleCompletionDashboard motorcycles={motorcycles || []} />
        </TabsContent>

        <TabsContent value="bulk" className="flex-1 mt-4">
          <MotorcycleQuickActions
            selectedMotorcycles={selectedMotorcycle ? [selectedMotorcycle] : []}
            onRefresh={handleRefresh}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminMotorcycleManagement;
