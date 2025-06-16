
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus } from "lucide-react";

interface YearManagementPanelProps {
  modelYears: any[];
  selectedYear: string | null;
  selectedModelData?: any;
  onYearSelect: (yearId: string) => void;
  loading: boolean;
}

const YearManagementPanel: React.FC<YearManagementPanelProps> = ({
  modelYears,
  selectedYear,
  selectedModelData,
  onYearSelect,
  loading
}) => {
  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-explorer-text flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Model Years
            <Badge variant="secondary" className="ml-auto">
              {modelYears.length}
            </Badge>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="border-accent-teal/30 text-accent-teal hover:bg-accent-teal/10"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Year
          </Button>
        </div>
        {selectedModelData && (
          <p className="text-sm text-explorer-text-muted">
            {selectedModelData.brands?.name} {selectedModelData.name}
          </p>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-12 bg-explorer-chrome/20 rounded animate-pulse" />
            ))}
          </div>
        ) : modelYears.length > 0 ? (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {modelYears.map((year) => (
              <Button
                key={year.id}
                variant={selectedYear === year.id ? "default" : "ghost"}
                onClick={() => onYearSelect(year.id)}
                className={`w-full justify-start text-left h-auto p-3 ${
                  selectedYear === year.id
                    ? "bg-accent-teal text-black hover:bg-accent-teal/80"
                    : "text-explorer-text hover:bg-explorer-chrome/20"
                }`}
              >
                <div className="w-full">
                  <div className="font-medium text-lg">{year.year}</div>
                  {year.changes && (
                    <div className="text-sm opacity-70 mt-1">
                      {year.changes}
                    </div>
                  )}
                  {year.msrp_usd && (
                    <div className="text-sm text-green-400 mt-1">
                      MSRP: ${year.msrp_usd.toLocaleString()}
                    </div>
                  )}
                </div>
              </Button>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-explorer-text-muted mx-auto mb-4" />
            <p className="text-explorer-text-muted">No years found for this model</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default YearManagementPanel;
