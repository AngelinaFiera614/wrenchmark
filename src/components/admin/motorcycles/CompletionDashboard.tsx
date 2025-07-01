
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle, XCircle, TrendingUp, User, FileText, Wrench, Image } from "lucide-react";
import { Motorcycle } from "@/types";
import { calculateDataCompletenessSync } from "@/utils/dataCompleteness";

interface CompletionDashboardProps {
  motorcycles: Motorcycle[];
  onFixSuggestion?: (motorcycleId: string, suggestion: string) => void;
}

const CompletionDashboard = ({ motorcycles, onFixSuggestion }: CompletionDashboardProps) => {
  const completionData = useMemo(() => {
    const motorcyclesWithCompletion = motorcycles.map(motorcycle => ({
      ...motorcycle,
      completion: calculateDataCompletenessSync(motorcycle)
    }));

    const stats = {
      total: motorcycles.length,
      excellent: motorcyclesWithCompletion.filter(m => m.completion.completionPercentage >= 90).length,
      good: motorcyclesWithCompletion.filter(m => m.completion.completionPercentage >= 70 && m.completion.completionPercentage < 90).length,
      fair: motorcyclesWithCompletion.filter(m => m.completion.completionPercentage >= 50 && m.completion.completionPercentage < 70).length,
      poor: motorcyclesWithCompletion.filter(m => m.completion.completionPercentage < 50).length,
      averageCompletion: Math.round(
        motorcyclesWithCompletion.reduce((acc, m) => acc + m.completion.completionPercentage, 0) / motorcycles.length
      )
    };

    // Analyze common missing fields
    const missingFieldCounts = motorcyclesWithCompletion.reduce((acc, motorcycle) => {
      motorcycle.completion.missingFields.forEach(field => {
        acc[field] = (acc[field] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    const topMissingFields = Object.entries(missingFieldCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8);

    // Category breakdown
    const categoryBreakdown = motorcyclesWithCompletion.reduce((acc, motorcycle) => {
      const category = motorcycle.type || 'Unknown';
      if (!acc[category]) {
        acc[category] = { total: 0, averageCompletion: 0, motorcycles: [] };
      }
      acc[category].total += 1;
      acc[category].motorcycles.push(motorcycle);
      return acc;
    }, {} as Record<string, { total: number; averageCompletion: number; motorcycles: any[] }>);

    // Calculate averages for categories
    Object.values(categoryBreakdown).forEach(category => {
      category.averageCompletion = Math.round(
        category.motorcycles.reduce((acc, m) => acc + m.completion.completionPercentage, 0) / category.total
      );
    });

    return {
      motorcyclesWithCompletion,
      stats,
      topMissingFields,
      categoryBreakdown
    };
  }, [motorcycles]);

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-400";
    if (percentage >= 70) return "text-yellow-400";
    if (percentage >= 50) return "text-orange-400";
    return "text-red-400";
  };

  const getSectionStats = (sectionKey: string) => {
    const totals = completionData.motorcyclesWithCompletion.reduce((acc, m) => {
      const section = m.completion.breakdown[sectionKey as keyof typeof m.completion.breakdown];
      acc.total += section.percentage;
      acc.count += 1;
      return acc;
    }, { total: 0, count: 0 });

    return Math.round(totals.total / totals.count);
  };

  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-explorer-text-muted">Excellent (90%+)</p>
                <p className="text-2xl font-bold text-green-400">{completionData.stats.excellent}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-explorer-text-muted">Good (70-89%)</p>
                <p className="text-2xl font-bold text-yellow-400">{completionData.stats.good}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-explorer-text-muted">Fair (50-69%)</p>
                <p className="text-2xl font-bold text-orange-400">{completionData.stats.fair}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-explorer-text-muted">Poor (&lt;50%)</p>
                <p className="text-2xl font-bold text-red-400">{completionData.stats.poor}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-explorer-text-muted">Average</p>
                <p className="text-2xl font-bold text-explorer-text">{completionData.stats.averageCompletion}%</p>
              </div>
              <div className="w-8">
                <Progress value={completionData.stats.averageCompletion} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section Performance */}
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader>
            <CardTitle className="text-explorer-text flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Section Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { key: 'basicInfo', label: 'Basic Info', icon: User, weight: '30%' },
                { key: 'specifications', label: 'Specifications', icon: FileText, weight: '35%' },
                { key: 'components', label: 'Components', icon: Wrench, weight: '25%' },
                { key: 'media', label: 'Media', icon: Image, weight: '10%' }
              ].map(({ key, label, icon: Icon, weight }) => {
                const avgPercentage = getSectionStats(key);
                return (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-explorer-text-muted" />
                        <span className="text-explorer-text">{label}</span>
                        <Badge variant="outline" className="text-xs">{weight}</Badge>
                      </div>
                      <span className={`text-sm font-medium ${getCompletionColor(avgPercentage)}`}>
                        {avgPercentage}%
                      </span>
                    </div>
                    <Progress value={avgPercentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Most Common Missing Fields */}
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader>
            <CardTitle className="text-explorer-text">Most Common Missing Fields</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completionData.topMissingFields.map(([field, count]) => (
                <div key={field} className="flex items-center justify-between">
                  <span className="text-explorer-text capitalize">
                    {field.replace(/_/g, ' ').replace(' component', '')}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-red-400 border-red-400/30">
                      {count} missing
                    </Badge>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="bg-explorer-dark border-explorer-chrome/30 text-xs"
                      onClick={() => onFixSuggestion?.(field, `Fix ${field} for ${count} motorcycles`)}
                    >
                      Bulk Fix
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text">Completion by Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(completionData.categoryBreakdown)
              .sort(([,a], [,b]) => b.total - a.total)
              .map(([category, data]) => (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-explorer-text font-medium">{category}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${getCompletionColor(data.averageCompletion)}`}>
                        {data.averageCompletion}%
                      </span>
                      <Badge variant="outline" className="text-xs">{data.total}</Badge>
                    </div>
                  </div>
                  <Progress value={data.averageCompletion} className="h-2" />
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompletionDashboard;
