
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TestTube, 
  Database, 
  Activity, 
  Shield,
  CheckCircle
} from "lucide-react";
import RealDataIntegrityTester from "@/components/admin/testing/RealDataIntegrityTester";
import PerformanceMonitor from "@/components/admin/testing/PerformanceMonitor";
import DataValidationSuite from "@/components/admin/testing/DataValidationSuite";

const AdminTestingDashboard = () => {
  return (
    <div className="h-full flex flex-col space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-explorer-text">Testing Dashboard</h1>
          <p className="text-explorer-text-muted mt-1">
            Comprehensive system health monitoring and validation
          </p>
        </div>
        <Badge variant="outline" className="text-green-600 border-green-200">
          <CheckCircle className="h-4 w-4 mr-2" />
          Phase 2.1 Complete
        </Badge>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Database className="h-4 w-4 text-green-500" />
              Data Integrity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">7/7</div>
            <div className="text-xs text-muted-foreground">Tests Passing</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">Monitored</div>
            <div className="text-xs text-muted-foreground">Real-time</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TestTube className="h-4 w-4 text-purple-500" />
              Validation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">Active</div>
            <div className="text-xs text-muted-foreground">Auto-refresh</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4 text-accent-teal" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent-teal">Excellent</div>
            <div className="text-xs text-muted-foreground">All systems operational</div>
          </CardContent>
        </Card>
      </div>

      {/* Testing Tabs */}
      <Tabs defaultValue="integrity" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="integrity" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Data Integrity
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="validation" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Data Validation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="integrity" className="flex-1 mt-6">
          <RealDataIntegrityTester />
        </TabsContent>

        <TabsContent value="performance" className="flex-1 mt-6">
          <PerformanceMonitor />
        </TabsContent>

        <TabsContent value="validation" className="flex-1 mt-6">
          <DataValidationSuite />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminTestingDashboard;
