
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Zap, 
  Clock, 
  Activity, 
  TrendingUp, 
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'poor';
  threshold: number;
  description: string;
}

interface LoadTest {
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  duration?: number;
  metrics?: PerformanceMetric[];
  description: string;
}

const PerformanceTester = () => {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string | null>(null);
  
  const [loadTests, setLoadTests] = useState<LoadTest[]>([
    {
      name: "Component Search Performance",
      status: 'pending',
      description: "Test search performance across large component datasets"
    },
    {
      name: "Assignment Operations Load",
      status: 'pending', 
      description: "Test concurrent component assignment operations"
    },
    {
      name: "Real-time Update Performance",
      status: 'pending',
      description: "Test UI update performance during data changes"
    },
    {
      name: "Component Filter Performance",
      status: 'pending',
      description: "Test filtering performance with complex criteria"
    },
    {
      name: "Data Loading Stress Test",
      status: 'pending',
      description: "Test system behavior under heavy data loads"
    }
  ]);

  const [systemMetrics, setSystemMetrics] = useState<PerformanceMetric[]>([
    {
      name: "Average Response Time",
      value: 0,
      unit: "ms",
      status: 'good',
      threshold: 200,
      description: "Average API response time"
    },
    {
      name: "Memory Usage",
      value: 0,
      unit: "MB",
      status: 'good',
      threshold: 100,
      description: "Client-side memory consumption"
    },
    {
      name: "Component Load Time",
      value: 0,
      unit: "ms",
      status: 'good',
      threshold: 1000,
      description: "Time to load component data"
    },
    {
      name: "Search Response Time",
      value: 0,
      unit: "ms",
      status: 'good',
      threshold: 500,
      description: "Component search response time"
    },
    {
      name: "Assignment Success Rate",
      value: 0,
      unit: "%",
      status: 'good',
      threshold: 95,
      description: "Component assignment success rate"
    }
  ]);

  const runPerformanceTest = async (testIndex: number) => {
    const testName = loadTests[testIndex].name;
    setCurrentTest(testName);
    
    setLoadTests(prev => {
      const newTests = [...prev];
      newTests[testIndex] = { ...newTests[testIndex], status: 'running' };
      return newTests;
    });

    try {
      const startTime = Date.now();
      let testMetrics: PerformanceMetric[] = [];

      switch (testName) {
        case "Component Search Performance":
          testMetrics = await runSearchPerformanceTest();
          break;
        case "Assignment Operations Load":
          testMetrics = await runAssignmentLoadTest();
          break;
        case "Real-time Update Performance":
          testMetrics = await runRealTimeUpdateTest();
          break;
        case "Component Filter Performance":
          testMetrics = await runFilterPerformanceTest();
          break;
        case "Data Loading Stress Test":
          testMetrics = await runDataLoadingStressTest();
          break;
        default:
          throw new Error("Unknown test type");
      }

      const duration = Date.now() - startTime;

      setLoadTests(prev => {
        const newTests = [...prev];
        newTests[testIndex] = {
          ...newTests[testIndex],
          status: 'completed',
          duration,
          metrics: testMetrics
        };
        return newTests;
      });

      // Update system metrics with test results
      updateSystemMetrics(testMetrics);

    } catch (error) {
      setLoadTests(prev => {
        const newTests = [...prev];
        newTests[testIndex] = {
          ...newTests[testIndex],
          status: 'failed'
        };
        return newTests;
      });

      toast({
        variant: "destructive",
        title: "Test Failed",
        description: `${testName} failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }

    setCurrentTest(null);
  };

  const runSearchPerformanceTest = async (): Promise<PerformanceMetric[]> => {
    const searchQueries = ['engine', 'brake', '1000cc', 'honda', 'v4'];
    const results: number[] = [];

    for (const query of searchQueries) {
      const startTime = performance.now();
      
      // Simulate search operation
      await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 50));
      
      const endTime = performance.now();
      results.push(endTime - startTime);
    }

    const avgResponseTime = results.reduce((sum, time) => sum + time, 0) / results.length;
    const maxResponseTime = Math.max(...results);

    return [
      {
        name: "Average Search Time",
        value: Math.round(avgResponseTime),
        unit: "ms",
        status: avgResponseTime < 200 ? 'good' : avgResponseTime < 500 ? 'warning' : 'poor',
        threshold: 200,
        description: "Average time for search queries"
      },
      {
        name: "Max Search Time",
        value: Math.round(maxResponseTime),
        unit: "ms",
        status: maxResponseTime < 500 ? 'good' : maxResponseTime < 1000 ? 'warning' : 'poor',
        threshold: 500,
        description: "Maximum time for any search query"
      }
    ];
  };

  const runAssignmentLoadTest = async (): Promise<PerformanceMetric[]> => {
    const concurrentOperations = 10;
    const operationTimes: number[] = [];

    // Simulate concurrent assignment operations
    const promises = Array.from({ length: concurrentOperations }, async () => {
      const startTime = performance.now();
      
      // Simulate assignment operation
      await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 100));
      
      const endTime = performance.now();
      operationTimes.push(endTime - startTime);
    });

    await Promise.all(promises);

    const avgOperationTime = operationTimes.reduce((sum, time) => sum + time, 0) / operationTimes.length;
    const successRate = (operationTimes.filter(time => time < 1000).length / operationTimes.length) * 100;

    return [
      {
        name: "Concurrent Assignment Time",
        value: Math.round(avgOperationTime),
        unit: "ms",
        status: avgOperationTime < 300 ? 'good' : avgOperationTime < 600 ? 'warning' : 'poor',
        threshold: 300,
        description: "Average time for concurrent assignments"
      },
      {
        name: "Assignment Success Rate",
        value: Math.round(successRate),
        unit: "%",
        status: successRate > 95 ? 'good' : successRate > 90 ? 'warning' : 'poor',
        threshold: 95,
        description: "Percentage of successful assignments"
      }
    ];
  };

  const runRealTimeUpdateTest = async (): Promise<PerformanceMetric[]> => {
    const updateCycles = 20;
    const updateTimes: number[] = [];

    for (let i = 0; i < updateCycles; i++) {
      const startTime = performance.now();
      
      // Simulate real-time update
      await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 20));
      
      const endTime = performance.now();
      updateTimes.push(endTime - startTime);
    }

    const avgUpdateTime = updateTimes.reduce((sum, time) => sum + time, 0) / updateTimes.length;
    const updateFrequency = 1000 / avgUpdateTime; // Updates per second

    return [
      {
        name: "UI Update Time",
        value: Math.round(avgUpdateTime),
        unit: "ms",
        status: avgUpdateTime < 50 ? 'good' : avgUpdateTime < 100 ? 'warning' : 'poor',
        threshold: 50,
        description: "Average UI update response time"
      },
      {
        name: "Update Frequency",
        value: Math.round(updateFrequency),
        unit: "ops/s",
        status: updateFrequency > 20 ? 'good' : updateFrequency > 10 ? 'warning' : 'poor',
        threshold: 20,
        description: "Real-time updates per second"
      }
    ];
  };

  const runFilterPerformanceTest = async (): Promise<PerformanceMetric[]> => {
    const filterCombinations = [
      { type: 'engine', displacement: '1000' },
      { type: 'brake', brand: 'brembo' },
      { type: 'suspension', travel: '150' },
      { type: 'engine', power: '150' },
      { type: 'frame', material: 'aluminum' }
    ];

    const filterTimes: number[] = [];

    for (const filter of filterCombinations) {
      const startTime = performance.now();
      
      // Simulate complex filtering operation
      await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 50));
      
      const endTime = performance.now();
      filterTimes.push(endTime - startTime);
    }

    const avgFilterTime = filterTimes.reduce((sum, time) => sum + time, 0) / filterTimes.length;

    return [
      {
        name: "Filter Response Time",
        value: Math.round(avgFilterTime),
        unit: "ms",
        status: avgFilterTime < 100 ? 'good' : avgFilterTime < 250 ? 'warning' : 'poor',
        threshold: 100,
        description: "Average filter operation time"
      }
    ];
  };

  const runDataLoadingStressTest = async (): Promise<PerformanceMetric[]> => {
    const dataSetSizes = [100, 500, 1000, 2000];
    const loadTimes: number[] = [];

    for (const size of dataSetSizes) {
      const startTime = performance.now();
      
      // Simulate loading large datasets
      await new Promise(resolve => setTimeout(resolve, size * 0.5 + Math.random() * 100));
      
      const endTime = performance.now();
      loadTimes.push(endTime - startTime);
    }

    const maxLoadTime = Math.max(...loadTimes);
    const avgLoadTime = loadTimes.reduce((sum, time) => sum + time, 0) / loadTimes.length;

    return [
      {
        name: "Large Dataset Load Time",
        value: Math.round(maxLoadTime),
        unit: "ms",
        status: maxLoadTime < 2000 ? 'good' : maxLoadTime < 5000 ? 'warning' : 'poor',
        threshold: 2000,
        description: "Time to load largest dataset"
      },
      {
        name: "Average Load Time",
        value: Math.round(avgLoadTime),
        unit: "ms",
        status: avgLoadTime < 1000 ? 'good' : avgLoadTime < 2500 ? 'warning' : 'poor',
        threshold: 1000,
        description: "Average dataset load time"
      }
    ];
  };

  const updateSystemMetrics = (testMetrics: PerformanceMetric[]) => {
    setSystemMetrics(prev => {
      const newMetrics = [...prev];
      
      testMetrics.forEach(testMetric => {
        const systemMetricIndex = newMetrics.findIndex(m => 
          m.name.toLowerCase().includes(testMetric.name.toLowerCase().split(' ')[0])
        );
        
        if (systemMetricIndex >= 0) {
          newMetrics[systemMetricIndex] = {
            ...newMetrics[systemMetricIndex],
            value: testMetric.value,
            status: testMetric.status
          };
        }
      });
      
      return newMetrics;
    });
  };

  const runAllTests = async () => {
    setIsRunning(true);
    
    toast({
      title: "Starting Performance Tests",
      description: `Running ${loadTests.length} performance tests`
    });

    for (let i = 0; i < loadTests.length; i++) {
      await runPerformanceTest(i);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsRunning(false);
    
    const completedTests = loadTests.filter(test => test.status === 'completed').length;
    const failedTests = loadTests.filter(test => test.status === 'failed').length;
    
    toast({
      title: "Performance Tests Complete",
      description: `${completedTests} completed, ${failedTests} failed`,
      variant: failedTests > 0 ? "destructive" : "default"
    });
  };

  const getMetricStatusIcon = (status: PerformanceMetric['status']) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'poor':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const getTestStatusIcon = (status: LoadTest['status']) => {
    switch (status) {
      case 'running':
        return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getOverallProgress = () => {
    const completedTests = loadTests.filter(test => test.status === 'completed' || test.status === 'failed');
    return Math.round((completedTests.length / loadTests.length) * 100);
  };

  return (
    <div className="space-y-6 p-6 bg-explorer-dark">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-explorer-text">Performance Testing</h1>
          <p className="text-explorer-text-muted">System performance and load testing dashboard</p>
        </div>
        <Button
          onClick={runAllTests}
          disabled={isRunning}
          className="bg-accent-teal text-black hover:bg-accent-teal/80"
        >
          <Zap className="h-4 w-4 mr-2" />
          Run All Tests
        </Button>
      </div>

      {/* Overall Progress */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-explorer-text">Test Progress</h3>
            <Badge variant="outline" className="bg-explorer-dark">
              {getOverallProgress()}% Complete
            </Badge>
          </div>
          <Progress value={getOverallProgress()} className="w-full mb-2" />
          {currentTest && (
            <p className="text-sm text-explorer-text-muted">
              Currently running: {currentTest}
            </p>
          )}
        </CardContent>
      </Card>

      {/* System Metrics */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {systemMetrics.map((metric, index) => (
              <div
                key={index}
                className="p-4 bg-explorer-dark rounded-lg border border-explorer-chrome/20"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getMetricStatusIcon(metric.status)}
                    <span className="font-medium text-explorer-text">{metric.name}</span>
                  </div>
                  <Badge variant="outline" className={`text-xs ${
                    metric.status === 'good' ? 'text-green-400' :
                    metric.status === 'warning' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {metric.status}
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-explorer-text mb-1">
                  {metric.value} {metric.unit}
                </div>
                <div className="text-xs text-explorer-text-muted">
                  {metric.description}
                </div>
                <div className="text-xs text-explorer-text-muted mt-1">
                  Threshold: {metric.threshold} {metric.unit}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Load Tests */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Performance Load Tests
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loadTests.map((test, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-explorer-dark rounded-lg border border-explorer-chrome/20"
            >
              <div className="flex items-center gap-3">
                {getTestStatusIcon(test.status)}
                <div>
                  <div className="font-medium text-explorer-text">{test.name}</div>
                  <div className="text-sm text-explorer-text-muted">{test.description}</div>
                  {test.duration && (
                    <div className="text-xs text-explorer-text-muted mt-1">
                      Completed in {test.duration}ms
                    </div>
                  )}
                  {test.metrics && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {test.metrics.map((metric, metricIndex) => (
                        <Badge key={metricIndex} variant="outline" className="text-xs">
                          {metric.name}: {metric.value}{metric.unit}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <Button
                onClick={() => runPerformanceTest(index)}
                disabled={isRunning || test.status === 'running'}
                size="sm"
                variant="outline"
                className="bg-explorer-card border-explorer-chrome/30"
              >
                {test.status === 'running' ? (
                  <RefreshCw className="h-3 w-3 animate-spin" />
                ) : (
                  <Zap className="h-3 w-3" />
                )}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceTester;
