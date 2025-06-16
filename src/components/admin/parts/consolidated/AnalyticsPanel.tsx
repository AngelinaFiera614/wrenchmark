
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Database, CheckCircle } from "lucide-react";

interface AnalyticsPanelProps {
  models: any[];
  configurations: any[];
  completeness: { percentage: number; issues: string[] };
}

const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({
  models,
  configurations,
  completeness
}) => {
  const totalConfigurations = configurations.length;
  const completeConfigurations = configurations.filter(config => 
    config.engine_id && config.brake_system_id && config.frame_id
  ).length;

  const stats = [
    {
      title: "Total Models",
      value: models.length,
      icon: Database,
      color: "text-blue-400"
    },
    {
      title: "Total Configurations",
      value: totalConfigurations,
      icon: BarChart3,
      color: "text-purple-400"
    },
    {
      title: "Complete Configurations",
      value: completeConfigurations,
      icon: CheckCircle,
      color: "text-green-400"
    },
    {
      title: "Completion Rate",
      value: `${completeness.percentage}%`,
      icon: TrendingUp,
      color: completeness.percentage >= 80 ? "text-green-400" : 
             completeness.percentage >= 60 ? "text-yellow-400" : "text-red-400"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-explorer-card border-explorer-chrome/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-explorer-text-muted">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text">Data Quality Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-explorer-text">Overall Completeness</span>
                <Badge className={
                  completeness.percentage >= 80 ? "bg-green-500/20 text-green-400" :
                  completeness.percentage >= 60 ? "bg-yellow-500/20 text-yellow-400" :
                  "bg-red-500/20 text-red-400"
                }>
                  {completeness.percentage}%
                </Badge>
              </div>
              <div className="w-full bg-explorer-chrome/30 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    completeness.percentage >= 80 ? 'bg-green-400' :
                    completeness.percentage >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                  }`}
                  style={{ width: `${completeness.percentage}%` }}
                />
              </div>
            </div>

            {completeness.issues.length > 0 && (
              <div>
                <h4 className="font-medium text-explorer-text mb-2">Issues to Address:</h4>
                <ul className="space-y-1">
                  {completeness.issues.map((issue, index) => (
                    <li key={index} className="text-sm text-explorer-text-muted flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-400 rounded-full" />
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPanel;
