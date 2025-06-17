
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Component,
  Settings,
  Wrench,
  Database,
  Plus,
  BarChart3
} from "lucide-react";
import { useOptimizedAdminData } from "@/hooks/admin/useOptimizedAdminData";

const AdminPartsHub = () => {
  const [activeTab, setActiveTab] = useState("components");
  const { stats, isLoading } = useOptimizedAdminData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-explorer-text">Loading parts data...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-explorer-text">Parts & Components Hub</h1>
          <p className="text-explorer-text-muted mt-1">
            Manage motorcycle components, assignments, and configurations
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="bg-accent-teal text-black hover:bg-accent-teal/80">
            <Plus className="h-4 w-4 mr-2" />
            Add Component
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-explorer-text-muted">Total Components</p>
                <p className="text-2xl font-bold text-explorer-text">247</p>
              </div>
              <div className="h-8 w-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Component className="h-4 w-4 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-explorer-text-muted">Assignments</p>
                <p className="text-2xl font-bold text-accent-teal">89</p>
              </div>
              <div className="h-8 w-8 bg-accent-teal/20 rounded-full flex items-center justify-center">
                <Settings className="h-4 w-4 text-accent-teal" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-explorer-text-muted">Configurations</p>
                <p className="text-2xl font-bold text-orange-400">156</p>
              </div>
              <div className="h-8 w-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                <Wrench className="h-4 w-4 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-explorer-text-muted">Coverage</p>
                <p className="text-2xl font-bold text-green-400">94%</p>
              </div>
              <div className="h-8 w-8 bg-green-500/20 rounded-full flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="components">Components Library</TabsTrigger>
          <TabsTrigger value="assignments">Model Assignments</TabsTrigger>
          <TabsTrigger value="configurations">Configurations</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Operations</TabsTrigger>
        </TabsList>

        <TabsContent value="components" className="mt-6">
          <Card className="bg-explorer-card border-explorer-chrome/30">
            <CardHeader>
              <CardTitle className="text-explorer-text">Components Library</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Component className="h-12 w-12 mx-auto mb-4 text-explorer-text-muted" />
                <p className="text-explorer-text-muted">Components library interface will be integrated here</p>
                <p className="text-sm text-explorer-text-muted mt-2">
                  Manage engines, brakes, frames, suspension, and wheels
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments" className="mt-6">
          <Card className="bg-explorer-card border-explorer-chrome/30">
            <CardHeader>
              <CardTitle className="text-explorer-text">Model Component Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="h-12 w-12 mx-auto mb-4 text-explorer-text-muted" />
                <p className="text-explorer-text-muted">Model assignments interface will be integrated here</p>
                <p className="text-sm text-explorer-text-muted mt-2">
                  Set default components for motorcycle models
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configurations" className="mt-6">
          <Card className="bg-explorer-card border-explorer-chrome/30">
            <CardHeader>
              <CardTitle className="text-explorer-text">Configuration Manager</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Wrench className="h-12 w-12 mx-auto mb-4 text-explorer-text-muted" />
                <p className="text-explorer-text-muted">Configuration management interface will be integrated here</p>
                <p className="text-sm text-explorer-text-muted mt-2">
                  Manage trim configurations and component overrides
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk" className="mt-6">
          <Card className="bg-explorer-card border-explorer-chrome/30">
            <CardHeader>
              <CardTitle className="text-explorer-text">Bulk Operations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Database className="h-12 w-12 mx-auto mb-4 text-explorer-text-muted" />
                <p className="text-explorer-text-muted">Bulk operations interface will be integrated here</p>
                <p className="text-sm text-explorer-text-muted mt-2">
                  Mass assignment and data management tools
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPartsHub;
