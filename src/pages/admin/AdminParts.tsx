
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Palette, Database } from "lucide-react";
import ConsolidatedAdminPartsLayout from "@/components/admin/parts/consolidated/ConsolidatedAdminPartsLayout";
import ColorManagementPanel from "@/components/admin/parts/consolidated/ColorManagementPanel";
import BulkOperationsPanel from "@/components/admin/parts/consolidated/BulkOperationsPanel";

const AdminParts = () => {
  const [selectedConfigs, setSelectedConfigs] = useState<Set<string>>(new Set());
  const [showBulkOps, setShowBulkOps] = useState(false);

  const handleBulkOperation = (operation: string, configs: any[]) => {
    console.log("Bulk operation:", operation, "on", configs.length, "configurations");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-explorer-text">Parts & Configurations</h1>
          <p className="text-explorer-text-muted">
            Manage motorcycle components, model years, and configurations
          </p>
        </div>
      </div>

      <Tabs defaultValue="management" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="management" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Management
          </TabsTrigger>
          <TabsTrigger value="colors" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Colors
          </TabsTrigger>
          <TabsTrigger value="bulk" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Bulk Ops
          </TabsTrigger>
        </TabsList>

        <TabsContent value="management" className="mt-6">
          <ConsolidatedAdminPartsLayout />
        </TabsContent>

        <TabsContent value="colors" className="mt-6">
          <Card className="bg-explorer-card border-explorer-chrome/30">
            <CardHeader>
              <CardTitle className="text-explorer-text">Color Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-explorer-text-muted mb-4">
                Select a model and year from the Management tab to manage colors.
              </p>
              <ColorManagementPanel
                onColorAssigned={() => console.log("Color assigned")}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk" className="mt-6">
          <Card className="bg-explorer-card border-explorer-chrome/30">
            <CardHeader>
              <CardTitle className="text-explorer-text">Bulk Operations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-explorer-text-muted mb-4">
                Perform bulk operations on multiple configurations at once.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-explorer-dark border-explorer-chrome/30">
                  <CardContent className="p-4 text-center">
                    <Database className="h-8 w-8 text-accent-teal mx-auto mb-2" />
                    <h3 className="font-medium text-explorer-text">Assign Components</h3>
                    <p className="text-sm text-explorer-text-muted">Bulk assign components to multiple configurations</p>
                  </CardContent>
                </Card>
                <Card className="bg-explorer-dark border-explorer-chrome/30">
                  <CardContent className="p-4 text-center">
                    <Settings className="h-8 w-8 text-accent-teal mx-auto mb-2" />
                    <h3 className="font-medium text-explorer-text">Copy Configurations</h3>
                    <p className="text-sm text-explorer-text-muted">Duplicate configurations across model years</p>
                  </CardContent>
                </Card>
                <Card className="bg-explorer-dark border-explorer-chrome/30">
                  <CardContent className="p-4 text-center">
                    <Palette className="h-8 w-8 text-accent-teal mx-auto mb-2" />
                    <h3 className="font-medium text-explorer-text">Import/Export</h3>
                    <p className="text-sm text-explorer-text-muted">Import or export configuration data</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <BulkOperationsPanel
        configurations={[]}
        selectedConfigs={selectedConfigs}
        onSelectionChange={setSelectedConfigs}
        onBulkOperation={handleBulkOperation}
        isVisible={showBulkOps}
        onClose={() => setShowBulkOps(false)}
      />
    </div>
  );
};

export default AdminParts;
