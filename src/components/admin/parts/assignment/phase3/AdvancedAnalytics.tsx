
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Globe, 
  Calendar,
  ArrowUp,
  ArrowDown,
  Minus,
  Download
} from "lucide-react";

interface LifecycleAnalytics {
  componentId: string;
  componentType: string;
  name: string;
  introductionYear: number;
  retirementYear?: number;
  peakUsageYear: number;
  currentPopularity: number;
  trendDirection: 'up' | 'down' | 'stable';
  usageOverTime: { year: number; usage: number }[];
}

interface CostAnalysis {
  componentType: string;
  averageCost: number;
  costTrend: 'increasing' | 'decreasing' | 'stable';
  supplierCount: number;
  marketShare: { supplier: string; percentage: number }[];
}

interface MarketTrend {
  category: string;
  trend: string;
  impact: 'high' | 'medium' | 'low';
  timeframe: string;
  description: string;
  relatedComponents: string[];
}

const AdvancedAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState("lifecycle");
  const [timeRange, setTimeRange] = useState("1y");

  // Mock data for demonstration
  const lifecycleData: LifecycleAnalytics[] = [
    {
      componentId: '1',
      componentType: 'engine',
      name: 'V-Twin 883cc',
      introductionYear: 2010,
      retirementYear: 2022,
      peakUsageYear: 2018,
      currentPopularity: 45,
      trendDirection: 'down',
      usageOverTime: [
        { year: 2020, usage: 120 },
        { year: 2021, usage: 95 },
        { year: 2022, usage: 67 },
        { year: 2023, usage: 45 }
      ]
    },
    {
      componentId: '2',
      componentType: 'brake_system',
      name: 'ABS Dual Disc',
      introductionYear: 2015,
      peakUsageYear: 2023,
      currentPopularity: 89,
      trendDirection: 'up',
      usageOverTime: [
        { year: 2020, usage: 45 },
        { year: 2021, usage: 62 },
        { year: 2022, usage: 78 },
        { year: 2023, usage: 89 }
      ]
    }
  ];

  const costAnalysis: CostAnalysis[] = [
    {
      componentType: 'engine',
      averageCost: 3500,
      costTrend: 'increasing',
      supplierCount: 12,
      marketShare: [
        { supplier: 'OEM Direct', percentage: 45 },
        { supplier: 'Aftermarket Pro', percentage: 30 },
        { supplier: 'Budget Parts', percentage: 25 }
      ]
    },
    {
      componentType: 'brake_system',
      averageCost: 850,
      costTrend: 'stable',
      supplierCount: 8,
      marketShare: [
        { supplier: 'Brembo', percentage: 40 },
        { supplier: 'OEM', percentage: 35 },
        { supplier: 'Others', percentage: 25 }
      ]
    }
  ];

  const marketTrends: MarketTrend[] = [
    {
      category: 'Electric Integration',
      trend: 'Growing adoption of electric assist systems',
      impact: 'high',
      timeframe: '2024-2026',
      description: 'Increasing demand for hybrid and electric motorcycle components',
      relatedComponents: ['engine', 'brake_system']
    },
    {
      category: 'Sustainability Focus',
      trend: 'Recyclable and eco-friendly materials',
      impact: 'medium',
      timeframe: '2023-2025',
      description: 'Market shift towards sustainable component manufacturing',
      relatedComponents: ['frame', 'wheel']
    }
  ];

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up': return <ArrowUp className="h-4 w-4 text-green-400" />;
      case 'down': return <ArrowDown className="h-4 w-4 text-red-400" />;
      default: return <Minus className="h-4 w-4 text-yellow-400" />;
    }
  };

  const getTrendColor = (direction: string) => {
    switch (direction) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-explorer-text">
                <BarChart3 className="h-5 w-5 text-accent-teal" />
                Advanced Analytics & Reporting
              </CardTitle>
              <p className="text-sm text-explorer-text-muted mt-1">
                Component lifecycle, cost analysis, and market trend insights
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {['7d', '1m', '3m', '1y', 'all'].map((range) => (
                  <Button
                    key={range}
                    variant={timeRange === range ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeRange(range)}
                    className={timeRange === range ? "bg-accent-teal text-black" : ""}
                  >
                    {range}
                  </Button>
                ))}
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="lifecycle">Lifecycle Analytics</TabsTrigger>
          <TabsTrigger value="cost">Cost Analysis</TabsTrigger>
          <TabsTrigger value="trends">Market Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="lifecycle" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {lifecycleData.map((component) => (
              <Card key={component.componentId} className="bg-explorer-card border-explorer-chrome/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>{component.name}</span>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(component.trendDirection)}
                      <span className={`text-sm ${getTrendColor(component.trendDirection)}`}>
                        {component.currentPopularity}%
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-explorer-text-muted">Current Popularity</span>
                      <span className="text-explorer-text">{component.currentPopularity}%</span>
                    </div>
                    <Progress value={component.currentPopularity} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-explorer-text-muted">Introduced</span>
                      <div className="text-explorer-text font-medium">{component.introductionYear}</div>
                    </div>
                    <div>
                      <span className="text-explorer-text-muted">Peak Year</span>
                      <div className="text-explorer-text font-medium">{component.peakUsageYear}</div>
                    </div>
                  </div>

                  {component.retirementYear && (
                    <div className="pt-2 border-t border-explorer-chrome/30">
                      <div className="flex items-center gap-2 text-sm text-red-400">
                        <Calendar className="h-3 w-3" />
                        <span>Retired in {component.retirementYear}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="cost" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {costAnalysis.map((analysis) => (
              <Card key={analysis.componentType} className="bg-explorer-card border-explorer-chrome/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between capitalize">
                    <span>{analysis.componentType.replace('_', ' ')}</span>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-accent-teal" />
                      <span className="text-accent-teal">${analysis.averageCost}</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-explorer-text-muted">Cost Trend</span>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(analysis.costTrend === 'increasing' ? 'up' : 
                                    analysis.costTrend === 'decreasing' ? 'down' : 'stable')}
                      <span className={`text-sm capitalize ${getTrendColor(
                        analysis.costTrend === 'increasing' ? 'up' : 
                        analysis.costTrend === 'decreasing' ? 'down' : 'stable'
                      )}`}>
                        {analysis.costTrend}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-explorer-text-muted">Suppliers</span>
                      <span className="text-explorer-text">{analysis.supplierCount}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-explorer-text">Market Share</h4>
                    {analysis.marketShare.map((share, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-explorer-text-muted">{share.supplier}</span>
                        <span className="text-explorer-text">{share.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="space-y-4">
            {marketTrends.map((trend, index) => (
              <Card key={index} className="bg-explorer-card border-explorer-chrome/30">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2 mb-2">
                        <Globe className="h-5 w-5 text-accent-teal" />
                        {trend.category}
                      </CardTitle>
                      <p className="text-sm text-explorer-text-muted">{trend.description}</p>
                    </div>
                    <Badge className={getImpactColor(trend.impact)}>
                      {trend.impact} impact
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-explorer-text-muted">Trend</span>
                      <div className="text-sm text-explorer-text font-medium">{trend.trend}</div>
                    </div>
                    <div>
                      <span className="text-sm text-explorer-text-muted">Timeframe</span>
                      <div className="text-sm text-explorer-text font-medium">{trend.timeframe}</div>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm text-explorer-text-muted">Affected Components</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {trend.relatedComponents.map((component, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {component.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalytics;
