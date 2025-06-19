
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TestTube, Database, Zap, Settings } from "lucide-react";
import RealDataIntegrityTester from "@/components/admin/testing/RealDataIntegrityTester";

const AdminTestingSuite = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <TestTube className="h-8 w-8 text-accent-teal" />
        <div>
          <h1 className="text-3xl font-bold text-explorer-text">Testing Suite</h1>
          <p className="text-explorer-text-muted">
            Real-time testing and validation tools for data integrity and system health
          </p>
        </div>
      </div>

      <Tabs defaultValue="data-integrity" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="data-integrity" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Data Integrity
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="api-tests" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            API Tests
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            System Health
          </TabsTrigger>
        </TabsList>

        <TabsContent value="data-integrity" className="space-y-6">
          <RealDataIntegrityTester />
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Performance Tests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Performance testing tools will be available here. This will include:
              </p>
              <ul className="list-disc list-inside mt-4 space-y-2 text-sm text-muted-foreground">
                <li>Database query performance benchmarks</li>
                <li>API response time monitoring</li>
                <li>Memory usage analysis</li>
                <li>Load testing simulations</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api-tests" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                API Endpoint Tests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                API testing tools will be available here. This will include:
              </p>
              <ul className="list-disc list-inside mt-4 space-y-2 text-sm text-muted-foreground">
                <li>Supabase API connectivity tests</li>
                <li>Authentication flow validation</li>
                <li>CRUD operation verification</li>
                <li>Edge function testing</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                System Health Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                System health monitoring tools will be available here. This will include:
              </p>
              <ul className="list-disc list-inside mt-4 space-y-2 text-sm text-muted-foreground">
                <li>Authentication system status</li>
                <li>Database connection health</li>
                <li>RLS policy validation</li>
                <li>Security audit checks</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminTestingSuite;
