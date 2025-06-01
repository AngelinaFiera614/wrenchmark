
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, Zap, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SmartSuggestion {
  field: string;
  value: any;
  confidence: number;
  reason: string;
  icon: React.ReactNode;
}

interface SmartDataEntryProps {
  formData: any;
  onFieldChange: (field: string, value: any) => void;
  onApplySuggestion: (field: string, value: any) => void;
  motorcycleCategory?: string;
  brandName?: string;
}

const SmartDataEntry = ({
  formData,
  onFieldChange,
  onApplySuggestion,
  motorcycleCategory = "",
  brandName = ""
}: SmartDataEntryProps) => {
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generateSmartSuggestions();
  }, [formData.name, motorcycleCategory, brandName]);

  const generateSmartSuggestions = async () => {
    if (!formData.name || formData.name.length < 3) return;
    
    setLoading(true);
    try {
      // Get similar configurations from database
      const { data: similarConfigs } = await supabase
        .from('model_configurations')
        .select('*')
        .ilike('name', `%${formData.name.split(' ')[0]}%`)
        .limit(10);

      const newSuggestions: SmartSuggestion[] = [];

      if (similarConfigs && similarConfigs.length > 0) {
        // Calculate averages for numeric fields
        const avgWeight = calculateAverage(similarConfigs, 'weight_kg');
        const avgSeatHeight = calculateAverage(similarConfigs, 'seat_height_mm');
        const avgWheelbase = calculateAverage(similarConfigs, 'wheelbase_mm');

        if (avgWeight && !formData.weight_kg) {
          newSuggestions.push({
            field: 'weight_kg',
            value: Math.round(avgWeight),
            confidence: 85,
            reason: `Based on ${similarConfigs.length} similar configurations`,
            icon: <TrendingUp className="h-3 w-3" />
          });
        }

        if (avgSeatHeight && !formData.seat_height_mm) {
          newSuggestions.push({
            field: 'seat_height_mm',
            value: Math.round(avgSeatHeight),
            confidence: 80,
            reason: 'Typical for this configuration type',
            icon: <Lightbulb className="h-3 w-3" />
          });
        }

        if (avgWheelbase && !formData.wheelbase_mm) {
          newSuggestions.push({
            field: 'wheelbase_mm',
            value: Math.round(avgWheelbase),
            confidence: 75,
            reason: 'Standard wheelbase for category',
            icon: <Zap className="h-3 w-3" />
          });
        }
      }

      // Category-based suggestions
      if (motorcycleCategory && !formData.market_region) {
        const categoryRegions: Record<string, string> = {
          'Sport': 'Global',
          'Cruiser': 'North America',
          'Adventure': 'Global',
          'Touring': 'Europe',
          'Standard': 'Global'
        };
        
        if (categoryRegions[motorcycleCategory]) {
          newSuggestions.push({
            field: 'market_region',
            value: categoryRegions[motorcycleCategory],
            confidence: 70,
            reason: `Common market for ${motorcycleCategory} motorcycles`,
            icon: <Lightbulb className="h-3 w-3" />
          });
        }
      }

      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Error generating suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAverage = (configs: any[], field: string): number | null => {
    const values = configs
      .map(c => c[field])
      .filter(v => v != null && !isNaN(v));
    
    if (values.length === 0) return null;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "bg-green-500/20 text-green-400";
    if (confidence >= 60) return "bg-yellow-500/20 text-yellow-400";
    return "bg-blue-500/20 text-blue-400";
  };

  if (suggestions.length === 0 && !loading) return null;

  return (
    <Card className="bg-explorer-card border-accent-teal/30">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="h-4 w-4 text-accent-teal" />
          <span className="font-medium text-explorer-text">Smart Suggestions</span>
          {loading && (
            <Badge variant="outline" className="animate-pulse">
              Analyzing...
            </Badge>
          )}
        </div>

        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-explorer-dark/50">
              <div className="flex items-center gap-3">
                {suggestion.icon}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-explorer-text">
                      {suggestion.field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getConfidenceColor(suggestion.confidence)}`}
                    >
                      {suggestion.confidence}% confidence
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {suggestion.reason}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-accent-teal">
                  {suggestion.value}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onApplySuggestion(suggestion.field, suggestion.value)}
                  className="text-xs"
                >
                  Apply
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartDataEntry;
