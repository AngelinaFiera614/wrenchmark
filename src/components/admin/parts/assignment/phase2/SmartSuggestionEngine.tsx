
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Lightbulb, TrendingUp, CheckCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SmartSuggestion {
  componentType: string;
  componentId: string;
  componentName: string;
  confidence: number;
  reason: string;
  usage: number;
}

interface SmartSuggestionEngineProps {
  model: {
    id: string;
    name: string;
    type: string;
    production_start_year: number;
    brands: { name: string }[];
  };
  onApplySuggestion: (componentType: string, componentId: string) => void;
  existingAssignments: string[];
}

const SmartSuggestionEngine: React.FC<SmartSuggestionEngineProps> = ({
  model,
  onApplySuggestion,
  existingAssignments
}) => {
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch similar models for recommendation analysis
  const { data: similarModels } = useQuery({
    queryKey: ['similar-models', model.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('motorcycle_models')
        .select(`
          id,
          name,
          type,
          production_start_year,
          brands!inner(name)
        `)
        .eq('type', model.type)
        .neq('id', model.id)
        .limit(10);

      if (error) throw error;
      return data || [];
    }
  });

  // Generate smart suggestions based on similar models
  const generateSuggestions = async () => {
    if (!similarModels?.length) return;

    setLoading(true);
    try {
      const suggestions: SmartSuggestion[] = [];

      // Analyze component usage patterns in similar models
      for (const componentType of ['engine', 'brake_system', 'frame', 'suspension', 'wheel']) {
        if (existingAssignments.includes(componentType)) continue;

        // Get most common components for this type in similar models
        const { data: assignments } = await supabase
          .from('model_component_assignments')
          .select('component_id, component_type')
          .eq('component_type', componentType)
          .in('model_id', similarModels.map(m => m.id));

        if (assignments?.length) {
          // Calculate component popularity
          const componentCounts = assignments.reduce((acc: Record<string, number>, assignment) => {
            acc[assignment.component_id] = (acc[assignment.component_id] || 0) + 1;
            return acc;
          }, {});

          const mostPopularId = Object.keys(componentCounts).reduce((a, b) =>
            componentCounts[a] > componentCounts[b] ? a : b
          );

          // Get component details
          const tableName = getTableName(componentType);
          const { data: componentData } = await supabase
            .from(tableName)
            .select('*')
            .eq('id', mostPopularId)
            .single();

          if (componentData) {
            const usage = componentCounts[mostPopularId];
            const confidence = Math.min((usage / similarModels.length) * 100, 95);

            suggestions.push({
              componentType,
              componentId: mostPopularId,
              componentName: getComponentDisplayName(componentType, componentData),
              confidence,
              reason: `Used in ${usage} of ${similarModels.length} similar ${model.type} models`,
              usage
            });
          }
        }
      }

      // Sort by confidence
      suggestions.sort((a, b) => b.confidence - a.confidence);
      setSuggestions(suggestions.slice(0, 5)); // Top 5 suggestions

    } catch (error) {
      console.error('Error generating suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (similarModels?.length && !loading) {
      generateSuggestions();
    }
  }, [similarModels, existingAssignments]);

  const getTableName = (componentType: string): string => {
    const tableMap: Record<string, string> = {
      engine: 'engines',
      brake_system: 'brake_systems',
      frame: 'frames',
      suspension: 'suspensions',
      wheel: 'wheels'
    };
    return tableMap[componentType] || componentType;
  };

  const getComponentDisplayName = (componentType: string, component: any): string => {
    switch (componentType) {
      case 'engine':
        return component.name || `${component.displacement_cc}cc Engine`;
      case 'brake_system':
        return component.type || 'Brake System';
      case 'frame':
        return component.type || 'Frame';
      case 'suspension':
        return `${component.front_type || 'Unknown'} / ${component.rear_type || 'Unknown'}`;
      case 'wheel':
        return component.type || 'Wheels';
      default:
        return 'Unknown Component';
    }
  };

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 80) return 'text-green-400';
    if (confidence >= 60) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getConfidenceBadgeVariant = (confidence: number): "default" | "secondary" | "destructive" | "outline" => {
    if (confidence >= 80) return 'default';
    if (confidence >= 60) return 'secondary';
    return 'outline';
  };

  if (!similarModels?.length) {
    return (
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-explorer-text">
            <Brain className="h-5 w-5 text-accent-teal" />
            Smart Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-explorer-text-muted">
            No similar models found for generating suggestions
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-explorer-text">
          <Brain className="h-5 w-5 text-accent-teal" />
          Smart Suggestions
          <Badge variant="outline" className="ml-2">
            Based on {similarModels.length} similar models
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="text-center py-4 text-explorer-text-muted">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent-teal mx-auto mb-2"></div>
            Analyzing similar models...
          </div>
        ) : suggestions.length === 0 ? (
          <div className="text-center py-4 text-explorer-text-muted">
            <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
            All component types already assigned or no suggestions available
          </div>
        ) : (
          suggestions.map((suggestion, index) => (
            <div
              key={`${suggestion.componentType}-${suggestion.componentId}`}
              className="p-3 rounded-lg border border-explorer-chrome/30 bg-explorer-dark"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="h-4 w-4 text-accent-teal" />
                    <span className="font-medium text-explorer-text capitalize">
                      {suggestion.componentType.replace('_', ' ')}
                    </span>
                    <Badge variant={getConfidenceBadgeVariant(suggestion.confidence)}>
                      {Math.round(suggestion.confidence)}% match
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-explorer-text mb-1">
                    {suggestion.componentName}
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-explorer-text-muted">
                    <TrendingUp className="h-3 w-3" />
                    {suggestion.reason}
                  </div>
                </div>
                
                <Button
                  size="sm"
                  onClick={() => onApplySuggestion(suggestion.componentType, suggestion.componentId)}
                  className="bg-accent-teal text-black hover:bg-accent-teal/80"
                >
                  Apply
                </Button>
              </div>
            </div>
          ))
        )}

        {suggestions.length > 0 && (
          <div className="pt-4 border-t border-explorer-chrome/30">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                suggestions.forEach(suggestion => {
                  onApplySuggestion(suggestion.componentType, suggestion.componentId);
                });
              }}
            >
              Apply All Suggestions
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartSuggestionEngine;
