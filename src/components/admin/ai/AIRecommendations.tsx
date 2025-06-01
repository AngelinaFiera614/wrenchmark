
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Target, TrendingUp, Lightbulb } from "lucide-react";
import { getComponentRecommendations, generateConfigurationSuggestion, type ComponentRecommendation, type ConfigurationSuggestion } from "@/services/ai/aiRecommendationService";

interface AIRecommendationsProps {
  modelYearId?: string;
  motorcycleCategory?: string;
}

const AIRecommendations = ({ modelYearId, motorcycleCategory = 'Standard' }: AIRecommendationsProps) => {
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<ComponentRecommendation[]>([]);
  const [configSuggestion, setConfigSuggestion] = useState<ConfigurationSuggestion | null>(null);
  const [selectedCategory, setSelectedCategory] = useState(motorcycleCategory);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (modelYearId) {
      loadRecommendations();
    }
  }, [modelYearId, selectedCategory]);

  const loadRecommendations = async () => {
    if (!modelYearId) return;
    
    try {
      setLoading(true);
      const [componentRecs, configSug] = await Promise.all([
        getComponentRecommendations(selectedCategory),
        generateConfigurationSuggestion(modelYearId, selectedCategory)
      ]);
      
      setRecommendations(componentRecs);
      setConfigSuggestion(configSug);
    } catch (error) {
      console.error('Error loading AI recommendations:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load AI recommendations"
      });
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getConfidenceLabel = (score: number) => {
    if (score >= 80) return 'High Confidence';
    if (score >= 60) return 'Medium Confidence';
    return 'Low Confidence';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-300 rounded w-3/4"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category Selection */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-explorer-text">
              <Sparkles className="h-5 w-5 text-accent-teal" />
              AI Recommendations
            </CardTitle>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 bg-explorer-dark border-explorer-chrome/30">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Standard">Standard</SelectItem>
                <SelectItem value="Sport">Sport</SelectItem>
                <SelectItem value="Touring">Touring</SelectItem>
                <SelectItem value="Adventure">Adventure</SelectItem>
                <SelectItem value="Cruiser">Cruiser</SelectItem>
                <SelectItem value="Naked">Naked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Button onClick={loadRecommendations} disabled={loading}>
              {loading ? 'Generating...' : 'Generate New Recommendations'}
            </Button>
            <Badge variant="outline" className="text-accent-teal border-accent-teal/30">
              AI-Powered
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Suggestion */}
      {configSuggestion && (
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-explorer-text">
              <Target className="h-5 w-5 text-blue-400" />
              Suggested Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-explorer-text-muted">Suggested Name</p>
                <p className="text-lg font-semibold text-explorer-text">{configSuggestion.suggested_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-explorer-text-muted">Market Region</p>
                <p className="text-lg font-semibold text-explorer-text">{configSuggestion.market_region}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-explorer-text-muted">Estimated Popularity</p>
                <div className="flex items-center space-x-2">
                  <Progress value={configSuggestion.estimated_popularity} className="flex-1" />
                  <span className="text-sm font-medium text-explorer-text">
                    {configSuggestion.estimated_popularity}%
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-explorer-dark/50 p-3 rounded">
              <p className="text-sm text-explorer-text-muted">
                <Lightbulb className="h-4 w-4 inline mr-2" />
                {configSuggestion.reasoning}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Component Recommendations */}
      {recommendations.length > 0 && (
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-explorer-text">
              <TrendingUp className="h-5 w-5 text-green-400" />
              Component Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="border border-explorer-chrome/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-explorer-text capitalize">
                        {rec.component_type.replace('_', ' ')}
                      </h4>
                      <p className="text-sm text-explorer-text-muted">{rec.component_name}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getConfidenceColor(rec.confidence_score)}>
                        {getConfidenceLabel(rec.confidence_score)}
                      </Badge>
                      <p className="text-sm text-explorer-text-muted mt-1">
                        {rec.confidence_score.toFixed(1)}% confidence
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <Progress value={rec.confidence_score} className="h-2" />
                  </div>
                  
                  <p className="text-sm text-explorer-text-muted bg-explorer-dark/50 p-2 rounded">
                    {rec.reasoning}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Recommendations State */}
      {!loading && recommendations.length === 0 && !configSuggestion && (
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="p-8 text-center">
            <Sparkles className="h-12 w-12 text-explorer-text-muted mx-auto mb-4" />
            <p className="text-explorer-text-muted">
              Generate AI recommendations to get intelligent suggestions for components and configurations.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIRecommendations;
