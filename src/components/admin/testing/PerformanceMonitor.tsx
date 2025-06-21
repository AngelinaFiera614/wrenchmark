
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Activity, 
  Clock, 
  Database, 
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  description: string;
}

const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);

  const { data: performanceData, isLoading, refetch } = useQuery({
    queryKey: ['performance-metrics'],
    queryFn: async () => {
      console.log('🚀 Running performance benchmarks...');
      const results: PerformanceMetric[] = [];
      
      // Test 1: Motorcycle models query with brands
      const start1 = performance.now();
      const { data: motorcycles, error: motorcyclesError } = await supabase
        .from('motorcycle_models')
        .select(`
          id,
          name,
          brands!motorcycle_models_brand_id_fkey(name)
        `)
        .limit(50);
      const duration1 = performance.now() - start1;
      
      results.push({
        name: 'Motorcycle Models + Brands Query',
        value: Math.round(duration1),
        unit: 'ms',
        status: duration1 < 200 ? 'excellent' : duration1 < 500 ? 'good' : duration1 < 1000 ? 'warning' : 'critical',
        description: `Query for ${motorcycles?.length || 0} motorcycles with brand data`
      });

      // Test 2: Component tables access
      const start2 = performance.now();
      const [engines, brakes, frames] = await Promise.all([
        supabase.from('engines').select('id, name').eq('is_draft', false).limit(10),
        supabase.from('brake_systems').select('id, type').eq('is_draft', false).limit(10),
        supabase.from('frames').select('id, type').eq('is_draft', false).limit(10)
      ]);
      const duration2 = performance.now() - start2;
      
      results.push({
        name: 'Component Tables Parallel Query',
        value: Math.round(duration2),
        unit: 'ms',
        status: duration2 < 300 ? 'excellent' : duration2 < 600 ? 'good' : duration2 < 1200 ? 'warning' : 'critical',
        description: `Parallel fetch of engine, brake, and frame components`
      });

      // Test 3: Deep join with configurations
      const start3 = performance.now();
      const { data: deepJoin } = await supabase
        .from('motorcycle_models')
        .select(`
          id,
          name,
          brands!motorcycle_models_brand_id_fkey(name),
          model_years(
            id,
            year,
            model_configurations(
              id,
              name,
              engine_id
            )
          )
        `)
        .limit(10);
      const duration3 = performance.now() - start3;
      
      results.push({
        name: 'Deep Join Query (3 levels)',
        value: Math.round(duration3),
        unit: 'ms',
        status: duration3 < 400 ? 'excellent' : duration3 < 800 ? 'good' : duration3 < 1500 ? 'warning' : 'critical',
        description: `Complex nested query with model years and configurations`
      });

      // Test 4: RLS filtering performance
      const start4 = performance.now();
      const { data: rlsTest } = await supabase
        .from('motorcycle_models')
        .select('id, name, is_draft')
        .eq('is_draft', false);
      const duration4 = performance.now() - start4;
      
      results.push({
        name: 'RLS Published Filter',
        value: Math.round(duration4),
        unit: 'ms',
        status: duration4 < 150 ? 'excellent' : duration4 < 400 ? 'good' : duration4 < 800 ? 'warning' : 'critical',
        description: `RLS policy filtering for published motorcycles only`
      });

      // Test 5: Large dataset query
      const start5 = performance.now();
      const { data: largeQuery } = await supabase
        .from('motorcycle_models')
        .select('id, name, brand_id, type')
        .limit(200);
      const duration5 = performance.now() - start5;
      
      results.push({
        name: 'Large Dataset Query',
        value: Math.round(duration5),
        unit: 'ms',
        status: duration5 < 250 ? 'excellent' : duration5 < 500 ? 'good' : duration5 < 1000 ? 'warning' : 'critical',
        description: `Fetching 200+ motorcycle records`
      });

      console.log('🚀 Performance benchmarks completed:', results);
      return results;
    },
    refetchInterval: 30000, // Re-run every 30 seconds
  });

  useEffect(() => {
    if (performanceData) {
      setMetrics(performanceData);
    }
  }, [performanceData]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'good': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-200';
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const averagePerformance = metrics.length > 0 
    ? Math.round(metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length)
    : 0;

  const excellentCount = metrics.filter(m => m.status === 'excellent').length;
  const goodCount = metrics.filter(m => m.status === 'good').length;
  const warningCount = metrics.filter(m => m.status === 'warning').length;
  const criticalCount = metrics.filter(m => m.status === 'critical').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-explorer-text">Performance Monitor</h2>
          <p className="text-explorer-text-muted">Real-time database query performance metrics</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => refetch()}
          disabled={isLoading}
        >
          <Activity className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Testing...' : 'Run Tests'}
        </Button>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Avg Response
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averagePerformance}ms</div>
            <div className="text-xs text-muted-foreground">
              {averagePerformance < 300 ? 'Excellent' : averagePerformance < 600 ? 'Good' : 'Needs attention'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Excellent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{excellentCount}</div>
            <div className="text-xs text-muted-foreground">Under 250ms</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Good</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{goodCount}</div>
            <div className="text-xs text-muted-foreground">250ms - 500ms</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600">Warning</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{warningCount}</div>
            <div className="text-xs text-muted-foreground">500ms - 1000ms</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600">Critical</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
            <div className="text-xs text-muted-foreground">Over 1000ms</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Query Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.map((metric, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(metric.status)}
                  <div>
                    <div className="font-medium">{metric.name}</div>
                    <div className="text-sm text-muted-foreground">{metric.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-mono text-lg font-bold">
                      {metric.value}{metric.unit}
                    </div>
                  </div>
                  <Badge className={getStatusColor(metric.status)}>
                    {metric.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Performance Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            {excellentCount >= 4 && (
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-4 w-4" />
                Excellent performance! Your database optimizations are working well.
              </div>
            )}
            {warningCount > 0 && (
              <div className="flex items-center gap-2 text-yellow-700">
                <AlertTriangle className="h-4 w-4" />
                Some queries are slower than optimal. Consider adding more indexes.
              </div>
            )}
            {criticalCount > 0 && (
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="h-4 w-4" />
                Critical performance issues detected. Database optimization needed.
              </div>
            )}
            <div className="text-muted-foreground">
              Tests run automatically every 30 seconds to monitor ongoing performance.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceMonitor;
