
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnalyticsDashboard from "@/components/admin/analytics/AnalyticsDashboard";
import WorkflowManager from "@/components/admin/workflow/WorkflowManager";
import AIRecommendations from "@/components/admin/ai/AIRecommendations";
import { BarChart, GitBranch, Sparkles } from "lucide-react";

const AdminAnalytics = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-explorer-text mb-2">Analytics & Intelligence</h1>
          <p className="text-explorer-text-muted">
            Advanced analytics, workflow management, and AI-powered insights for motorcycle configurations.
          </p>
        </div>
      </div>

      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Analytics Dashboard
          </TabsTrigger>
          <TabsTrigger value="workflow" className="flex items-center gap-2">
            <GitBranch className="h-4 w-4" />
            Workflow Management
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            AI Recommendations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          <AnalyticsDashboard />
        </TabsContent>

        <TabsContent value="workflow" className="space-y-6">
          <WorkflowManager />
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          <AIRecommendations />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAnalytics;
