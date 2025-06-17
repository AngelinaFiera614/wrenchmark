
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { Motorcycle } from "@/types";
import { calculateDataCompleteness } from "@/utils/dataCompleteness";

interface MotorcycleModelBrowserProps {
  motorcycles: Motorcycle[];
  selectedMotorcycle: Motorcycle | null;
  onSelectMotorcycle: (motorcycle: Motorcycle) => void;
  isLoading: boolean;
}

const MotorcycleModelBrowser = ({
  motorcycles,
  selectedMotorcycle,
  onSelectMotorcycle,
  isLoading
}: MotorcycleModelBrowserProps) => {
  if (isLoading) {
    return (
      <Card className="bg-explorer-card border-explorer-chrome/30 h-full">
        <CardContent className="p-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent-teal" />
        </CardContent>
      </Card>
    );
  }

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-400";
    if (percentage >= 70) return "text-yellow-400";
    return "text-red-400";
  };

  const getStatusBadge = (motorcycle: Motorcycle) => {
    if (motorcycle.is_draft) {
      return <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs">Draft</Badge>;
    }
    return <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">Published</Badge>;
  };

  return (
    <Card className="bg-explorer-card border-explorer-chrome/30 h-full">
      <CardHeader>
        <CardTitle className="text-explorer-text flex items-center justify-between">
          Motorcycle Models
          <Badge variant="secondary">{motorcycles.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {motorcycles.map((motorcycle) => {
            const completeness = calculateDataCompleteness(motorcycle);
            const isSelected = selectedMotorcycle?.id === motorcycle.id;
            
            return (
              <div
                key={motorcycle.id}
                className={`p-3 rounded-lg border transition-all cursor-pointer hover:bg-explorer-chrome/10 ${
                  isSelected
                    ? 'bg-accent-teal/20 border-accent-teal/30'
                    : 'bg-explorer-dark border-explorer-chrome/20'
                }`}
                onClick={() => onSelectMotorcycle(motorcycle)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate text-explorer-text">
                      {motorcycle.make} {motorcycle.model}
                    </div>
                    <div className="text-sm text-explorer-text-muted">
                      {motorcycle.year || 'No year'} • {motorcycle.category || 'No category'}
                    </div>
                  </div>
                  {getStatusBadge(motorcycle)}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-explorer-text-muted">Completion:</span>
                    <span className={getCompletionColor(completeness.completionPercentage)}>
                      {completeness.completionPercentage}%
                    </span>
                  </div>
                  
                  {motorcycle.engine_size && (
                    <div className="text-xs text-explorer-text-muted">
                      {motorcycle.engine_size}cc
                    </div>
                  )}
                </div>
                
                {completeness.missingCriticalFields.length > 0 && (
                  <div className="mt-2 text-xs text-red-400">
                    Missing: {completeness.missingCriticalFields.slice(0, 2).join(', ')}
                    {completeness.missingCriticalFields.length > 2 && ' +more'}
                  </div>
                )}
              </div>
            );
          })}
          
          {motorcycles.length === 0 && (
            <div className="text-center py-8 text-explorer-text-muted">
              No motorcycles found matching your criteria
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MotorcycleModelBrowser;
