
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Configuration } from "@/types/motorcycle";
import EnhancedTrimLevelManagerPhase2 from "./EnhancedTrimLevelManagerPhase2";
import AIRecommendations from "@/components/admin/ai/AIRecommendations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, History, BarChart } from "lucide-react";
import { trackUserAction, calculateDataQuality, detectAnomalies } from "@/services/analytics/analyticsService";
import { getWorkflowStatus, createWorkflow } from "@/services/workflow/workflowService";

interface EnhancedTrimLevelManagerPhase3Props {
  modelYearId: string;
  configurations: Configuration[];
  selectedConfig: string | null;
  selectedModelData?: any;
  selectedYearData?: any;
  selectedConfigData?: any;
  onConfigSelect: (configId: string) => void;
  onConfigChange: () => void;
}

const EnhancedTrimLevelManagerPhase3 = ({
  modelYearId,
  configurations,
  selectedConfig,
  selectedModelData,
  selectedYearData,
  selectedConfigData,
  onConfigSelect,
  onConfigChange
}: EnhancedTrimLevelManagerPhase3Props) => {
  const { toast } = useToast();
  const [qualityScore, setQualityScore] = useState<number | null>(null);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [workflowStatus, setWorkflowStatus] = useState<any>(null);
  const [activePhase3Tab, setActivePhase3Tab] = useState("management");

  useEffect(() => {
    if (selectedConfig) {
      trackUserAction(selectedConfig, 'view');
      loadConfigurationInsights();
    }
  }, [selectedConfig]);

  const loadConfigurationInsights = async () => {
    if (!selectedConfig) return;

    try {
      const [quality, anomalyList, workflow] = await Promise.all([
        calculateDataQuality(selectedConfig),
        detectAnomalies(selectedConfig),
        getWorkflowStatus(selectedConfig)
      ]);

      if (quality) {
        setQualityScore(quality.overall_score);
      }
      
      setAnomalies(anomalyList);
      setWorkflowStatus(workflow);

      // Create workflow if it doesn't exist
      if (!workflow) {
        await createWorkflow(selectedConfig);
      }
    } catch (error) {
      console.error('Error loading configuration insights:', error);
    }
  };

  const handleConfigSelect = (configId: string) => {
    trackUserAction(configId, 'view');
    onConfigSelect(configId);
  };

  const getQualityColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getQualityLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  return (
    <div className="space-y-6">
      <Tabs value={activePhase3Tab} onValueChange={setActivePhase3Tab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="management">Configuration Management</TabsTrigger>
          <TabsTrigger value="ai">AI Insights</TabsTrigger>
          <TabsTrigger value="quality">Quality Analysis</TabsTrigger>
          <TabsTrigger value="workflow">Workflow Status</TabsTrigger>
        </TabsList>

        <TabsContent value="management" className="space-y-6">
          <EnhancedTrimLevelManagerPhase2
            modelYearId={modelYearId}
            configurations={configurations}
            selectedConfig={selectedConfig}
            selectedModelData={selectedModelData}
            selectedYearData={selectedYearData}
            selectedConfigData={selectedConfigData}
            onConfigSelect={handleConfigSelect}
            onConfigChange={onConfigChange}
          />
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          <AIRecommendations
            modelYearId={modelYearId}
            motorcycleCategory={selectedModelData?.category}
          />
        </TabsContent>

        <TabsContent value="quality" className="space-y-6">
          {selectedConfig ? (
            <div className="space-y-4">
              {/* Data Quality Score */}
              <Card className="bg-explorer-card border-explorer-chrome/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-explorer-text">
                    <BarChart className="h-5 w-5 text-accent-teal" />
                    Data Quality Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {qualityScore !== null ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-explorer-text">Overall Quality Score</span>
                        <div className="flex items-center space-x-2">
                          <span className={`text-lg font-bold ${getQualityColor(qualityScore)}`}>
                            {qualityScore.toFixed(1)}%
                          </span>
                          <Badge className={getQualityColor(qualityScore)}>
                            {getQualityLabel(qualityScore)}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            qualityScore >= 80 ? 'bg-green-400' :
                            qualityScore >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                          }`}
                          style={{ width: `${qualityScore}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-explorer-text-muted">Loading quality analysis...</p>
                  )}
                </CardContent>
              </Card>

              {/* Anomaly Detection */}
              <Card className="bg-explorer-card border-explorer-chrome/30">
                <CardHeader>
                  <CardTitle className="text-explorer-text">Anomaly Detection</CardTitle>
                </CardHeader>
                <CardContent>
                  {anomalies.length > 0 ? (
                    <div className="space-y-3">
                      {anomalies.map((anomaly, index) => (
                        <div key={index} className="border border-explorer-chrome/30 rounded p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-explorer-text">
                              {anomaly.description}
                            </span>
                            <Badge className={
                              anomaly.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                              anomaly.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                              anomaly.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-blue-500/20 text-blue-400'
                            }>
                              {anomaly.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-explorer-text-muted">
                            {anomaly.suggestedFix}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-explorer-text-muted">No anomalies detected</p>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="bg-explorer-card border-explorer-chrome/30">
              <CardContent className="p-8 text-center">
                <BarChart className="h-12 w-12 text-explorer-text-muted mx-auto mb-4" />
                <p className="text-explorer-text-muted">
                  Select a configuration to view quality analysis
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="workflow" className="space-y-6">
          {selectedConfig && workflowStatus ? (
            <Card className="bg-explorer-card border-explorer-chrome/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-explorer-text">
                  <History className="h-5 w-5 text-blue-400" />
                  Workflow Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-explorer-text">Current Status</span>
                    <Badge className={
                      workflowStatus.status === 'published' ? 'bg-green-500/20 text-green-400' :
                      workflowStatus.status === 'approved' ? 'bg-blue-500/20 text-blue-400' :
                      workflowStatus.status === 'review' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-gray-500/20 text-gray-400'
                    }>
                      {workflowStatus.status}
                    </Badge>
                  </div>
                  
                  {workflowStatus.notes && (
                    <div className="bg-explorer-dark/50 p-3 rounded">
                      <p className="text-sm text-explorer-text-muted">
                        <strong>Notes:</strong> {workflowStatus.notes}
                      </p>
                    </div>
                  )}
                  
                  <div className="text-sm text-explorer-text-muted">
                    <p>Created: {new Date(workflowStatus.created_at).toLocaleDateString()}</p>
                    <p>Updated: {new Date(workflowStatus.updated_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-explorer-card border-explorer-chrome/30">
              <CardContent className="p-8 text-center">
                <History className="h-12 w-12 text-explorer-text-muted mx-auto mb-4" />
                <p className="text-explorer-text-muted">
                  Select a configuration to view workflow status
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedTrimLevelManagerPhase3;
