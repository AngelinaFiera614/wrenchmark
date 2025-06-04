
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Plus, Settings, Eye, Copy, Trash2, RefreshCw } from "lucide-react";
import { Configuration } from "@/types/motorcycle";
import { fetchConfigurationsForMultipleYears } from "@/services/models/configurationService";
import { useQuery } from "@tanstack/react-query";

interface TrimLevelsSectionProps {
  selectedYears: string[];
  configurations: any[];
  onCreateNew: (yearIds?: string[]) => void;
  onEdit: (config: any) => void;
  onCopy: (config: any) => void;
  onDelete: (config: any) => void;
  onPreview: (config: any) => void;
}

const TrimLevelsSection = ({
  selectedYears,
  configurations,
  onCreateNew,
  onEdit,
  onCopy,
  onDelete,
  onPreview
}: TrimLevelsSectionProps) => {
  const [expandedYears, setExpandedYears] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Query for multi-year configurations
  const { 
    data: multiYearConfigs = [], 
    isLoading: multiYearLoading,
    refetch: refetchMultiYear
  } = useQuery<Configuration[]>({
    queryKey: ["configurations-multi", ...selectedYears.sort()],
    queryFn: () => selectedYears.length > 0 ? fetchConfigurationsForMultipleYears(selectedYears) : Promise.resolve([]),
    enabled: selectedYears.length > 0,
  });

  const toggleYear = (yearId: string) => {
    setExpandedYears(prev => 
      prev.includes(yearId) 
        ? prev.filter(id => id !== yearId)
        : [...prev, yearId]
    );
  };

  const getConfigsByYear = (yearId: string) => {
    // Use multi-year configs when available, fallback to passed configurations
    const configsToUse = multiYearConfigs.length > 0 ? multiYearConfigs : configurations;
    return configsToUse.filter(config => config.model_year_id === yearId);
  };

  const getCompletionStatus = (config: any) => {
    // Mock completion logic
    const requiredFields = ['name', 'msrp_usd', 'engine_id', 'brake_system_id'];
    const completedFields = requiredFields.filter(field => config[field]);
    const percentage = (completedFields.length / requiredFields.length) * 100;
    
    if (percentage >= 80) return 'complete';
    if (percentage >= 40) return 'partial';
    return 'missing';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'complete': return <Badge className="bg-green-100 text-green-800 text-xs">Complete</Badge>;
      case 'partial': return <Badge className="bg-yellow-100 text-yellow-800 text-xs">Partial</Badge>;
      default: return <Badge className="bg-red-100 text-red-800 text-xs">Incomplete</Badge>;
    }
  };

  const handleCreateNewTrim = () => {
    if (selectedYears.length === 0) {
      alert("Please select at least one model year first");
      return;
    }
    onCreateNew(selectedYears);
  };

  const handleRefreshConfigs = async () => {
    setIsRefreshing(true);
    try {
      await refetchMultiYear();
      console.log("Refreshed configurations for selected years:", selectedYears);
    } catch (error) {
      console.error("Error refreshing configurations:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Auto-expand years when configurations are loaded
  useEffect(() => {
    if (selectedYears.length > 0 && expandedYears.length === 0) {
      setExpandedYears(selectedYears);
    }
  }, [selectedYears]);

  useEffect(() => {
    console.log("TrimLevelsSection: Data updated", {
      selectedYears,
      configurationsCount: configurations.length,
      multiYearConfigsCount: multiYearConfigs.length,
      multiYearLoading,
      configurations: configurations.map(c => ({ id: c.id, name: c.name, model_year_id: c.model_year_id })),
      multiYearConfigs: multiYearConfigs.map(c => ({ id: c.id, name: c.name, model_year_id: c.model_year_id }))
    });
  }, [configurations, multiYearConfigs, selectedYears, multiYearLoading]);

  if (selectedYears.length === 0) {
    return (
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text">Trim Levels</CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <div className="text-explorer-text-muted">
            Select one or more model years to manage trim levels
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-explorer-text">
            Trim Levels ({selectedYears.length} years selected)
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshConfigs}
              disabled={isRefreshing}
              className="border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              onClick={handleCreateNewTrim}
              className="bg-accent-teal text-black hover:bg-accent-teal/90"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Trim to Selected Years
            </Button>
          </div>
        </div>
        {multiYearLoading && (
          <div className="text-sm text-explorer-text-muted">
            Loading configurations for selected years...
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedYears.map(yearId => {
          const yearConfigs = getConfigsByYear(yearId);
          const isExpanded = expandedYears.includes(yearId);
          
          return (
            <Collapsible key={yearId} open={isExpanded} onOpenChange={() => toggleYear(yearId)}>
              <Card className="bg-explorer-dark border-explorer-chrome/30">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-explorer-chrome/10 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-explorer-text-muted" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-explorer-text-muted" />
                        )}
                        <div className="text-sm font-medium text-explorer-text">
                          Model Year (ID: {yearId.slice(0, 8)}...)
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {yearConfigs.length} trims
                        </Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCreateNew([yearId]);
                        }}
                        className="border-accent-teal/30 text-accent-teal hover:bg-accent-teal/10"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Trim
                      </Button>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    {yearConfigs.length === 0 ? (
                      <div className="text-center py-8 text-explorer-text-muted">
                        No trim levels configured for this year
                        <div className="mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onCreateNew([yearId])}
                            className="border-accent-teal/30 text-accent-teal hover:bg-accent-teal/10"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Create First Trim
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {yearConfigs.map(config => {
                          const status = getCompletionStatus(config);
                          
                          return (
                            <Card key={config.id} className="bg-explorer-card border-explorer-chrome/30">
                              <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                  <div className="text-sm font-medium text-explorer-text">
                                    {config.name || 'Unnamed Trim'}
                                  </div>
                                  {getStatusBadge(status)}
                                </div>
                                {config.msrp_usd && (
                                  <div className="text-xs text-explorer-text-muted">
                                    MSRP: ${config.msrp_usd.toLocaleString()}
                                  </div>
                                )}
                              </CardHeader>
                              <CardContent className="pt-0">
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onEdit(config)}
                                    className="p-1 h-auto text-explorer-text hover:bg-explorer-chrome/20"
                                  >
                                    <Settings className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onPreview(config)}
                                    className="p-1 h-auto text-explorer-text hover:bg-explorer-chrome/20"
                                  >
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onCopy(config)}
                                    className="p-1 h-auto text-explorer-text hover:bg-explorer-chrome/20"
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onDelete(config)}
                                    className="p-1 h-auto text-red-400 hover:bg-red-500/20"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default TrimLevelsSection;
