
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gauge, Zap, Weight, Cog } from "lucide-react";

interface MetricsDisplayProps {
  metrics: {
    powerToWeight: number;
    torqueToWeight: number;
    performanceIndex: number;
    displacementPerCylinder: number;
    horsepowerPerLiter: number;
    weightDistribution: { front: number; rear: number };
    performanceCategory: string;
    weightLbs: number;
    torqueLbFt: number;
    displacementLiters: number;
  } | null;
  compact?: boolean;
}

const MetricsDisplay = ({ metrics, compact = false }: MetricsDisplayProps) => {
  if (!metrics) {
    return (
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardContent className="p-4 text-center text-explorer-text-muted">
          No metrics available - missing engine or weight data
        </CardContent>
      </Card>
    );
  }

  if (compact) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <div className="text-center">
          <div className="text-lg font-bold text-accent-teal">{metrics.powerToWeight}</div>
          <div className="text-xs text-explorer-text-muted">HP/lb</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-explorer-text">{metrics.performanceIndex}</div>
          <div className="text-xs text-explorer-text-muted">Perf Index</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-400">{metrics.horsepowerPerLiter}</div>
          <div className="text-xs text-explorer-text-muted">HP/L</div>
        </div>
        <div className="text-center">
          <Badge variant="outline" className="text-xs">
            {metrics.performanceCategory}
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Performance Category */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Gauge className="h-4 w-4 text-accent-teal" />
            Performance Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant="outline" className="bg-accent-teal/20 text-accent-teal border-accent-teal/30">
            {metrics.performanceCategory}
          </Badge>
        </CardContent>
      </Card>

      {/* Power Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="h-4 w-4 text-accent-teal" />
              Power-to-Weight
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent-teal">{metrics.powerToWeight}</div>
            <div className="text-xs text-explorer-text-muted">HP per pound</div>
          </CardContent>
        </Card>

        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Torque-to-Weight</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-explorer-text">{metrics.torqueToWeight}</div>
            <div className="text-xs text-explorer-text-muted">lb-ft per pound</div>
          </CardContent>
        </Card>

        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Performance Index</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{metrics.performanceIndex}</div>
            <div className="text-xs text-explorer-text-muted">Composite score</div>
          </CardContent>
        </Card>
      </div>

      {/* Engine Efficiency */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Cog className="h-4 w-4 text-accent-teal" />
              Specific Output
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-explorer-text">{metrics.horsepowerPerLiter}</div>
            <div className="text-xs text-explorer-text-muted">HP per liter</div>
          </CardContent>
        </Card>

        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Displacement/Cylinder</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-explorer-text">{metrics.displacementPerCylinder}</div>
            <div className="text-xs text-explorer-text-muted">cc per cylinder</div>
          </CardContent>
        </Card>
      </div>

      {/* Weight Distribution */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Weight className="h-4 w-4 text-accent-teal" />
            Weight Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-explorer-text-muted">Front</span>
            <span className="text-sm text-explorer-text-muted">Rear</span>
          </div>
          <div className="relative h-6 bg-explorer-dark rounded-full overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-accent-teal rounded-l-full"
              style={{ width: `${metrics.weightDistribution.front}%` }}
            />
            <div 
              className="absolute right-0 top-0 h-full bg-green-400 rounded-r-full"
              style={{ width: `${metrics.weightDistribution.rear}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs font-medium text-accent-teal">{metrics.weightDistribution.front}%</span>
            <span className="text-xs font-medium text-green-400">{metrics.weightDistribution.rear}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Unit Conversions */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Unit Conversions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-explorer-text-muted">Weight</div>
              <div className="font-medium text-explorer-text">{metrics.weightLbs} lbs</div>
            </div>
            <div>
              <div className="text-explorer-text-muted">Torque</div>
              <div className="font-medium text-explorer-text">{metrics.torqueLbFt} lb-ft</div>
            </div>
            <div>
              <div className="text-explorer-text-muted">Displacement</div>
              <div className="font-medium text-explorer-text">{metrics.displacementLiters}L</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsDisplay;
