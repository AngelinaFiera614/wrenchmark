
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Database, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw, 
  Zap,
  BarChart3 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  performDataHealthCheck, 
  fixIncompleteModel,
  type DataHealthReport 
} from "@/services/dataHealthCheck";
import { generateMissingModelData } from "@/services/motorcycleServiceEnhanced";

const DataHealthDashboard = () => {
  const { toast } = useToast();
  const [healthReport, setHealthReport] = useState<DataHealthReport | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [fixingModelId, setFixingModelId] = useState<string | null>(null);

  const runHealthCheck = async () => {
    setIsChecking(true);
    try {
      const report = await performDataHealthCheck();
      setHealthReport(report);
      
      toast({
        title: "Health Check Complete",
        description: `${report.completenessPercentage}% of models have complete data`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Health Check Failed",
        description: "Failed to analyze data completeness",
      });
    } finally {
      setIsChecking(false);
    }
  };

  const generateAllMissingData = async () => {
    setIsFixing(true);
    try {
      const result = await generateMissingModelData();
      
      toast({
        title: "Batch Data Generation Complete",
        description: `Generated data for ${result.success} models. ${result.failed.length} failed.`,
      });
      
      // Refresh health check
      await runHealthCheck();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Batch Generation Failed",
        description: "Failed to generate missing data",
      });
    } finally {
      setIsFixing(false);
    }
  };

  const fixSingleModel = async (modelId: string) => {
    setFixingModelId(modelId);
    try {
      const success = await fixIncompleteModel(modelId);
      
      if (success) {
        toast({
          title: "Model Fixed",
          description: "Successfully generated missing data for this model",
        });
        await runHealthCheck();
      } else {
        throw new Error("Fix failed");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Fix Failed",
        description: "Failed to fix this model",
      });
    } finally {
      setFixingModelId(null);
    }
  };

  useEffect(() => {
    runHealthCheck();
  }, []);

  return (
    <div className="space-y-6">
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Data Health Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Health Summary */}
          {healthReport && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-explorer-text">
                  {healthReport.totalModels}
                </div>
                <div className="text-sm text-explorer-text-muted">Total Models</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {healthReport.modelsWithComponents}
                </div>
                <div className="text-sm text-explorer-text-muted">Complete</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">
                  {healthReport.incompleteModels.length}
                </div>
                <div className="text-sm text-explorer-text-muted">Incomplete</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-teal">
                  {healthReport.completenessPercentage}%
                </div>
                <div className="text-sm text-explorer-text-muted">Complete</div>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          {healthReport && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-explorer-text">Data Completeness</span>
                <span className="text-explorer-text">{healthReport.completenessPercentage}%</span>
              </div>
              <Progress 
                value={healthReport.completenessPercentage} 
                className="w-full"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={runHealthCheck}
              disabled={isChecking}
              variant="outline"
              className="bg-explorer-card border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
            >
              {isChecking ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Database className="mr-2 h-4 w-4" />
              )}
              Refresh Check
            </Button>
            
            <Button
              onClick={generateAllMissingData}
              disabled={isFixing || !healthReport?.incompleteModels.length}
              className="bg-accent-teal text-black hover:bg-accent-teal/80"
            >
              {isFixing ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Zap className="mr-2 h-4 w-4" />
              )}
              Generate Missing Data
            </Button>
          </div>

          {/* Health Status */}
          {healthReport && (
            <div className="space-y-2">
              {healthReport.completenessPercentage >= 90 ? (
                <Alert className="bg-green-500/20 border-green-500/30">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <AlertDescription className="text-green-400">
                    Excellent! Most models have complete configuration data.
                  </AlertDescription>
                </Alert>
              ) : healthReport.completenessPercentage >= 70 ? (
                <Alert className="bg-yellow-500/20 border-yellow-500/30">
                  <AlertTriangle className="h-4 w-4 text-yellow-400" />
                  <AlertDescription className="text-yellow-400">
                    Good progress, but some models need configuration data.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="bg-red-500/20 border-red-500/30">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-400">
                    Many models are missing configuration data. Run batch generation.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Incomplete Models List */}
          {healthReport?.incompleteModels.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-explorer-text">
                Incomplete Models ({healthReport.incompleteModels.length})
              </h4>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {healthReport.incompleteModels.slice(0, 10).map((model) => (
                  <div
                    key={model.id}
                    className="flex items-center justify-between p-3 bg-explorer-dark/50 rounded"
                  >
                    <div>
                      <div className="font-medium text-explorer-text">{model.name}</div>
                      <div className="flex gap-1 mt-1">
                        {model.issues.map((issue, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {issue}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => fixSingleModel(model.id)}
                      disabled={fixingModelId === model.id}
                      className="bg-accent-teal text-black hover:bg-accent-teal/80"
                    >
                      {fixingModelId === model.id ? (
                        <RefreshCw className="h-3 w-3 animate-spin" />
                      ) : (
                        "Fix"
                      )}
                    </Button>
                  </div>
                ))}
                {healthReport.incompleteModels.length > 10 && (
                  <div className="text-center text-sm text-explorer-text-muted">
                    + {healthReport.incompleteModels.length - 10} more models
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DataHealthDashboard;
