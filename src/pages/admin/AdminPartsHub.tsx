
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Component,
  Database,
  BarChart3,
  Palette,
  Image,
  Info
} from "lucide-react";
import { useOptimizedAdminData } from "@/hooks/admin/useOptimizedAdminData";
import ComponentsLibraryPage from "@/components/admin/parts/ComponentsLibraryPage";
import BulkOperationsPage from "@/components/admin/parts/BulkOperationsPage";
import MediaLibraryManager from "@/components/admin/media/MediaLibraryManager";
import ColorOptionsManager from "@/components/admin/colors/ColorOptionsManager";

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
      {/* Header with clarified purpose */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-explorer-text">Component Library Hub</h1>
          <p className="text-explorer-text-muted mt-1">
            Manage component definitions and media resources
          </p>
          <div className="mt-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-400">
                <strong>Component Assignment:</strong> Components are assigned to motorcycles in the 
                <strong> Motorcycle Management</strong> section. This hub is for creating and managing 
                component definitions.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simplified Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <p className="text-sm text-explorer-text-muted">Media Files</p>
                <p className="text-2xl font-bold text-accent-teal">156</p>
              </div>
              <div className="h-8 w-8 bg-accent-teal/20 rounded-full flex items-center justify-center">
                <Image className="h-4 w-4 text-accent-teal" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-explorer-text-muted">Color Variants</p>
                <p className="text-2xl font-bold text-purple-400">89</p>
              </div>
              <div className="h-8 w-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                <Palette className="h-4 w-4 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Streamlined Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="components">Component Library</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Operations</TabsTrigger>
          <TabsTrigger value="media">Media Library</TabsTrigger>
          <TabsTrigger value="colors">Color Management</TabsTrigger>
        </TabsList>

        <TabsContent value="components" className="mt-6">
          <ComponentsLibraryPage />
        </TabsContent>

        <TabsContent value="bulk" className="mt-6">
          <BulkOperationsPage />
        </TabsContent>

        <TabsContent value="media" className="mt-6">
          <MediaLibraryManager />
        </TabsContent>

        <TabsContent value="colors" className="mt-6">
          <ColorOptionsManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPartsHub;
