
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/auth";
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  Database,
  Shield,
  Link2,
  Users
} from "lucide-react";

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: string;
  count?: number;
}

const RealDataIntegrityTester = () => {
  const { user, isAdmin } = useAuth();
  const [isRunning, setIsRunning] = useState(false);

  const { data: testResults, isLoading, refetch } = useQuery({
    queryKey: ['data-integrity-tests'],
    queryFn: async () => {
      console.log('🧪 Starting comprehensive data integrity tests...');
      const tests: TestResult[] = [];

      try {
        // Test 1: Check foreign key relationships
        const { data: fkTest, error: fkError } = await supabase.rpc('sql', {
          query: `
            SELECT 
              tc.constraint_name,
              tc.table_name,
              ccu.table_name AS foreign_table_name
            FROM information_schema.table_constraints tc
            JOIN information_schema.constraint_column_usage ccu 
              ON tc.constraint_name = ccu.constraint_name
            WHERE tc.constraint_type = 'FOREIGN KEY'
              AND tc.table_name = 'motorcycle_models'
              AND ccu.table_name = 'brands';
          `
        });

        if (fkError) {
          tests.push({
            name: 'Foreign Key Structure',
            status: 'fail',
            message: 'Could not check foreign key constraints',
            details: fkError.message
          });
        } else {
          const fkCount = fkTest?.length || 0;
          tests.push({
            name: 'Foreign Key Relationships',
            status: fkCount === 1 ? 'pass' : 'warning',
            message: fkCount === 1 
              ? 'Single FK constraint found (fixed!)' 
              : `Found ${fkCount} FK constraints - should be exactly 1`,
            count: fkCount
          });
        }

        // Test 2: Check RLS policies
        const { data: rlsTest, error: rlsError } = await supabase
          .from('motorcycle_models')
          .select('id, name, is_draft, brand_id, brands(name)')
          .limit(5);

        if (rlsError) {
          tests.push({
            name: 'RLS Policy Access',
            status: 'fail',
            message: 'RLS blocking data access',
            details: rlsError.message
          });
        } else {
          tests.push({
            name: 'Motorcycle Models Access',
            status: 'pass',
            message: `Successfully queried ${rlsTest.length} motorcycle models`,
            count: rlsTest.length
          });
        }

        // Test 3: Check component tables RLS
        const componentTables = ['engines', 'brake_systems', 'frames', 'suspensions', 'wheels'];
        let componentTestsPassed = 0;

        for (const table of componentTables) {
          try {
            const { data, error } = await supabase
              .from(table)
              .select('id, is_draft')
              .limit(3);

            if (!error && data) {
              componentTestsPassed++;
            }
          } catch (err) {
            console.warn(`Component table ${table} access failed:`, err);
          }
        }

        tests.push({
          name: 'Component Tables RLS',
          status: componentTestsPassed === componentTables.length ? 'pass' : 'warning',
          message: `${componentTestsPassed}/${componentTables.length} component tables accessible`,
          count: componentTestsPassed
        });

        // Test 4: Check motorcycle_stats table
        const { data: statsTest, error: statsError } = await supabase
          .from('motorcycle_stats')
          .select('id, model_configuration_id')
          .limit(3);

        if (statsError) {
          tests.push({
            name: 'Motorcycle Stats Access',
            status: 'warning',
            message: 'Cannot access motorcycle_stats (expected if no data)',
            details: statsError.message
          });
        } else {
          tests.push({
            name: 'Motorcycle Stats Table',
            status: 'pass',
            message: `Successfully accessed stats table (${statsTest.length} records)`,
            count: statsTest.length
          });
        }

        // Test 5: Test admin functions
        if (isAdmin) {
          const { data: adminTest, error: adminError } = await supabase
            .from('motorcycle_models')
            .select('id, name, is_draft')
            .eq('is_draft', true)
            .limit(3);

          if (adminError) {
            tests.push({
              name: 'Admin Draft Access',
              status: 'fail',
              message: 'Admin cannot access draft motorcycles',
              details: adminError.message
            });
          } else {
            tests.push({
              name: 'Admin Draft Access',
              status: 'pass',
              message: `Admin can access ${adminTest.length} draft motorcycles`,
              count: adminTest.length
            });
          }
        }

        // Test 6: Check brand data embedded in queries
        const { data: brandEmbedTest, error: brandEmbedError } = await supabase
          .from('motorcycle_models')
          .select(`
            id,
            name,
            brand_id,
            brands!motorcycle_models_brand_id_fkey(
              id,
              name,
              slug
            )
          `)
          .limit(3);

        if (brandEmbedError) {
          tests.push({
            name: 'Brand Data Embedding',
            status: 'fail',
            message: 'Cannot embed brand data in motorcycle queries',
            details: brandEmbedError.message
          });
        } else {
          const hasValidBrands = brandEmbedTest?.every(m => m.brands?.name);
          tests.push({
            name: 'Brand Data Embedding',
            status: hasValidBrands ? 'pass' : 'warning',
            message: hasValidBrands 
              ? 'Brand data successfully embedded in queries'
              : 'Some motorcycles missing brand data',
            count: brandEmbedTest?.length || 0
          });
        }

        // Test 7: Performance check
        const startTime = Date.now();
        const { data: perfTest } = await supabase
          .from('motorcycle_models')
          .select('id, name, brand_id, brands(name)')
          .limit(10);
        const queryTime = Date.now() - startTime;

        tests.push({
          name: 'Query Performance',
          status: queryTime < 1000 ? 'pass' : queryTime < 3000 ? 'warning' : 'fail',
          message: `Query completed in ${queryTime}ms`,
          details: queryTime < 1000 ? 'Excellent performance' : 'Consider query optimization'
        });

        console.log('🧪 Data integrity tests completed:', tests);
        return tests;

      } catch (error) {
        console.error('🚨 Critical test error:', error);
        return [{
          name: 'Critical Test Failure',
          status: 'fail' as const,
          message: 'Test suite encountered a critical error',
          details: error instanceof Error ? error.message : 'Unknown error'
        }];
      }
    },
    enabled: !!user,
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });

  const runTests = async () => {
    setIsRunning(true);
    await refetch();
    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'fail': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pass: 'bg-green-100 text-green-800 border-green-200',
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      fail: 'bg-red-100 text-red-800 border-red-200'
    };
    
    return variants[status as keyof typeof variants] || variants.fail;
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Users className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Please sign in to run data integrity tests</p>
        </CardContent>
      </Card>
    );
  }

  const passedTests = testResults?.filter(t => t.status === 'pass').length || 0;
  const totalTests = testResults?.length || 0;
  const successRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="h-6 w-6 text-accent-teal" />
              <div>
                <CardTitle>Real-Time Data Integrity Testing</CardTitle>
                <p className="text-muted-foreground text-sm mt-1">
                  Phase 2 validation: Foreign keys, RLS policies, and performance
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={runTests}
              disabled={isRunning || isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${(isRunning || isLoading) ? 'animate-spin' : ''}`} />
              {isRunning || isLoading ? 'Testing...' : 'Run Tests'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Overall Status */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Success Rate</div>
              <div className="text-2xl font-bold text-green-600">{successRate}%</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Tests Passed</div>
              <div className="text-2xl font-bold">{passedTests}/{totalTests}</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">User Status</div>
              <div className="text-2xl font-bold text-accent-teal">
                {isAdmin ? 'Admin' : 'User'}
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Auto-Refresh</div>
              <div className="text-sm font-medium text-green-600">Every 30s</div>
            </Card>
          </div>

          {/* Test Results */}
          <div className="space-y-3">
            {testResults?.map((test, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg bg-card"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(test.status)}
                  <div>
                    <div className="font-medium">{test.name}</div>
                    <div className="text-sm text-muted-foreground">{test.message}</div>
                    {test.details && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {test.details}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {test.count !== undefined && (
                    <span className="text-sm text-muted-foreground">
                      ({test.count})
                    </span>
                  )}
                  <Badge className={getStatusBadge(test.status)}>
                    {test.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            )) || (
              <div className="text-center py-8 text-muted-foreground">
                {isLoading ? 'Running tests...' : 'No test results available'}
              </div>
            )}
          </div>

          {/* Test Categories Legend */}
          <div className="mt-6 pt-4 border-t">
            <div className="text-sm font-medium mb-3">Test Categories:</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <Link2 className="h-3 w-3" />
                Foreign Keys
              </div>
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                RLS Policies
              </div>
              <div className="flex items-center gap-1">
                <Database className="h-3 w-3" />
                Data Access
              </div>
              <div className="flex items-center gap-1">
                <RefreshCw className="h-3 w-3" />
                Performance
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealDataIntegrityTester;
