
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { ModelYear, MotorcycleModel } from "@/types/motorcycle";

interface YearsSectionProps {
  modelYears: ModelYear[];
  selectedModel: string | null;
  selectedYear: string | null;
  selectedModelData?: MotorcycleModel;
  onYearSelect: (yearId: string) => void;
  isLoading: boolean;
}

const YearsSection = ({
  modelYears,
  selectedModel,
  selectedYear,
  selectedModelData,
  onYearSelect,
  isLoading
}: YearsSectionProps) => {
  if (!selectedModel) {
    return (
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text">Model Years</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-explorer-text-muted">
            Select a model to view available years
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardHeader>
        <CardTitle className="text-explorer-text flex items-center gap-2">
          Model Years
          {selectedModelData && (
            <Badge variant="outline" className="text-xs">
              {selectedModelData.brand?.name} {selectedModelData.name}
            </Badge>
          )}
          <Badge variant="secondary" className="ml-auto">
            {modelYears.length} years
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-teal mx-auto"></div>
            <p className="text-explorer-text-muted mt-4">Loading years...</p>
          </div>
        ) : modelYears.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-orange-400 mx-auto mb-4" />
            <p className="text-explorer-text-muted mb-2">No model years found</p>
            <p className="text-xs text-explorer-text-muted">
              This model may need year generation
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {modelYears.map((year) => (
              <Button
                key={year.id}
                variant="ghost"
                onClick={() => onYearSelect(year.id)}
                className={`h-auto p-4 text-left ${
                  selectedYear === year.id
                    ? 'bg-accent-teal/20 text-accent-teal border-accent-teal/30 border'
                    : 'bg-explorer-dark hover:bg-explorer-chrome/10 border border-explorer-chrome/20'
                }`}
              >
                <div className="w-full">
                  <div className="font-medium text-lg">{year.year}</div>
                  <div className="space-y-1">
                    {year.is_available && (
                      <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400">
                        Available
                      </Badge>
                    )}
                    {year.msrp_usd && (
                      <div className="text-xs text-green-400">
                        MSRP: ${year.msrp_usd.toLocaleString()}
                      </div>
                    )}
                    {year.changes && (
                      <div className="text-xs text-explorer-text-muted">
                        {year.changes}
                      </div>
                    )}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default YearsSection;
