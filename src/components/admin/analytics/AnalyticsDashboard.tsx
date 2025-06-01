
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, AlertTriangle, CheckCircle } from "lucide-react";
import { getConfigurationAnalytics, getComponentUtilization, type ConfigurationAnalytics, type ComponentUtilization } from "@/services/analytics/analyticsService";
import { analyzeMarketTrends } from "@/services/ai/aiRecommendationService";

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState<ConfigurationAnalytics[]>([]);
  const [componentData, setComponentData] = useState<ComponentUtilization[]>([]);
  const [marketTrends, setMarketTrends] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [analyticsData, utilization, trends] = await Promise.all([
        getConfigurationAnalytics(),
        getComponentUtilization(),
        analyzeMarketTrends()
      ]);
      
      setAnalytics(analyticsData);
      setComponentData(utilization);
      setMarketTrends(trends);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalViews = analytics.reduce((sum, item) => sum + item.total_views, 0);
  const totalCopies = analytics.reduce((sum, item) => sum + item.total_copies, 0);
  const avgPopularity = analytics.length > 0 ? analytics.reduce((sum, item) => sum + item.popularity_score, 0) / analytics.length : 0;

  const topConfigurations = analytics
    .sort((a, b) => b.popularity_score - a.popularity_score)
    .slice(0, 5);

  const trendData = Object.entries(marketTrends).map(([category, data]) => ({
    category,
    popularity: data.popularity,
    views: data.views,
    copies: data.copies
  }));

  const COLORS = ['#00D2B4', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-explorer-card border-explorer-chrome/30">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 text-accent-teal" />
              <div className="ml-2">
                <p className="text-sm font-medium text-explorer-text-muted">Total Views</p>
                <p className="text-2xl font-bold text-explorer-text">{totalViews.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-4 w-4 text-blue-400" />
              <div className="ml-2">
                <p className="text-sm font-medium text-explorer-text-muted">Total Copies</p>
                <p className="text-2xl font-bold text-explorer-text">{totalCopies.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <div className="ml-2">
                <p className="text-sm font-medium text-explorer-text-muted">Avg Popularity</p>
                <p className="text-2xl font-bold text-explorer-text">{Math.round(avgPopularity)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              <div className="ml-2">
                <p className="text-sm font-medium text-explorer-text-muted">Configurations</p>
                <p className="text-2xl font-bold text-explorer-text">{analytics.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="trends">Market Trends</TabsTrigger>
          <TabsTrigger value="quality">Data Quality</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-explorer-card border-explorer-chrome/30">
              <CardHeader>
                <CardTitle className="text-explorer-text">Top Performing Configurations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topConfigurations.map((config, index) => (
                    <div key={config.configuration_id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                          {index + 1}
                        </Badge>
                        <div>
                          <p className="font-medium text-explorer-text">Config {config.configuration_id.slice(0, 8)}</p>
                          <p className="text-sm text-explorer-text-muted">
                            {config.total_views} views • {config.total_copies} copies
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-accent-teal/20 text-accent-teal">
                        {config.popularity_score} points
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-explorer-card border-explorer-chrome/30">
              <CardHeader>
                <CardTitle className="text-explorer-text">Activity Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topConfigurations.slice(0, 5)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="configuration_id" 
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      tickFormatter={(value) => value.slice(0, 8)}
                    />
                    <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                    />
                    <Bar dataKey="total_views" fill="#00D2B4" name="Views" />
                    <Bar dataKey="total_copies" fill="#3B82F6" name="Copies" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="components" className="space-y-6">
          <Card className="bg-explorer-card border-explorer-chrome/30">
            <CardHeader>
              <CardTitle className="text-explorer-text">Component Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {componentData.slice(0, 10).map((component) => (
                  <div key={`${component.component_type}-${component.component_id}`} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-explorer-text capitalize">
                        {component.component_type.replace('_', ' ')} - {component.component_id.slice(0, 8)}
                      </span>
                      <span className="text-sm text-explorer-text-muted">
                        {component.usage_count} uses ({component.popularity_percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <Progress 
                      value={component.popularity_percentage} 
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-explorer-card border-explorer-chrome/30">
              <CardHeader>
                <CardTitle className="text-explorer-text">Category Popularity Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="category" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                    />
                    <Bar dataKey="popularity" fill="#00D2B4" name="Popularity Score" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-explorer-card border-explorer-chrome/30">
              <CardHeader>
                <CardTitle className="text-explorer-text">Market Share by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={trendData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="popularity"
                    >
                      {trendData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="quality" className="space-y-6">
          <Card className="bg-explorer-card border-explorer-chrome/30">
            <CardHeader>
              <CardTitle className="text-explorer-text">Data Quality Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                <p className="text-explorer-text-muted">
                  Data quality metrics will be calculated for configurations as they are analyzed.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
