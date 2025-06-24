
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Settings, CheckCircle, AlertCircle, ArrowDown, Wrench } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ModelAssignmentCard from "./assignment/ModelAssignmentCard";
import ComponentAssignmentDialog from "./assignment/ComponentAssignmentDialog";
import BulkAssignmentDialog from "./assignment/BulkAssignmentDialog";

const ModelAssignmentInterface = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModel, setSelectedModel] = useState<any>(null);
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("models");

  // Fetch models with assignment status
  const { data: models = [], isLoading, refetch } = useQuery({
    queryKey: ['models-with-assignments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('motorcycle_models')
        .select(`
          id,
          name,
          slug,
          production_start_year,
          production_end_year,
          brands(name),
          type
        `)
        .eq('is_draft', false)
        .order('name');

      if (error) throw error;
      return data || [];
    }
  });

  // Fetch assignment status for all models
  const { data: assignments = [] } = useQuery({
    queryKey: ['model-assignments-status'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('model_component_assignments')
        .select('model_id, component_type');

      if (error) throw error;
      return data || [];
    }
  });

  const getAssignmentStatus = (modelId: string) => {
    const modelAssignments = assignments.filter(a => a.model_id === modelId);
    return {
      engine: modelAssignments.some(a => a.component_type === 'engine'),
      brake_system: modelAssignments.some(a => a.component_type === 'brake_system'),
      frame: modelAssignments.some(a => a.component_type === 'frame'),
      suspension: modelAssignments.some(a => a.component_type === 'suspension'),
      wheel: modelAssignments.some(a => a.component_type === 'wheel')
    };
  };

  const filteredModels = models.filter(model =>
    model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (model.brands?.[0]?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCompletionStats = () => {
    const totalModels = filteredModels.length;
    const fullyAssigned = filteredModels.filter(model => {
      const status = getAssignmentStatus(model.id);
      return Object.values(status).every(Boolean);
    }).length;
    
    return {
      total: totalModels,
      complete: fullyAssigned,
      incomplete: totalModels - fullyAssigned,
      percentage: totalModels > 0 ? Math.round((fullyAssigned / totalModels) * 100) : 0
    };
  };

  const stats = getCompletionStats();

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-teal"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-explorer-text flex items-center gap-2">
            <Wrench className="h-6 w-6 text-accent-teal" />
            Model Component Assignments
          </h1>
          <p className="text-explorer-text-muted mt-1">
            Set default components for motorcycle models
          </p>
        </div>
        <Button
          onClick={() => setShowBulkDialog(true)}
          className="bg-accent-teal text-black hover:bg-accent-teal/80"
        >
          <Settings className="mr-2 h-4 w-4" />
          Bulk Operations
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-explorer-text">{stats.total}</div>
            <div className="text-sm text-explorer-text-muted">Total Models</div>
          </CardContent>
        </Card>
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-400">{stats.complete}</div>
            <div className="text-sm text-explorer-text-muted">Fully Assigned</div>
          </CardContent>
        </Card>
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-400">{stats.incomplete}</div>
            <div className="text-sm text-explorer-text-muted">Incomplete</div>
          </CardContent>
        </Card>
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-accent-teal">{stats.percentage}%</div>
            <div className="text-sm text-explorer-text-muted">Completion Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Inheritance Info */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <ArrowDown className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200">
                Component Inheritance System
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Components assigned at the model level become defaults for all trim levels. 
                Individual configurations can override these defaults when needed.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="models">Model Assignments</TabsTrigger>
          <TabsTrigger value="overview">Assignment Overview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="models" className="space-y-6">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-explorer-text-muted" />
            <Input
              placeholder="Search models..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-explorer-card border-explorer-chrome/30"
            />
          </div>

          {/* Models Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredModels.map((model) => (
              <ModelAssignmentCard
                key={model.id}
                model={model}
                assignmentStatus={getAssignmentStatus(model.id)}
                onManage={() => setSelectedModel(model)}
              />
            ))}
          </div>

          {filteredModels.length === 0 && (
            <div className="text-center py-12">
              <div className="text-explorer-text-muted">
                {searchTerm ? 'No models found matching your search' : 'No models available'}
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="overview" className="space-y-6">
          <Card className="bg-explorer-card border-explorer-chrome/30">
            <CardHeader>
              <CardTitle>Assignment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-explorer-text-muted">
                  Overview of component assignments across all models
                </div>
                {/* Add summary charts/tables here in future */}
                <div className="text-center py-8 text-explorer-text-muted">
                  Assignment analytics coming soon...
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Component Assignment Dialog */}
      {selectedModel && (
        <ComponentAssignmentDialog
          open={!!selectedModel}
          onClose={() => setSelectedModel(null)}
          model={selectedModel}
          onSuccess={() => {
            refetch();
            setSelectedModel(null);
          }}
        />
      )}

      {/* Bulk Assignment Dialog */}
      <BulkAssignmentDialog
        open={showBulkDialog}
        onClose={() => setShowBulkDialog(false)}
        models={filteredModels}
        onSuccess={() => {
          refetch();
          setShowBulkDialog(false);
        }}
      />
    </div>
  );
};

export default ModelAssignmentInterface;
