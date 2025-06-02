
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Database, Loader2, CheckCircle, AlertTriangle, Zap } from "lucide-react";
import { generateModelYearsEnhanced } from "@/services/models/modelYearGeneration";
import { MotorcycleModel, ModelYear } from "@/types/motorcycle";

interface DataGenerationPanelProps {
  selectedModel: MotorcycleModel | null;
  modelYears: ModelYear[];
  onDataGenerated: () => void;
}

const DataGenerationPanel = ({
  selectedModel,
  modelYears,
  onDataGenerated
}: DataGenerationPanelProps) => {
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);
  const [options, setOptions] = useState({
    includeHistorical: true,
    createDefaultTrims: true,
    overwriteExisting: false
  });

  const hasExistingData = modelYears && modelYears.length > 0;
  const dataCompleteness = calculateDataCompleteness();

  function calculateDataCompleteness() {
    if (!selectedModel) return 0;
    
    const currentYear = new Date().getFullYear();
    const expectedYears = selectedModel.production_status === 'active' 
      ? currentYear - (selectedModel.production_start_year || currentYear) + 1
      : (selectedModel.production_end_year || currentYear) - (selectedModel.production_start_year || currentYear) + 1;
    
    const existingYears = modelYears?.length || 0;
    
    return Math.min(100, Math.round((existingYears / Math.max(1, expectedYears)) * 100));
  }

  const handleGenerate = async () => {
    if (!selectedModel) return;

    setGenerating(true);
    
    try {
      const success = await generateModelYearsEnhanced(selectedModel.id, {
        includeHistorical: options.includeHistorical,
        createDefaultTrims: options.createDefaultTrims,
        batchSize: 10
      });

      if (success) {
        toast({
          title: "Data Generation Complete",
          description: `Successfully generated years and trim levels for ${selectedModel.name}`,
          action: <CheckCircle className="h-4 w-4 text-green-500" />
        });
        onDataGenerated();
      } else {
        throw new Error("Generation failed");
      }
    } catch (error) {
      console.error("Data generation error:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Failed to generate model years and trim levels. Please try again.",
        action: <AlertTriangle className="h-4 w-4 text-red-500" />
      });
    } finally {
      setGenerating(false);
    }
  };

  if (!selectedModel) {
    return (
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Generation
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <Database className="h-12 w-12 text-explorer-text-muted mx-auto mb-4" />
          <p className="text-explorer-text-muted">
            Select a model to generate or update data
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardHeader>
        <CardTitle className="text-explorer-text flex items-center gap-2">
          <Database className="h-5 w-5" />
          Data Generation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Model Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-explorer-text">
              {selectedModel.name}
            </span>
            <Badge variant={dataCompleteness >= 80 ? "default" : "secondary"}>
              {dataCompleteness}% Complete
            </Badge>
          </div>
          <div className="text-xs text-explorer-text-muted">
            Production: {selectedModel.production_start_year}
            {selectedModel.production_end_year && ` - ${selectedModel.production_end_year}`}
            {selectedModel.production_status === 'active' && ' (Active)'}
          </div>
        </div>

        {/* Current Data Status */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-explorer-text">Current Data</div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-explorer-text-muted">Model Years:</span>
              <span className="ml-2 text-explorer-text">{modelYears?.length || 0}</span>
            </div>
            <div>
              <span className="text-explorer-text-muted">Trim Levels:</span>
              <span className="ml-2 text-explorer-text">
                {modelYears?.reduce((sum, year) => sum + (year.configurations?.length || 0), 0) || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Generation Options */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-explorer-text">Generation Options</div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="historical"
                checked={options.includeHistorical}
                onCheckedChange={(checked) => 
                  setOptions(prev => ({ ...prev, includeHistorical: !!checked }))
                }
              />
              <label htmlFor="historical" className="text-sm text-explorer-text">
                Include historical years (2010+)
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="trims"
                checked={options.createDefaultTrims}
                onCheckedChange={(checked) => 
                  setOptions(prev => ({ ...prev, createDefaultTrims: !!checked }))
                }
              />
              <label htmlFor="trims" className="text-sm text-explorer-text">
                Generate realistic trim levels
              </label>
            </div>
            
            {hasExistingData && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="overwrite"
                  checked={options.overwriteExisting}
                  onCheckedChange={(checked) => 
                    setOptions(prev => ({ ...prev, overwriteExisting: !!checked }))
                  }
                />
                <label htmlFor="overwrite" className="text-sm text-explorer-text">
                  Update existing data
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Generation Actions */}
        <div className="space-y-2">
          <Button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full bg-accent-teal text-black hover:bg-accent-teal/80"
          >
            {generating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Data...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                {hasExistingData ? 'Update Data' : 'Generate Data'}
              </>
            )}
          </Button>
          
          {hasExistingData && (
            <p className="text-xs text-explorer-text-muted text-center">
              This will add missing years and trim levels
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DataGenerationPanel;
