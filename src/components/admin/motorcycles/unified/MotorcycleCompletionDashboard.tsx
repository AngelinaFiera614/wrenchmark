
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, AlertTriangle, TrendingUp, Filter } from "lucide-react";
import { Motorcycle } from "@/types";
import { calculateDataCompleteness } from "@/utils/dataCompleteness";

interface MotorcycleCompletionDashboardProps {
  motorcycles: Motorcycle[];
}

const MotorcycleCompletionDashboard = ({ motorcycles }: MotorcycleCompletionDashboardProps) => {
  const [filterBy, setFilterBy] = useState<"all" | "brand" | "category">("all");
  const [selectedFilter, setSelectedFilter] = useState("");

  // Calculate completion statistics
  const completionStats = motorcycles.map(motorcycle => ({
    ...motorcycle,
    completion: calculateDataCompleteness(motorcycle)
  }));

  const overallStats = {
    total: motorcycles.length,
    complete: completionStats.filter(m => m.completion.completionPercentage === 100).length,
    mostlyComplete: completionStats.filter(m => m.completion.completionPercentage >= 75 && m.completion.completionPercentage < 100).length,
    incomplete: completionStats.filter(m => m.completion.completionPercentage < 75).length,
    averageCompletion: Math.round(completionStats.reduce((acc, m) => acc + m.completion.completionPercentage, 0) / motorcycles.length)
  };

  // Group by completion level
  const byCompletion = {
    complete: completionStats.filter(m => m.completion.completionPercentage === 100),
    mostlyComplete: completionStats.filter(m => m.completion.completionPercentage >= 75 && m.completion.completionPercentage < 100),
    incomplete: completionStats.filter(m => m.completion.completionPercentage < 75)
  };

  // Most common missing fields
  const missingFieldCounts = completionStats.reduce((acc, motorcycle) => {
    motorcycle.completion.missingCriticalFields.forEach(field => {
      acc[field] = (acc[field] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const topMissingFields = Object.entries(missingFieldCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const getCompletionColor = (percentage: number) => {
    if (percentage === 100) return "text-green-400";
    if (percentage >= 75) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-explorer-text-muted">Complete (100%)</p>
                <p className="text-2xl font-bold text-green-400">{overallStats.complete}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-explorer-text-muted">Mostly Complete (75%+)</p>
                <p className="text-2xl font-bold text-yellow-400">{overallStats.mostlyComplete}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-explorer-text-muted">Incomplete (&lt;75%)</p>
                <p className="text-2xl font-bold text-red-400">{overallStats.incomplete}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-explorer-text-muted">Average Completion</p>
                <p className="text-2xl font-bold text-explorer-text">{overallStats.averageCompletion}%</p>
              </div>
              <div className="w-8">
                <Progress value={overallStats.averageCompletion} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Common Missing Fields */}
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader>
            <CardTitle className="text-explorer-text">Most Common Missing Fields</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topMissingFields.map(([field, count]) => (
                <div key={field} className="flex items-center justify-between">
                  <span className="text-explorer-text capitalize">{field.replace(/_/g, ' ')}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-red-400 border-red-400">
                      {count} missing
                    </Badge>
                    <Button size="sm" variant="outline">
                      Bulk Fix
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Completion by Category */}
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader>
            <CardTitle className="text-explorer-text">Completion by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['Sport', 'Cruiser', 'Adventure', 'Touring', 'Standard'].map(category => {
                const categoryMotorcycles = completionStats.filter(m => m.category === category);
                if (categoryMotorcycles.length === 0) return null;
                
                const avgCompletion = Math.round(
                  categoryMotorcycles.reduce((acc, m) => acc + m.completion.completionPercentage, 0) / categoryMotorcycles.length
                );
                
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-explorer-text">{category}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm ${getCompletionColor(avgCompletion)}`}>
                          {avgCompletion}%
                        </span>
                        <Badge variant="outline">{categoryMotorcycles.length}</Badge>
                      </div>
                    </div>
                    <Progress value={avgCompletion} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed List */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text flex items-center justify-between">
            Detailed Completion Status
            <div className="flex items-center gap-2">
              <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="brand">By Brand</SelectItem>
                  <SelectItem value="category">By Category</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {completionStats
              .sort((a, b) => b.completion.completionPercentage - a.completion.completionPercentage)
              .map((motorcycle) => (
                <div key={motorcycle.id} className="flex items-center justify-between p-3 bg-explorer-dark rounded-lg border border-explorer-chrome/20">
                  <div className="flex-1">
                    <div className="font-medium text-explorer-text">
                      {motorcycle.make} {motorcycle.model}
                    </div>
                    <div className="text-sm text-explorer-text-muted">
                      {motorcycle.category} • {motorcycle.year || 'No year'}
                    </div>
                    {motorcycle.completion.missingCriticalFields.length > 0 && (
                      <div className="text-xs text-red-400 mt-1">
                        Missing: {motorcycle.completion.missingCriticalFields.slice(0, 3).join(', ')}
                        {motorcycle.completion.missingCriticalFields.length > 3 && ' +more'}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-24">
                      <Progress value={motorcycle.completion.completionPercentage} className="h-2" />
                    </div>
                    <span className={`text-sm min-w-[3rem] text-right ${getCompletionColor(motorcycle.completion.completionPercentage)}`}>
                      {motorcycle.completion.completionPercentage}%
                    </span>
                    <Button size="sm" variant="outline">
                      Fix
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MotorcycleCompletionDashboard;
