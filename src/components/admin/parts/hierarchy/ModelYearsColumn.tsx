
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, AlertCircle, RefreshCw, Plus } from "lucide-react";
import { ModelYear, MotorcycleModel } from "@/types/motorcycle";

interface ModelYearsColumnProps {
  modelYears: ModelYear[];
  selectedModel: string | null;
  selectedYear: string | null;
  selectedModelData?: MotorcycleModel;
  onYearSelect: (yearId: string) => void;
  onRetryModelYears: () => void;
  onGenerateModelYears: () => void;
  generatingYears: boolean;
  isLoading: boolean;
}

const ModelYearsColumn = ({
  modelYears,
  selectedModel,
  selectedYear,
  onYearSelect,
  onRetryModelYears,
  onGenerateModelYears,
  generatingYears,
  isLoading
}: ModelYearsColumnProps) => {
  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-explorer-text flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Model Years ({modelYears.length})
          </CardTitle>
          {selectedModel && (
            <div className="flex gap-2">
              {modelYears.length === 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onGenerateModelYears}
                  disabled={generatingYears}
                  className="bg-explorer-card border-explorer-chrome/30 text-explorer-text"
                >
                  {generatingYears ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-b border-current mr-1" />
                  ) : (
                    <Plus className="h-3 w-3 mr-1" />
                  )}
                  Generate Years
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={onRetryModelYears}
                className="bg-explorer-card border-explorer-chrome/30 text-explorer-text"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Refresh
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {!selectedModel ? (
          <div className="p-8 text-center text-explorer-text-muted">
            Select a model to view years
          </div>
        ) : modelYears.length === 0 && !isLoading ? (
          <div className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-orange-400 mx-auto mb-4" />
            <p className="text-explorer-text-muted mb-2">
              No model years found
            </p>
            <p className="text-xs text-explorer-text-muted mb-4">
              Generate years based on production range
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={onGenerateModelYears}
              disabled={generatingYears}
              className="bg-explorer-card border-explorer-chrome/30 text-explorer-text"
            >
              {generatingYears ? (
                <div className="animate-spin rounded-full h-3 w-3 border-b border-current mr-1" />
              ) : (
                <Plus className="h-3 w-3 mr-1" />
              )}
              Generate Years
            </Button>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {modelYears.map((year) => (
              <Button
                key={year.id}
                variant="ghost"
                onClick={() => onYearSelect(year.id)}
                className={`w-full justify-start text-left p-3 h-auto border-b border-explorer-chrome/10 last:border-b-0 ${
                  selectedYear === year.id
                    ? 'bg-accent-teal/20 text-accent-teal border-accent-teal/30'
                    : 'text-explorer-text hover:bg-explorer-chrome/10'
                }`}
              >
                <div className="w-full">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{year.year}</span>
                    <div className="flex gap-2">
                      {year.is_available && (
                        <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400">
                          Available
                        </Badge>
                      )}
                    </div>
                  </div>
                  {year.changes && (
                    <div className="text-xs text-explorer-text-muted mt-1">
                      {year.changes}
                    </div>
                  )}
                  {year.msrp_usd && (
                    <div className="text-xs text-green-400 mt-1">
                      MSRP: ${year.msrp_usd.toLocaleString()}
                    </div>
                  )}
                </div>
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ModelYearsColumn;
