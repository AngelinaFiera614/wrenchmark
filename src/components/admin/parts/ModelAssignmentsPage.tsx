
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Settings, 
  CheckCircle,
  AlertCircle,
  ArrowRight
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ModelCardProps {
  model: any;
  onManage: (modelId: string) => void;
  assignmentStatus: {
    engine: boolean;
    brake_system: boolean;
    frame: boolean;
    suspension: boolean;
    wheel: boolean;
  };
}

const ModelCard: React.FC<ModelCardProps> = ({ model, onManage, assignmentStatus }) => {
  const completedCount = Object.values(assignmentStatus).filter(Boolean).length;
  const totalCount = Object.keys(assignmentStatus).length;
  const completionPercentage = Math.round((completedCount / totalCount) * 100);

  return (
    <Card className="bg-explorer-card border-explorer-chrome/30 hover:border-accent-teal/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="font-medium text-explorer-text mb-1">
              {model.brands?.name} {model.name}
            </div>
            <div className="text-sm text-explorer-text-muted">
              {model.production_start_year}
              {model.production_end_year && ` - ${model.production_end_year}`}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-sm font-medium text-explorer-text">
                {completedCount}/{totalCount}
              </div>
              <div className="text-xs text-explorer-text-muted">
                {completionPercentage}%
              </div>
            </div>
            <div className="w-12 h-2 bg-explorer-chrome/30 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all ${
                  completionPercentage >= 80 ? 'bg-green-400' :
                  completionPercentage >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                }`}
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-wrap gap-1">
            {Object.entries(assignmentStatus).map(([type, assigned]) => (
              <Badge
                key={type}
                variant={assigned ? "default" : "outline"}
                className={`text-xs ${
                  assigned 
                    ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                    : 'border-orange-400/30 text-orange-400'
                }`}
              >
                {assigned ? (
                  <CheckCircle className="h-2 w-2 mr-1" />
                ) : (
                  <AlertCircle className="h-2 w-2 mr-1" />
                )}
                {type.replace('_', ' ')}
              </Badge>
            ))}
          </div>
        </div>
        
        <Button
          onClick={() => onManage(model.id)}
          variant="outline"
          size="sm"
          className="w-full border-explorer-chrome/30 text-explorer-text hover:bg-accent-teal/20 hover:border-accent-teal"
        >
          <Settings className="h-3 w-3 mr-2" />
          Manage Components
          <ArrowRight className="h-3 w-3 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

const ModelAssignmentsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  // Fetch models with assignment status
  const { data: models = [], isLoading } = useQuery({
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
          brands(name)
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
    (Array.isArray(model.brands) && model.brands.length > 0 && 
     model.brands[0].name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleManageModel = (modelId: string) => {
    setSelectedModel(modelId);
    // TODO: Open model component assignment interface
    console.log('Manage model:', modelId);
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-6 bg-explorer-dark">
        <div className="text-center py-12">
          <div className="text-explorer-text-muted">Loading models...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-explorer-dark">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-explorer-text mb-2">
          Model Component Assignments
        </h1>
        <p className="text-explorer-text-muted">
          Set default components for motorcycle models
        </p>
      </div>

      {/* Search and filters */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-explorer-text-muted" />
          <Input
            placeholder="Search models..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-explorer-card border-explorer-chrome/30"
          />
        </div>
      </div>

      {/* Models grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredModels.map((model) => (
          <ModelCard
            key={model.id}
            model={{
              ...model,
              brands: Array.isArray(model.brands) && model.brands.length > 0 
                ? { name: model.brands[0].name }
                : { name: 'Unknown Brand' }
            }}
            onManage={handleManageModel}
            assignmentStatus={getAssignmentStatus(model.id)}
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
    </div>
  );
};

export default ModelAssignmentsPage;
