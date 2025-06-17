
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  TestTube, 
  Database, 
  Zap, 
  Shield, 
  CheckCircle,
  AlertTriangle,
  XCircle,
  Activity
} from "lucide-react";
import ComponentTestingSuite from "./ComponentTestingSuite";
import DataIntegrityTester from "./DataIntegrityTester";
import PerformanceTester from "./PerformanceTester";

interface TestSummary {
  name: string;
  icon: any;
  total: number;
  passed: number;
  failed: number;
  warnings: number;
  status: 'idle' | 'running' | 'completed';
}

const TestDashboard = () => {
  const [testSummaries, setTestSummaries] = useState<TestSummary[]>([
    {
      name: "Component Tests",
      icon: TestTube,
      total: 28,
      passed: 0,
      failed: 0,
      warnings: 0,
      status: 'idle'
    },
    {
      name: "Data Integrity",
      icon: Database,
      total: 8,
      passed: 0,
      failed: 0,
      warnings: 0,
      status: 'idle'
    },
    {
      name: "Performance",
      icon: Zap,
      total: 5,
      passed: 0,
      failed: 0,
      warnings: 0,
      status: 'idle'
    },
    {
      name: "Security",
      icon: Shield,
      total: 6,
      passed: 0,
      failed: 0,
      warnings: 0,
      status: 'idle'
    }
  ]);

  const getStatusIcon = (summary: TestSummary) => {
    if (summary.status === 'running') {
      return <Activity className="h-4 w-4 animate-pulse text-blue-500" />;
    }
    
    if (summary.failed > 0) {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
    
    if (summary.warnings > 0) {
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
    
    if (summary.passed > 0) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    
    return <TestTube className="h-4 w-4 text-gray-400" />;
  };

  const getProgressPercentage = (summary: TestSummary) => {
    const completed = summary.passed + summary.failed + summary.warnings;
    return Math.round((completed / summary.total) * 100);
  };

  const getOverallHealth = () => {
    const totalTests = testSummaries.reduce((sum, s) => sum + s.total, 0);
    const totalPassed = testSummaries.reduce((sum, s) => sum + s.passed, 0);
    const totalFailed = testSummaries.reduce((sum, s) => sum + s.failed, 0);
    const totalWarnings = testSummaries.reduce((sum, s) => sum + s.warnings, 0);
    
    if (totalFailed > 0) return 'critical';
    if (totalWarnings > 0) return 'warning';
    if (totalPassed > 0) return 'healthy';
    return 'idle';
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6 p-6 bg-explorer-dark">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-explorer-text">Testing Dashboard</h1>
          <p className="text-explorer-text-muted">Comprehensive testing suite for components, data, and performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`${getHealthColor(getOverallHealth())} border-current`}>
            System Health: {getOverallHealth()}
          </Badge>
        </div>
      </div>

      {/* Test Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {testSummaries.map((summary, index) => (
          <Card key={index} className="bg-explorer-card border-explorer-chrome/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <summary.icon className="h-5 w-5 text-accent-teal" />
                  <span className="font-medium text-explorer-text">{summary.name}</span>
                </div>
                {getStatusIcon(summary)}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-explorer-text-muted">Progress</span>
                  <span className="text-explorer-text">{getProgressPercentage(summary)}%</span>
                </div>
                
                <div className="w-full bg-explorer-chrome/20 rounded-full h-2">
                  <div 
                    className="bg-accent-teal h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage(summary)}%` }}
                  />
                </div>
                
                <div className="flex justify-between text-xs">
                  <span className="text-green-400">✓ {summary.passed}</span>
                  <span className="text-yellow-400">⚠ {summary.warnings}</span>
                  <span className="text-red-400">✗ {summary.failed}</span>
                  <span className="text-explorer-text-muted">/ {summary.total}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Test Suite Tabs */}
      <Tabs defaultValue="components" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="components" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Components
          </TabsTrigger>
          <TabsTrigger value="integrity" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Data Integrity
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="components">
          <ComponentTestingSuite />
        </TabsContent>

        <TabsContent value="integrity">
          <DataIntegrityTester />
        </TabsContent>

        <TabsContent value="performance">
          <PerformanceTester />
        </TabsContent>

        <TabsContent value="security">
          <Card className="bg-explorer-card border-explorer-chrome/30">
            <CardHeader>
              <CardTitle className="text-explorer-text flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Testing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-explorer-text-muted mx-auto mb-4" />
                <h3 className="text-lg font-medium text-explorer-text mb-2">Security Tests</h3>
                <p className="text-explorer-text-muted mb-4">
                  Security testing suite will include authentication, authorization, and data protection tests.
                </p>
                <div className="space-y-2 text-sm text-explorer-text-muted">
                  <div>• Component access control validation</div>
                  <div>• Model assignment permission checks</div>
                  <div>• Data sanitization testing</div>
                  <div>• SQL injection prevention</div>
                  <div>• Cross-site scripting (XSS) protection</div>
                  <div>• Role-based access testing</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TestDashboard;
