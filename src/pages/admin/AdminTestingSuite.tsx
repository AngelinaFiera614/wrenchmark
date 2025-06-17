
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TestTube,
  Database,
  Zap,
  BarChart3,
  Play,
  RefreshCw
} from "lucide-react";
import ComponentTestingSuite from "@/components/admin/parts/testing/ComponentTestingSuite";
import DataIntegrityTester from "@/components/admin/parts/testing/DataIntegrityTester";
import PerformanceTester from "@/components/admin/parts/testing/PerformanceTester";
import AdminFunctionTester from "@/components/admin/testing/AdminFunctionTester";

const AdminTestingSuite = () => {
  const [activeTab, setActiveTab] = useState("admin-functions");

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-explorer-text">Testing Suite</h1>
          <p className="text-explorer-text-muted mt-1">
            Comprehensive testing framework for admin functions and data validation
          </p>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="admin-functions">
            <TestTube className="h-4 w-4 mr-2" />
            Admin Functions
          </TabsTrigger>
          <TabsTrigger value="data-integrity">
            <Database className="h-4 w-4 mr-2" />
            Data Integrity
          </TabsTrigger>
          <TabsTrigger value="components">
            <Zap className="h-4 w-4 mr-2" />
            Components
          </TabsTrigger>
          <TabsTrigger value="performance">
            <BarChart3 className="h-4 w-4 mr-2" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="admin-functions" className="mt-6">
          <AdminFunctionTester />
        </TabsContent>

        <TabsContent value="data-integrity" className="mt-6">
          <DataIntegrityTester />
        </TabsContent>

        <TabsContent value="components" className="mt-6">
          <ComponentTestingSuite />
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <PerformanceTester />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminTestingSuite;
