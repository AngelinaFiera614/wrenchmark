
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, AlertTriangle, Clock, Calendar } from "lucide-react";

interface MultiYearSelectorProps {
  modelYears: any[];
  selectedYears: string[];
  onYearToggle: (yearId: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
}

const MultiYearSelector = ({
  modelYears,
  selectedYears,
  onYearToggle,
  onSelectAll,
  onClearAll
}: MultiYearSelectorProps) => {
  const getYearCompletionStatus = (yearId: string) => {
    // Mock completion status - you can implement actual logic
    const random = Math.random();
    if (random > 0.7) return 'complete';
    if (random > 0.3) return 'partial';
    return 'missing';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete': return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'partial': return <Clock className="h-3 w-3 text-yellow-500" />;
      default: return <AlertTriangle className="h-3 w-3 text-red-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'complete': return <Badge className="bg-green-100 text-green-800 text-xs">Complete</Badge>;
      case 'partial': return <Badge className="bg-yellow-100 text-yellow-800 text-xs">Partial</Badge>;
      default: return <Badge className="bg-red-100 text-red-800 text-xs">Missing</Badge>;
    }
  };

  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-explorer-text flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Model Years ({selectedYears.length} selected)
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onSelectAll}
              className="text-xs border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
            >
              Select All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClearAll}
              className="text-xs border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
            >
              Clear All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {modelYears.map(year => {
            const status = getYearCompletionStatus(year.id);
            const isSelected = selectedYears.includes(year.id);
            
            return (
              <div
                key={year.id}
                className={`p-3 rounded border cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-accent-teal/20 border-accent-teal' 
                    : 'bg-explorer-dark border-explorer-chrome/30 hover:border-explorer-chrome/50'
                }`}
                onClick={() => onYearToggle(year.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <Checkbox
                    checked={isSelected}
                    onChange={() => onYearToggle(year.id)}
                    className="pointer-events-none"
                  />
                  {getStatusIcon(status)}
                </div>
                <div className="text-sm font-medium text-explorer-text mb-1">
                  {year.year}
                </div>
                <div className="flex items-center justify-between">
                  {getStatusBadge(status)}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default MultiYearSelector;
