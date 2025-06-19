
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  PlayCircle, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Database,
  RefreshCw
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface TestResult {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  message: string;
  details?: any;
}

const RealDataIntegrityTester = () => {
  const [tests, setTests] = useState<TestResult[]>([
    {
      id: 'db_connection',
      name: 'Database Connection',
      status: 'pending',
      message: 'Not started'
    },
    {
      id: 'motorcycle_count',
      name: 'Motorcycle Models Count',
      status: 'pending',
      message: 'Not started'
    },
    {
      id: 'brand_count',
      name: 'Brands Count',
      status: 'pending',
      message: 'Not started'
    },
    {
      id: 'brand_relationships',
      name: 'Brand Relationships',
      status: 'pending',
      message: 'Not started'
    },
    {
      id: 'data_completeness',
      name: 'Data Completeness',
      status: 'pending',
      message: 'Not started'
    }
  ]);
  
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const updateTest = (id: string, updates: Partial<TestResult>) => {
    setTests(prev => prev.map(test => 
      test.id === id ? { ...test, ...updates } : test
    ));
  };

  const runTest = async (testId: string) => {
    updateTest(testId, { status: 'running', message: 'Running...' });

    try {
      switch (testId) {
        case 'db_connection':
          await testDatabaseConnection();
          break;
        case 'motorcycle_count':
          await testMotorcycleCount();
          break;
        case 'brand_count':
          await testBrandCount();
          break;
        case 'brand_relationships':
          await testBrandRelationships();
          break;
        case 'data_completeness':
          await testDataCompleteness();
          break;
      }
    } catch (error: any) {
      updateTest(testId, {
        status: 'failed',
        message: error.message || 'Test failed',
        details: error
      });
    }
  };

  const testDatabaseConnection = async () => {
    const { data, error } = await supabase
      .from('motorcycle_models')
      .select('id')
      .limit(1);

    if (error) {
      throw new Error(`Database connection failed: ${error.message}`);
    }

    updateTest('db_connection', {
      status: 'passed',
      message: 'Database connection successful',
      details: { connected: true }
    });
  };

  const testMotorcycleCount = async () => {
    const { count, error } = await supabase
      .from('motorcycle_models')
      .select('*', { count: 'exact', head: true });

    if (error) {
      throw new Error(`Failed to count motorcycles: ${error.message}`);
    }

    const motorcycleCount = count || 0;
    
    updateTest('motorcycle_count', {
      status: motorcycleCount > 0 ? 'passed' : 'failed',
      message: `Found ${motorcycleCount} motorcycle models`,
      details: { count: motorcycleCount }
    });
  };

  const testBrandCount = async () => {
    const { count, error } = await supabase
      .from('brands')
      .select('*', { count: 'exact', head: true });

    if (error) {
      throw new Error(`Failed to count brands: ${error.message}`);
    }

    const brandCount = count || 0;
    
    updateTest('brand_count', {
      status: brandCount > 0 ? 'passed' : 'failed',
      message: `Found ${brandCount} brands`,
      details: { count: brandCount }
    });
  };

  const testBrandRelationships = async () => {
    // Test for motorcycles without valid brand relationships
    const { data: orphanedMotorcycles, error } = await supabase
      .from('motorcycle_models')
      .select(`
        id,
        name,
        brand_id,
        brand:brands(id, name)
      `)
      .is('brands.id', null);

    if (error) {
      throw new Error(`Failed to check brand relationships: ${error.message}`);
    }

    const orphanedCount = orphanedMotorcycles?.length || 0;
    
    updateTest('brand_relationships', {
      status: orphanedCount === 0 ? 'passed' : 'failed',
      message: orphanedCount === 0 
        ? 'All motorcycles have valid brand relationships'
        : `${orphanedCount} motorcycles have invalid brand relationships`,
      details: { orphanedCount, orphanedMotorcycles }
    });
  };

  const testDataCompleteness = async () => {
    const { data: motorcycles, error } = await supabase
      .from('motorcycle_models')
      .select('id, name, type, engine_size, horsepower, weight_kg, is_draft');

    if (error) {
      throw new Error(`Failed to check data completeness: ${error.message}`);
    }

    if (!motorcycles) {
      throw new Error('No motorcycle data found');
    }

    const total = motorcycles.length;
    const complete = motorcycles.filter(m => 
      !m.is_draft && 
      m.name && 
      m.type && 
      m.engine_size && 
      m.horsepower && 
      m.weight_kg
    ).length;

    const completeness = total > 0 ? Math.round((complete / total) * 100) : 0;
    
    updateTest('data_completeness', {
      status: completeness >= 70 ? 'passed' : 'failed',
      message: `${completeness}% data completeness (${complete}/${total} complete)`,
      details: { total, complete, completeness }
    });
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setProgress(0);

    // Reset all tests
    setTests(prev => prev.map(test => ({
      ...test,
      status: 'pending' as const,
      message: 'Waiting...'
    })));

    const testIds = tests.map(t => t.id);
    
    for (let i = 0; i < testIds.length; i++) {
      await runTest(testIds[i]);
      setProgress(((i + 1) / testIds.length) * 100);
      
      // Small delay between tests for UX
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'running':
        return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />;
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'running':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Running</Badge>;
      case 'passed':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Passed</Badge>;
      case 'failed':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const passedTests = tests.filter(t => t.status === 'passed').length;
  const failedTests = tests.filter(t => t.status === 'failed').length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            <CardTitle>Real Data Integrity Tests</CardTitle>
          </div>
          <Button 
            onClick={runAllTests} 
            disabled={isRunning}
            className="bg-accent-teal text-black hover:bg-accent-teal/80"
          >
            <PlayCircle className="h-4 w-4 mr-2" />
            {isRunning ? 'Running Tests...' : 'Run All Tests'}
          </Button>
        </div>
        {isRunning && (
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground">
              Testing database integrity... {Math.round(progress)}%
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{passedTests}</div>
            <div className="text-sm text-muted-foreground">Passed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{failedTests}</div>
            <div className="text-sm text-muted-foreground">Failed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{tests.length}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </div>
        </div>

        {/* Test Results */}
        <div className="space-y-3">
          {tests.map((test) => (
            <div key={test.id} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                {getStatusIcon(test.status)}
                <div>
                  <div className="font-medium">{test.name}</div>
                  <div className="text-sm text-muted-foreground">{test.message}</div>
                  {test.details && (
                    <details className="text-xs text-muted-foreground mt-1">
                      <summary className="cursor-pointer">Details</summary>
                      <pre className="mt-1 p-1 bg-muted rounded">
                        {JSON.stringify(test.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(test.status)}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => runTest(test.id)}
                  disabled={isRunning}
                >
                  Run
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RealDataIntegrityTester;
