
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  AlertCircle,
  CheckCircle2,
  Clock,
  Zap
} from "lucide-react";

interface ComponentPerformanceMetrics {
  componentId: string;
  componentName: string;
  componentType: string;
  usageCount: number;
  successRate: number;
  avgAssignmentTime: number;
  popularityTrend: 'up' | 'down' | 'stable';
  issueCount: number;
  compatibilityScore: number;
}

interface ComponentAnalyticsProps {
  componentType?: string;
  timeRange?: '7d' | '30d' | '90d';
  showTrends?: boolean;
}

const ComponentAnalytics: React.FC<ComponentAnalyticsProps> = ({
  componentType,
  timeRange = '30d',
  showTrends = true
}) => {
  // Mock performance data
  const performanceMetrics: ComponentPerformanceMetrics[] = [
    {
      componentId: 'engine-vtwin-883',
      componentName: 'V-Twin 883cc',
      componentType: 'engine',
      usageCount: 45,
      successRate: 94.2,
      avgAssignmentTime: 2.3,
      popularityTrend: 'up',
      issueCount: 2,
      compatibilityScore: 89
    },
    {
      componentId: 'brake-abs-dual',
      componentName: 'ABS Dual Disc',
      componentType: 'brake_system',
      usageCount: 38,
      successRate: 97.1,
      avgAssignmentTime: 1.8,
      popularityTrend: 'stable',
      issueCount: 1,
      compatibilityScore: 95
    },
    {
      componentId: 'frame-steel-tubular',
      componentName: 'Steel Tubular Frame',
      componentType: 'frame',
      usageCount: 28,
      successRate: 86.7,
      avgAssignmentTime: 3.1,
      popularityTrend: 'down',
      issueCount: 4,
      compatibilityScore: 78
    }
  ];

  const filteredMetrics = componentType 
    ? performanceMetrics.filter(m => m.componentType === componentType)
    : performanceMetrics;

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-400" />;
      case 'down': return <TrendingDown className="h-3 w-3 text-red-400" />;
      default: return <Target className="h-3 w-3 text-gray-400" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 75) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getPerformanceBadgeColor = (score: number) => {
    if (score >= 90) return 'bg-green-500/10 text-green-400 border-green-500/30';
    if (score >= 75) return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
    return 'bg-red-500/10 text-red-400 border-red-500/30';
  };

  // Calculate aggregate metrics
  const totalUsage = filteredMetrics.reduce((sum, m) => sum + m.usageCount, 0);
  const avgSuccessRate = filteredMetrics.reduce((sum, m) => sum + m.successRate, 0) / filteredMetrics.length;
  const avgCompatibilityScore = filteredMetrics.reduce((sum, m) => sum + m.compatibilityScore, 0) / filteredMetrics.length;
  const totalIssues = filteredMetrics.reduce((sum, m) => sum + m.issueCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-explorer-text flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-accent-teal" />
            Component Analytics
          </h3>
          <p className="text-sm text-explorer-text-muted">
            Performance metrics and insights for {componentType || 'all'} components
          </p>
        </div>
        <Badge variant="outline" className="text-accent-teal">
          {timeRange} view
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-accent-teal" />
              <span className="text-sm text-explorer-text-muted">Total Usage</span>
            </div>
            <div className="text-2xl font-bold text-explorer-text mt-1">
              {totalUsage}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              <span className="text-sm text-explorer-text-muted">Success Rate</span>
            </div>
            <div className="text-2xl font-bold text-green-400 mt-1">
              {avgSuccessRate.toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-explorer-text-muted">Compatibility</span>
            </div>
            <div className="text-2xl font-bold text-blue-400 mt-1">
              {avgCompatibilityScore.toFixed(0)}%
            </div>
          </CardContent>
        </Card>

        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-explorer-text-muted">Issues</span>
            </div>
            <div className="text-2xl font-bold text-yellow-400 mt-1">
              {totalIssues}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Component Performance */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text">Component Performance Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredMetrics.map((metric, index) => (
              <div key={index} className="p-4 border border-explorer-chrome/30 rounded-lg space-y-3">
                {/* Component Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-medium text-explorer-text">{metric.componentName}</div>
                      <div className="text-sm text-explorer-text-muted capitalize">
                        {metric.componentType.replace('_', ' ')}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {metric.usageCount} uses
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {showTrends && (
                      <div className={`flex items-center gap-1 ${getTrendColor(metric.popularityTrend)}`}>
                        {getTrendIcon(metric.popularityTrend)}
                        <span className="text-xs capitalize">{metric.popularityTrend}</span>
                      </div>
                    )}
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getPerformanceBadgeColor(metric.compatibilityScore)}`}
                    >
                      {metric.compatibilityScore}% compat
                    </Badge>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-explorer-text-muted">Success Rate</span>
                      <span className={getPerformanceColor(metric.successRate)}>
                        {metric.successRate}%
                      </span>
                    </div>
                    <Progress value={metric.successRate} className="h-1.5" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-explorer-text-muted">Compatibility</span>
                      <span className={getPerformanceColor(metric.compatibilityScore)}>
                        {metric.compatibilityScore}%
                      </span>
                    </div>
                    <Progress value={metric.compatibilityScore} className="h-1.5" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-explorer-text-muted">Avg Time</span>
                      <span className="text-explorer-text">
                        {metric.avgAssignmentTime}s
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-explorer-text-muted" />
                      <span className="text-xs text-explorer-text-muted">
                        {metric.issueCount} issues reported
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text">Performance Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Top Performer */}
            {filteredMetrics.length > 0 && (
              <div className="flex items-center justify-between p-3 bg-green-500/10 rounded border border-green-500/20">
                <div>
                  <div className="text-sm font-medium text-green-400">Top Performer</div>
                  <div className="text-xs text-green-300">
                    {filteredMetrics.reduce((best, current) => 
                      current.successRate > best.successRate ? current : best
                    ).componentName} - {filteredMetrics.reduce((best, current) => 
                      current.successRate > best.successRate ? current : best
                    ).successRate}% success rate
                  </div>
                </div>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  Excellent
                </Badge>
              </div>
            )}

            {/* Most Issues */}
            {filteredMetrics.length > 0 && (
              <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded border border-yellow-500/20">
                <div>
                  <div className="text-sm font-medium text-yellow-400">Needs Attention</div>
                  <div className="text-xs text-yellow-300">
                    {filteredMetrics.reduce((worst, current) => 
                      current.issueCount > worst.issueCount ? current : worst
                    ).componentName} - {filteredMetrics.reduce((worst, current) => 
                      current.issueCount > worst.issueCount ? current : worst
                    ).issueCount} issues reported
                  </div>
                </div>
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  Review Needed
                </Badge>
              </div>
            )}

            {/* Trending Up */}
            {filteredMetrics.some(m => m.popularityTrend === 'up') && (
              <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded border border-blue-500/20">
                <div>
                  <div className="text-sm font-medium text-blue-400">Rising Star</div>
                  <div className="text-xs text-blue-300">
                    {filteredMetrics.find(m => m.popularityTrend === 'up')?.componentName} showing strong upward trend
                  </div>
                </div>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  Trending Up
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComponentAnalytics;
