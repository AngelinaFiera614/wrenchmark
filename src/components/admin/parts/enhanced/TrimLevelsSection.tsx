
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Configuration } from "@/types/motorcycle";
import TrimLevelsSectionHeader from "./trim-levels/TrimLevelsSectionHeader";
import YearSection from "./trim-levels/YearSection";
import EmptyTrimLevelsState from "./trim-levels/EmptyTrimLevelsState";

interface TrimLevelsSectionProps {
  selectedYears: string[];
  configurations: any[];
  onCreateNew: (yearIds?: string[]) => void;
  onEdit: (config: any) => void;
  onCopy: (config: any) => void;
  onDelete: (config: any) => void;
  onPreview: (config: any) => void;
  onRefresh?: () => void;
}

const TrimLevelsSection = ({
  selectedYears,
  configurations,
  onCreateNew,
  onEdit,
  onCopy,
  onDelete,
  onPreview,
  onRefresh
}: TrimLevelsSectionProps) => {
  const [expandedYears, setExpandedYears] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const toggleYear = (yearId: string) => {
    setExpandedYears(prev => 
      prev.includes(yearId) 
        ? prev.filter(id => id !== yearId)
        : [...prev, yearId]
    );
  };

  const getConfigsByYear = (yearId: string) => {
    // Use configurations passed from parent - this ensures consistency
    return configurations.filter(config => config.model_year_id === yearId);
  };

  const handleCreateNewTrim = () => {
    if (selectedYears.length === 0) {
      alert("Please select at least one model year first");
      return;
    }
    onCreateNew(selectedYears);
  };

  const handleRefreshConfigs = async () => {
    if (!onRefresh) return;
    
    setIsRefreshing(true);
    try {
      await onRefresh();
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
      configurationsByYear: selectedYears.reduce((acc, yearId) => {
        acc[yearId] = getConfigsByYear(yearId).length;
        return acc;
      }, {} as Record<string, number>)
    });
  }, [configurations, selectedYears]);

  if (selectedYears.length === 0) {
    return <EmptyTrimLevelsState />;
  }

  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <TrimLevelsSectionHeader
        selectedYearsCount={selectedYears.length}
        onCreateNew={handleCreateNewTrim}
        onRefresh={onRefresh ? handleRefreshConfigs : undefined}
        isRefreshing={isRefreshing}
      />
      <CardContent className="space-y-4">
        {selectedYears.map(yearId => {
          const yearConfigs = getConfigsByYear(yearId);
          const isExpanded = expandedYears.includes(yearId);
          
          return (
            <YearSection
              key={yearId}
              yearId={yearId}
              yearConfigs={yearConfigs}
              isExpanded={isExpanded}
              onToggle={toggleYear}
              onCreateNew={onCreateNew}
              onEdit={onEdit}
              onCopy={onCopy}
              onDelete={onDelete}
              onPreview={onPreview}
            />
          );
        })}
      </CardContent>
    </Card>
  );
};

export default TrimLevelsSection;
