
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface YearSelectorSectionProps {
  years: any[];
  selectedYear: string | null;
  onYearSelect: (id: string) => void;
  loading: boolean;
}

const YearSelectorSection: React.FC<YearSelectorSectionProps> = ({
  years,
  selectedYear,
  onYearSelect,
  loading
}) => (
  <Card className="bg-explorer-card border-explorer-chrome/30">
    <CardHeader>
      <CardTitle className="text-explorer-text">Model Years</CardTitle>
    </CardHeader>
    <CardContent>
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-10 bg-explorer-chrome/20 rounded animate-pulse" />
          ))}
        </div>
      ) : years.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {years.map((year) => (
            <Button
              key={year.id}
              variant={selectedYear === year.id ? "default" : "outline"}
              size="sm"
              onClick={() => onYearSelect(year.id)}
              className={selectedYear === year.id ?
                "bg-accent-teal text-black hover:bg-accent-teal/80" :
                "border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
              }
            >
              {year.year}
            </Button>
          ))}
        </div>
      ) : (
        <p className="text-explorer-text-muted text-sm">No years found for this model</p>
      )}
    </CardContent>
  </Card>
);

export default YearSelectorSection;
