
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useComparison } from "@/context/ComparisonContext";
import ComparisonChart from "./comparison/ComparisonChart";
import PerformanceMetricsTable from "./comparison/PerformanceMetricsTable";
import NormalizedScoresTable from "./comparison/NormalizedScoresTable";
import { useComparisonCalculations } from "./comparison/useComparisonCalculations";

export default function EnhancedComparisonMatrix() {
  const { motorcyclesToCompare } = useComparison();
  const [selectedMetric, setSelectedMetric] = useState<string>('powerToWeight');

  const { calculatedFields, comparisonData, normalizedScores } = useComparisonCalculations(motorcyclesToCompare);

  const chartData = useMemo(() => {
    return comparisonData.map(bike => ({
      name: bike.shortName,
      value: bike[selectedMetric as keyof typeof bike] as number || 0
    }));
  }, [comparisonData, selectedMetric]);

  if (motorcyclesToCompare.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Enhanced Comparison Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Select motorcycles to compare advanced metrics and calculated fields
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <ComparisonChart
        calculatedFields={calculatedFields}
        selectedMetric={selectedMetric}
        onMetricChange={setSelectedMetric}
        chartData={chartData}
      />

      <PerformanceMetricsTable
        comparisonData={comparisonData}
        calculatedFields={calculatedFields}
      />

      <NormalizedScoresTable
        normalizedScores={normalizedScores}
      />
    </div>
  );
}
