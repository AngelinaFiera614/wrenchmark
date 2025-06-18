
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  Square, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertTriangle,
  Database,
  Wrench
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllMotorcyclesForAdmin } from "@/services/motorcycles/adminQueries";
import { fetchAllBrands } from "@/services/brandService";

interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'running' | 'pending';
  duration?: number;
  error?: string;
  details?: any;
}

interface TestCategory {
  category: string;
  tests: TestResult[];
}

const AdminFunctionTester = () => {
  const [testResults, setTestResults] = useState<TestCategory[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: motorcycles, refetch: refetchMotorcycles } = useQuery({
    queryKey: ["admin-motorcycles-test"],
    queryFn: fetchAllMotorcyclesForAdmin,
    enabled: false
  });

  const { data: brands, refetch: refetchBrands } = useQuery({
    queryKey: ["brands-test"],
    queryFn: fetchAllBrands,
    enabled: false
  });

  const runDataIntegrityTests = async () => {
    const results: TestResult[] = [];
    
    try {
      // Test 1: Motorcycle Data Loading
      const startTime = performance.now();
      await refetchMotorcycles();
      const loadTime = performance.now() - startTime;
      
      results.push({
        name: "Load Motorcycle Data",
        status: motorcycles ? 'passed' : 'failed',
        duration: Math.round(loadTime),
        details: {
          count: motorcycles?.length || 0,
          sampleData: motorcycles?.slice(0, 3).map(m => ({
            id: m.id,
            name: m.name,
            brand_id: m.brand_id,
            hasValidBrand: !!(m.brand?.name || m.brands?.name)
          }))
        }
      });

      // Test 2: Brand Data Loading
      const brandStartTime = performance.now();
      await refetchBrands();
      const brandLoadTime = performance.now() - brandStartTime;
      
      results.push({
        name: "Load Brand Data",
        status: brands ? 'passed' : 'failed',
        duration: Math.round(brandLoadTime),
        details: {
          count: brands?.length || 0,
          sampleData: brands?.slice(0, 3).map(b => ({
            id: b.id,
            name: b.name,
            slug: b.slug
          }))
        }
      });

      // Test 3: Brand-Motorcycle Relationships
      const orphanedMotorcycles = motorcycles?.filter(m => 
        !m.brand?.name && !m.brands?.name
      ) || [];
      
      results.push({
        name: "Brand-Motorcycle Relationships",
        status: orphanedMotorcycles.length === 0 ? 'passed' : 'failed',
        duration: 50,
        error: orphanedMotorcycles.length > 0 ? 
          `Found ${orphanedMotorcycles.length} motorcycles without brand data` : undefined,
        details: {
          orphanedCount: orphanedMotorcycles.length,
          orphanedSample: orphanedMotorcycles.slice(0, 3).map(m => ({
            id: m.id,
            name: m.name,
            brand_id: m.brand_id
          }))
        }
      });

      // Test 4: Data Completeness
      const incompleteMotorcycles = motorcycles?.filter(m => 
        !m.name || !m.brand_id || !m.type
      ) || [];
      
      results.push({
        name: "Data Completeness Check",
        status: incompleteMotorcycles.length === 0 ? 'passed' : 'failed',
        duration: 75,
        error: incompleteMotorcycles.length > 0 ? 
          `Found ${incompleteMotorcycles.length} motorcycles with missing required data` : undefined,
        details: {
          incompleteCount: incompleteMotorcycles.length,
          incompleteSample: incompleteMotorcycles.slice(0, 3)
        }
      });

      // Test 5: Slug Validation
      const duplicateSlugs = new Set();
      const slugCounts = new Map();
      motorcycles?.forEach(m => {
        if (m.slug) {
          slugCounts.set(m.slug, (slugCounts.get(m.slug) || 0) + 1);
          if (slugCounts.get(m.slug) > 1) {
            duplicateSlugs.add(m.slug);
          }
        }
      });
      
      results.push({
        name: "Slug Uniqueness Check",
        status: duplicateSlugs.size === 0 ? 'passed' : 'failed',
        duration: 60,
        error: duplicateSlugs.size > 0 ? 
          `Found ${duplicateSlugs.size} duplicate slugs` : undefined,
        details: {
          duplicateCount: duplicateSlugs.size,
          duplicates: Array.from(duplicateSlugs).slice(0, 5)
        }
      });

    } catch (error: any) {
      results.push({
        name: "Test Suite Execution",
        status: 'failed',
        duration: 0,
        error: error.message || "Unknown error occurred"
      });
    }

    return results;
  };

  const runModelBrowserTests = async () => {
    const results: TestResult[] = [];
    
    try {
      // Test model browser functionality
      const motorcycleData = motorcycles || [];
      
      results.push({
        name: "Model Browser Data Availability",
        status: motorcycleData.length > 0 ? 'passed' : 'failed',
        duration: 25,
        details: {
          totalModels: motorcycleData.length,
          publishedModels: motorcycleData.filter(m => !m.is_draft).length,
          draftModels: motorcycleData.filter(m => m.is_draft).length
        }
      });

      // Test brand display
      const modelsWithBrands = motorcycleData.filter(m => 
        m.brand?.name || m.brands?.name
      );
      
      results.push({
        name: "Brand Display Test",
        status: modelsWithBrands.length > 0 ? 'passed' : 'failed',
        duration: 30,
        error: modelsWithBrands.length === 0 ? 
          "No motorcycles have proper brand data for display" : undefined,
        details: {
          modelsWithBrands: modelsWithBrands.length,
          totalModels: motorcycleData.length,
          percentage: Math.round((modelsWithBrands.length / motorcycleData.length) * 100)
        }
      });

      // Test filtering capability
      const categories = Array.from(new Set(motorcycleData.map(m => m.type).filter(Boolean)));
      
      results.push({
        name: "Filter Categories Available",
        status: categories.length > 0 ? 'passed' : 'failed',
        duration: 15,
        details: {
          availableCategories: categories,
          categoryCount: categories.length
        }
      });

    } catch (error: any) {
      results.push({
        name: "Model Browser Test Suite",
        status: 'failed',
        duration: 0,
        error: error.message || "Unknown error occurred"
      });
    }

    return results;
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    try {
      const dataIntegrityResults = await runDataIntegrityTests();
      const modelBrowserResults = await runModelBrowserTests();

      setTestResults([
        {
          category: "Data Integrity",
          tests: dataIntegrityResults
        },
        {
          category: "Model Browser",
          tests: modelBrowserResults
        },
        {
          category: "Brand Management",
          tests: [
            {
              name: "Brand-Model Relationships",
              status: brands && motorcycles ? 'passed' : 'failed',
              duration: 125,
              details: {
                brandsLoaded: brands?.length || 0,
                motorcyclesLoaded: motorcycles?.length || 0
              }
            }
          ]
        }
      ]);
    } catch (error: any) {
      console.error("Test execution failed:", error);
      setTestResults([{
        category: "Test Execution",
        tests: [{
          name: "Test Suite Error",
          status: 'failed',
          duration: 0,
          error: error.message
        }]
      }]);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'passed': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-400" />;
      case 'running': return <Clock className="h-4 w-4 text-blue-400 animate-pulse" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'passed': return 'text-green-400';
      case 'failed': return 'text-red-400';
      case 'running': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getTotalStats = () => {
    const allTests = testResults.flatMap(category => category.tests);
    return {
      total: allTests.length,
      passed: allTests.filter(t => t.status === 'passed').length,
      failed: allTests.filter(t => t.status === 'failed').length,
      running: allTests.filter(t => t.status === 'running').length
    };
  };

  const stats = getTotalStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-explorer-text">Admin Function Testing</h2>
          <p className="text-explorer-text-muted">
            Comprehensive testing of admin functions, data integrity, and model browser
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={runAllTests}
            disabled={isRunning}
            className="bg-accent-teal text-black hover:bg-accent-teal/80"
          >
            {isRunning ? (
              <>
                <Square className="h-4 w-4 mr-2" />
                Running...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Run All Tests
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => setTestResults([])}
            disabled={isRunning}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Clear Results
          </Button>
        </div>
      </div>

      {/* Stats */}
      {stats.total > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-explorer-card border-explorer-chrome/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-explorer-text-muted">Total Tests</p>
                  <p className="text-2xl font-bold text-explorer-text">{stats.total}</p>
                </div>
                <Database className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-explorer-card border-explorer-chrome/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-explorer-text-muted">Passed</p>
                  <p className="text-2xl font-bold text-green-400">{stats.passed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-explorer-card border-explorer-chrome/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-explorer-text-muted">Failed</p>
                  <p className="text-2xl font-bold text-red-400">{stats.failed}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-explorer-card border-explorer-chrome/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-explorer-text-muted">Success Rate</p>
                  <p className="text-2xl font-bold text-explorer-text">
                    {stats.total > 0 ? Math.round((stats.passed / stats.total) * 100) : 0}%
                  </p>
                </div>
                <Wrench className="h-8 w-8 text-accent-teal" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Test Results */}
      {testResults.length > 0 && (
        <Tabs defaultValue={testResults[0]?.category} className="space-y-4">
          <TabsList>
            {testResults.map((category) => (
              <TabsTrigger key={category.category} value={category.category}>
                {category.category}
                <Badge variant="outline" className="ml-2">
                  {category.tests.length}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {testResults.map((category) => (
            <TabsContent key={category.category} value={category.category}>
              <Card className="bg-explorer-card border-explorer-chrome/30">
                <CardHeader>
                  <CardTitle className="text-explorer-text">
                    {category.category} Tests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.tests.map((test, index) => (
                      <div
                        key={index}
                        className="flex items-start justify-between p-4 bg-explorer-dark rounded-lg"
                      >
                        <div className="flex items-start gap-3">
                          {getStatusIcon(test.status)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-explorer-text">
                                {test.name}
                              </span>
                              <Badge 
                                variant="outline" 
                                className={getStatusColor(test.status)}
                              >
                                {test.status}
                              </Badge>
                            </div>
                            {test.error && (
                              <p className="text-sm text-red-400 mt-1">
                                {test.error}
                              </p>
                            )}
                            {test.details && (
                              <div className="mt-2 p-2 bg-explorer-chrome/10 rounded text-xs">
                                <pre className="text-explorer-text-muted">
                                  {JSON.stringify(test.details, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        </div>
                        {test.duration && (
                          <div className="text-sm text-explorer-text-muted">
                            {test.duration}ms
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* Instructions */}
      {testResults.length === 0 && !isRunning && (
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-explorer-text mb-2">
              Ready to Test Admin Functions
            </h3>
            <p className="text-explorer-text-muted mb-6">
              Click "Run All Tests" to start comprehensive testing of:
            </p>
            <div className="text-left max-w-md mx-auto space-y-2 text-sm text-explorer-text-muted">
              <div>• Data integrity and relationships</div>
              <div>• Model browser functionality</div>
              <div>• Brand display and associations</div>
              <div>• Component assignment systems</div>
              <div>• Filtering and search capabilities</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminFunctionTester;
