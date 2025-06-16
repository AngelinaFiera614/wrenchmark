
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Palette, Database } from "lucide-react";
import ConsolidatedAdminPartsLayout from "@/components/admin/parts/ConsolidatedAdminPartsLayout";
import AnalyticsPanel from "@/components/admin/parts/consolidated/AnalyticsPanel";
import BulkOperationsPanel from "@/components/admin/parts/consolidated/BulkOperationsPanel";

const AdminParts = () => {
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
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="bulk" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Bulk Ops
          </TabsTrigger>
        </TabsList>

        <TabsContent value="management" className="mt-6">
          <ConsolidatedAdminPartsLayout />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <AnalyticsPanel
            models={[]}
            configurations={[]}
            completeness={{ percentage: 0, issues: [] }}
          />
        </TabsContent>

        <TabsContent value="bulk" className="mt-6">
          <BulkOperationsPanel
            configurations={[]}
            selectedConfigs={new Set()}
            onSelectionChange={() => {}}
            onBulkOperation={handleBulkOperation}
            isVisible={false}
            onClose={() => {}}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminParts;
