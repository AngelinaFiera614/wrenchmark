
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings,
  Database,
  Shield,
  Wrench,
  FileText,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Download,
  Upload,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSimpleMotorcycleData } from "@/hooks/useSimpleMotorcycleData";

const AdminSystemSettings = () => {
  const [activeTab, setActiveTab] = useState("data");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { motorcycles, refetch } = useSimpleMotorcycleData();

  const handleSetAllDrafts = async () => {
    const currentPublished = motorcycles.filter(m => !m.is_draft).length;
    const currentDrafts = motorcycles.filter(m => m.is_draft).length;
    
    if (currentPublished === 0) {
      toast({
        title: "No Action Needed",
        description: "All motorcycles are already drafts."
      });
      return;
    }

    const confirmMessage = `Are you sure you want to set ALL motorcycles as drafts?\n\nThis will affect:\n• ${currentPublished} published motorcycles → drafts\n• ${currentDrafts} already drafts (no change)\n\nTotal: ${motorcycles.length} motorcycles`;
    
    if (!confirm(confirmMessage)) return;

    setIsProcessing(true);
    console.log('Starting bulk draft update...');

    try {
      const { count: recordsToUpdate, error: countError } = await supabase
        .from('motorcycle_models')
        .select('*', { count: 'exact', head: true })
        .eq('is_draft', false);

      if (countError) throw countError;

      const { data, error } = await supabase
        .from('motorcycle_models')
        .update({ 
          is_draft: true,
          updated_at: new Date().toISOString()
        })
        .eq('is_draft', false)
        .select('id');

      if (error) throw error;

      const updatedCount = data?.length || 0;
      
      toast({
        title: "Bulk Update Complete",
        description: `Successfully set ${updatedCount} motorcycles as drafts.`
      });

      refetch();
    } catch (error) {
      console.error('Error setting all motorcycles as drafts:', error);
      toast({
        title: "Error",
        description: `Failed to set motorcycles as drafts. Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePublishComplete = async () => {
    toast({
      title: "Feature Coming Soon",
      description: "Bulk publish complete motorcycles will be available soon."
    });
  };

  const handleDataCleanup = async () => {
    toast({
      title: "Feature Coming Soon", 
      description: "Data cleanup tools will be available soon."
    });
  };

  const systemStats = {
    totalModels: motorcycles.length,
    publishedModels: motorcycles.filter(m => !m.is_draft).length,
    draftModels: motorcycles.filter(m => m.is_draft).length,
    completenessAverage: 75 // This would be calculated from actual data
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-explorer-text">System Settings</h1>
          <p className="text-explorer-text-muted mt-1">
            Manage system-wide settings, data operations, and maintenance tools
          </p>
        </div>
      </div>

      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-explorer-text-muted">Total Models</p>
                <p className="text-2xl font-bold text-explorer-text">{systemStats.totalModels}</p>
              </div>
              <Database className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-explorer-text-muted">Published</p>
                <p className="text-2xl font-bold text-green-400">{systemStats.publishedModels}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-explorer-text-muted">Drafts</p>
                <p className="text-2xl font-bold text-orange-400">{systemStats.draftModels}</p>
              </div>
              <FileText className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-explorer-text-muted">Avg. Complete</p>
                <p className="text-2xl font-bold text-accent-teal">{systemStats.completenessAverage}%</p>
              </div>
              <Shield className="h-8 w-8 text-accent-teal" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="data">Data Management</TabsTrigger>
          <TabsTrigger value="health">System Health</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="data" className="mt-6 space-y-6">
          <Card className="bg-explorer-card border-explorer-chrome/30">
            <CardHeader>
              <CardTitle className="text-explorer-text flex items-center gap-2">
                <Database className="h-5 w-5" />
                Bulk Data Operations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-explorer-text">Publishing Controls</h4>
                  <Button
                    onClick={handleSetAllDrafts}
                    disabled={isProcessing}
                    className="w-full text-orange-600 border-orange-200 hover:bg-orange-50"
                    variant="outline"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        Set All as Drafts
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handlePublishComplete}
                    className="w-full text-green-600 border-green-200 hover:bg-green-50"
                    variant="outline"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Publish Complete Models
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-explorer-text">Data Operations</h4>
                  <Button
                    onClick={handleDataCleanup}
                    className="w-full text-red-600 border-red-200 hover:bg-red-50"
                    variant="outline"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clean Up Incomplete Data
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export All Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="mt-6">
          <Card className="bg-explorer-card border-explorer-chrome/30">
            <CardHeader>
              <CardTitle className="text-explorer-text flex items-center gap-2">
                <Shield className="h-5 w-5" />
                System Health Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center py-8">
              <Settings className="h-12 w-12 mx-auto mb-4 text-explorer-text-muted" />
              <p className="text-explorer-text-muted">System health monitoring will be available here</p>
              <p className="text-sm text-explorer-text-muted mt-2">
                Database performance, API status, and system metrics
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <Card className="bg-explorer-card border-explorer-chrome/30">
            <CardHeader>
              <CardTitle className="text-explorer-text flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center py-8">
              <Shield className="h-12 w-12 mx-auto mb-4 text-explorer-text-muted" />
              <p className="text-explorer-text-muted">Security settings will be available here</p>
              <p className="text-sm text-explorer-text-muted mt-2">
                Admin permissions, audit logs, and security policies
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="mt-6">
          <Card className="bg-explorer-card border-explorer-chrome/30">
            <CardHeader>
              <CardTitle className="text-explorer-text flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Maintenance Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center py-8">
              <Wrench className="h-12 w-12 mx-auto mb-4 text-explorer-text-muted" />
              <p className="text-explorer-text-muted">Maintenance tools will be available here</p>
              <p className="text-sm text-explorer-text-muted mt-2">
                Cache clearing, data validation, and system maintenance
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSystemSettings;
