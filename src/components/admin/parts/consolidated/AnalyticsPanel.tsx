
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

interface AnalyticsPanelProps {
  models: any[];
  configurations: any[];
  completeness: {
    percentage: number;
    issues: string[];
  };
}

const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({
  models,
  configurations,
  completeness
}) => {
  const getComponentStats = () => {
    const stats = {
      engine: 0,
      brake_system: 0,
      frame: 0,
      suspension: 0,
      wheel: 0
    };

    configurations.forEach(config => {
      Object.keys(stats).forEach(component => {
        if (config[`${component}_id`]) {
          stats[component as keyof typeof stats]++;
        }
      });
    });

    return stats;
  };

  const getBrandStats = () => {
    const brandCounts: Record<string, number> = {};
    models.forEach(model => {
      const brandName = model.brands?.name || 'Unknown';
      brandCounts[brandName] = (brandCounts[brandName] || 0) + 1;
    });
    return brandCounts;
  };

  const getHealthScore = () => {
    if (configurations.length === 0) return 0;
    
    const requiredComponents = ['engine_id', 'brake_system_id', 'frame_id', 'suspension_id', 'wheel_id'];
    const totalChecks = configurations.length * requiredComponents.length;
    let passedChecks = 0;

    configurations.forEach(config => {
      requiredComponents.forEach(component => {
        if (config[component]) passedChecks++;
      });
    });

    return Math.round((passedChecks / totalChecks) * 100);
  };

  const componentStats = getComponentStats();
  const brandStats = getBrandStats();
  const healthScore = getHealthScore();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Overall Health */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-accent-teal mb-2">
              {healthScore}%
            </div>
            <p className="text-sm text-explorer-text-muted">
              Data Completeness Score
            </p>
          </div>
          
          <Progress value={healthScore} className="w-full" />
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Total Models</span>
              <Badge variant="secondary">{models.length}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Total Configurations</span>
              <Badge variant="secondary">{configurations.length}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Complete Configs</span>
              <Badge variant="secondary">
                {configurations.filter(c => 
                  c.engine_id && c.brake_system_id && c.frame_id && c.suspension_id && c.wheel_id
                ).length}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Component Coverage */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Component Coverage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(componentStats).map(([component, count]) => {
            const percentage = configurations.length > 0 ? 
              Math.round((count / configurations.length) * 100) : 0;
            
            return (
              <div key={component} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="capitalize">
                    {component.replace('_', ' ')}
                  </span>
                  <span className="text-explorer-text-muted">
                    {count}/{configurations.length} ({percentage}%)
                  </span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Brand Distribution */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Brand Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(brandStats)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 8)
            .map(([brand, count]) => (
              <div key={brand} className="flex items-center justify-between">
                <span className="text-sm font-medium truncate">{brand}</span>
                <Badge variant="outline">{count}</Badge>
              </div>
            ))}
        </CardContent>
      </Card>

      {/* Data Issues */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Data Issues
          </CardTitle>
        </CardHeader>
        <CardContent>
          {completeness.issues.length > 0 ? (
            <div className="space-y-2">
              {completeness.issues.map((issue, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span className="text-explorer-text-muted">{issue}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <p className="text-sm text-explorer-text-muted">
                No data issues detected
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 gap-2">
            <div className="p-2 bg-explorer-dark rounded text-center">
              <div className="text-sm font-medium">Export Data</div>
              <div className="text-xs text-explorer-text-muted">Coming Soon</div>
            </div>
            <div className="p-2 bg-explorer-dark rounded text-center">
              <div className="text-sm font-medium">Import Data</div>
              <div className="text-xs text-explorer-text-muted">Coming Soon</div>
            </div>
            <div className="p-2 bg-explorer-dark rounded text-center">
              <div className="text-sm font-medium">Bulk Validate</div>
              <div className="text-xs text-explorer-text-muted">Coming Soon</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPanel;
