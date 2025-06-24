
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  TrendingUp, 
  TrendingDown, 
  Database, 
  Activity,
  PieChart,
  Users,
  Calendar
} from "lucide-react";

interface ComponentUsageStats {
  componentType: string;
  totalUsage: number;
  modelCount: number;
  trimCount: number;
  popularityScore: number;
  trend: 'up' | 'down' | 'stable';
}

interface AssignmentMetrics {
  totalModels: number;
  fullyAssigned: number;
  partiallyAssigned: number;
  unassigned: number;
  completionRate: number;
  avgComponentsPerModel: number;
}

interface AnalyticsDashboardProps {
  timeRange?: '7d' | '30d' | '90d' | '1y';
  onTimeRangeChange?: (range: '7d' | '30d' | '90d' | '1y') => void;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  timeRange = '30d',
  onTimeRangeChange
}) => {
  // Mock data - in real implementation, this would come from your analytics service
  const usageStats: ComponentUsageStats[] = [
    {
      componentType: 'Engine',
      totalUsage: 156,
      modelCount: 42,
      trimCount: 114,
      popularityScore: 89,
      trend: 'up'
    },
    {
      componentType: 'Brake System',
      totalUsage: 134,
      modelCount: 38,
      trimCount: 96,
      popularityScore: 76,
      trend: 'stable'
    },
    {
      componentType: 'Frame',
      totalUsage: 98,
      modelCount: 35,
      trimCount: 63,
      popularityScore: 65,
      trend: 'down'
    },
    {
      componentType: 'Suspension',
      totalUsage: 87,
      modelCount: 29,
      trimCount: 58,
      popularityScore: 58,
      trend: 'up'
    },
    {
      componentType: 'Wheels',
      totalUsage: 73,
      modelCount: 24,
      trimCount: 49,
      popularityScore: 48,
      trend: 'stable'
    }
  ];

  const assignmentMetrics: AssignmentMetrics = {
    totalModels: 85,
    fullyAssigned: 34,
    partiallyAssigned: 28,
    unassigned: 23,
    completionRate: 72.9,
    avgComponentsPerModel: 3.2
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-400" />;
      case 'down': return <TrendingDown className="h-3 w-3 text-red-400" />;
      default: return <Activity className="h-3 w-3 text-gray-400" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-explorer-text">Analytics Dashboard</h3>
          <p className="text-sm text-explorer-text-muted">Component assignment insights and trends</p>
        </div>
        <div className="flex gap-2">
          {(['7d', '30d', '90d', '1y'] as const).map((range) => (
            <button
              key={range}
              onClick={() => onTimeRangeChange?.(range)}
              className={`px-3 py-1 text-xs rounded ${
                timeRange === range 
                  ? 'bg-accent-teal text-black' 
                  : 'bg-explorer-chrome/20 text-explorer-text-muted hover:bg-explorer-chrome/30'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-accent-teal" />
              <span className="text-sm text-explorer-text-muted">Total Models</span>
            </div>
            <div className="text-2xl font-bold text-explorer-text mt-1">
              {assignmentMetrics.totalModels}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-green-400" />
              <span className="text-sm text-explorer-text-muted">Fully Assigned</span>
            </div>
            <div className="text-2xl font-bold text-green-400 mt-1">
              {assignmentMetrics.fullyAssigned}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-explorer-text-muted">Completion Rate</span>
            </div>
            <div className="text-2xl font-bold text-yellow-400 mt-1">
              {assignmentMetrics.completionRate}%
            </div>
          </CardContent>
        </Card>

        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <PieChart className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-explorer-text-muted">Avg Components</span>
            </div>
            <div className="text-2xl font-bold text-blue-400 mt-1">
              {assignmentMetrics.avgComponentsPerModel}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assignment Progress */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text text-base">Assignment Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-explorer-text">Overall Completion</span>
              <span className="text-explorer-text-muted">{assignmentMetrics.completionRate}%</span>
            </div>
            <Progress value={assignmentMetrics.completionRate} className="h-2" />
          </div>
          
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">{assignmentMetrics.fullyAssigned}</div>
              <div className="text-xs text-explorer-text-muted">Complete</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-400">{assignmentMetrics.partiallyAssigned}</div>
              <div className="text-xs text-explorer-text-muted">Partial</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-400">{assignmentMetrics.unassigned}</div>
              <div className="text-xs text-explorer-text-muted">Missing</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Component Usage Statistics */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text text-base flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Component Usage Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {usageStats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-explorer-text">
                      {stat.componentType}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {stat.totalUsage} uses
                    </Badge>
                    <div className={`flex items-center gap-1 ${getTrendColor(stat.trend)}`}>
                      {getTrendIcon(stat.trend)}
                      <span className="text-xs">{stat.trend}</span>
                    </div>
                  </div>
                  <span className="text-sm text-explorer-text-muted">
                    {stat.popularityScore}%
                  </span>
                </div>
                <Progress value={stat.popularityScore} className="h-1.5" />
                <div className="flex justify-between text-xs text-explorer-text-muted">
                  <span>{stat.modelCount} models</span>
                  <span>{stat.trimCount} trim levels</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text text-base">Performance Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded border border-blue-500/20">
              <div>
                <div className="text-sm font-medium text-blue-400">Most Popular Component</div>
                <div className="text-xs text-blue-300">Engines lead with 89% popularity score</div>
              </div>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                Trending Up
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded border border-yellow-500/20">
              <div>
                <div className="text-sm font-medium text-yellow-400">Assignment Bottleneck</div>
                <div className="text-xs text-yellow-300">27% of models still need frame assignments</div>
              </div>
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                Needs Attention
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-500/10 rounded border border-green-500/20">
              <div>
                <div className="text-sm font-medium text-green-400">Efficiency Gain</div>
                <div className="text-xs text-green-300">23% faster assignments this month</div>
              </div>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                Improved
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
