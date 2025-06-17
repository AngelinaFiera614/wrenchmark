
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Star, 
  Clock, 
  TrendingUp,
  Filter,
  Plus
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface ComponentLibraryIntegrationProps {
  componentType: string;
  onComponentSelect: (componentId: string) => void;
  onCreateNew: () => void;
  selectedComponentId?: string;
}

const ComponentLibraryIntegration: React.FC<ComponentLibraryIntegrationProps> = ({
  componentType,
  onComponentSelect,
  onCreateNew,
  selectedComponentId
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState<'all' | 'popular' | 'recent'>('all');

  // Mock data for demonstration - in real implementation, this would come from actual queries
  const { data: recentComponents = [] } = useQuery({
    queryKey: [`recent-${componentType}`],
    queryFn: async () => {
      // Mock recent components
      return [
        { id: '1', name: 'Recently Used Component 1', usage_count: 5 },
        { id: '2', name: 'Recently Used Component 2', usage_count: 3 },
      ];
    },
    enabled: false // Disabled for now since we don't have real data
  });

  const { data: popularComponents = [] } = useQuery({
    queryKey: [`popular-${componentType}`],
    queryFn: async () => {
      // Mock popular components
      return [
        { id: '3', name: 'Popular Component 1', usage_count: 25 },
        { id: '4', name: 'Popular Component 2', usage_count: 18 },
      ];
    },
    enabled: false // Disabled for now since we don't have real data
  });

  const quickSuggestions = [
    ...recentComponents.slice(0, 3),
    ...popularComponents.slice(0, 3)
  ];

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-explorer-text-muted" />
          <Input
            placeholder={`Search ${componentType.replace('_', ' ')}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-explorer-dark border-explorer-chrome/30"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFilterMode(filterMode === 'all' ? 'popular' : 'all')}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          {filterMode === 'all' ? 'All' : 'Popular'}
        </Button>
      </div>

      {/* Quick Suggestions */}
      {quickSuggestions.length > 0 && (
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-accent-teal" />
              Quick Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 gap-2">
              {quickSuggestions.map((component) => (
                <div
                  key={component.id}
                  className={`p-2 rounded border cursor-pointer transition-colors ${
                    selectedComponentId === component.id
                      ? 'bg-accent-teal/20 border-accent-teal'
                      : 'bg-explorer-dark border-explorer-chrome/30 hover:border-explorer-chrome/50'
                  }`}
                  onClick={() => onComponentSelect(component.id)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{component.name}</span>
                    <div className="flex items-center gap-2">
                      {component.usage_count > 10 && (
                        <Badge variant="secondary" className="bg-accent-teal/20 text-accent-teal text-xs">
                          <Star className="h-2 w-2 mr-1" />
                          Popular
                        </Badge>
                      )}
                      <span className="text-xs text-explorer-text-muted">
                        Used {component.usage_count}x
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create New Component */}
      <Card className="bg-explorer-card border-explorer-chrome/30 border-dashed">
        <CardContent className="p-4">
          <div className="text-center">
            <Plus className="h-8 w-8 text-explorer-text-muted mx-auto mb-2" />
            <p className="text-sm text-explorer-text-muted mb-3">
              Don't see what you need?
            </p>
            <Button
              variant="outline"
              onClick={onCreateNew}
              className="w-full"
            >
              Create New {componentType.replace('_', ' ')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Compatibility Info */}
      <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <div className="text-green-600 dark:text-green-400 text-xs">
            💡 <strong>Compatibility:</strong> All components shown are compatible with this motorcycle model.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentLibraryIntegration;
