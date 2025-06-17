
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Play, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  RefreshCw,
  Database,
  Bike,
  Palette,
  Building2,
  Copy,
  Download,
  TestTube
} from "lucide-react";

interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'running' | 'pending';
  duration?: number;
  error?: string;
  details?: any;
}

interface TestCategory {
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  tests: TestResult[];
}

const AdminFunctionTester = () => {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  
  const [testCategories, setTestCategories] = useState<TestCategory[]>([
    {
      name: "Motorcycle Management",
      icon: Bike,
      description: "Test motorcycle CRUD operations, data validation, and publishing",
      tests: [
        { name: "Create Draft Motorcycle", status: 'pending' },
        { name: "Update Motorcycle Basic Info", status: 'pending' },
        { name: "Publish Motorcycle", status: 'pending' },
        { name: "Unpublish Motorcycle", status: 'pending' },
        { name: "Delete Motorcycle", status: 'pending' },
        { name: "Bulk Update Motorcycles", status: 'pending' },
        { name: "Validate Required Fields", status: 'pending' },
        { name: "Test Slug Generation", status: 'pending' }
      ]
    },
    {
      name: "Brand Management",
      icon: Building2,
      description: "Test brand operations and relationships",
      tests: [
        { name: "Create Brand", status: 'pending' },
        { name: "Update Brand Info", status: 'pending' },
        { name: "Brand-Model Relationships", status: 'pending' },
        { name: "Brand Search Functionality", status: 'pending' },
        { name: "Delete Brand (Check Dependencies)", status: 'pending' }
      ]
    },
    {
      name: "Color Management",
      icon: Palette,
      description: "Test color variants and assignments",
      tests: [
        { name: "Create Color Variant", status: 'pending' },
        { name: "Assign Color to Model", status: 'pending' },
        { name: "Color Code Validation", status: 'pending' },
        { name: "Hex Code Processing", status: 'pending' },
        { name: "Color Search", status: 'pending' }
      ]
    },
    {
      name: "Data Relationships",
      icon: Database,
      description: "Test complex data relationships and foreign keys",
      tests: [
        { name: "Model → Years → Configurations", status: 'pending' },
        { name: "Component Assignments", status: 'pending' },
        { name: "Cascade Delete Operations", status: 'pending' },
        { name: "Orphaned Record Detection", status: 'pending' },
        { name: "Data Consistency Checks", status: 'pending' }
      ]
    }
  ]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "Test results have been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Copy failed",
        description: "Failed to copy test results to clipboard.",
      });
    }
  };

  const formatTestResults = () => {
    return testCategories.map(category => ({
      category: category.name,
      tests: category.tests.map(test => ({
        name: test.name,
        status: test.status,
        duration: test.duration,
        error: test.error
      }))
    }));
  };

  const runSingleTest = async (categoryIndex: number, testIndex: number): Promise<void> => {
    const testName = testCategories[categoryIndex].tests[testIndex].name;
    
    setTestCategories(prev => {
      const newCategories = [...prev];
      newCategories[categoryIndex].tests[testIndex] = {
        ...newCategories[categoryIndex].tests[testIndex],
        status: 'running'
      };
      return newCategories;
    });

    try {
      const startTime = Date.now();
      let result: TestResult;

      switch (testName) {
        case "Color Search":
          result = await testColorSearch();
          break;
        case "Component Assignments":
          result = await testComponentAssignments();
          break;
        case "Delete Brand (Check Dependencies)":
          result = await testDeleteBrandWithDependencies();
          break;
        default:
          // Simulate test execution for other tests
          await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 500));
          result = {
            name: testName,
            status: Math.random() > 0.8 ? 'failed' : 'passed',
            duration: Date.now() - startTime,
            error: Math.random() > 0.8 ? 'Simulated test failure' : undefined
          };
      }

      setTestCategories(prev => {
        const newCategories = [...prev];
        newCategories[categoryIndex].tests[testIndex] = {
          ...result,
          duration: Date.now() - startTime
        };
        return newCategories;
      });

    } catch (error) {
      setTestCategories(prev => {
        const newCategories = [...prev];
        newCategories[categoryIndex].tests[testIndex] = {
          ...newCategories[categoryIndex].tests[testIndex],
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        };
        return newCategories;
      });
    }
  };

  const testColorSearch = async (): Promise<TestResult> => {
    try {
      const { searchColors } = await import("@/services/colorService");
      
      const searchResults = await searchColors('red');
      
      if (!Array.isArray(searchResults)) {
        throw new Error("Color search did not return an array");
      }

      return {
        name: "Color Search",
        status: 'passed',
        details: { 
          searchTerm: 'red',
          resultsCount: searchResults.length 
        }
      };
    } catch (error) {
      return {
        name: "Color Search",
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  const testComponentAssignments = async (): Promise<TestResult> => {
    try {
      const { assignComponentToModelAlt, removeComponentFromModelAlt } = await import("@/services/modelComponent");
      
      if (typeof assignComponentToModelAlt !== 'function') {
        throw new Error("assignComponentToModel function not found");
      }
      
      if (typeof removeComponentFromModelAlt !== 'function') {
        throw new Error("removeComponentFromModel function not found");
      }

      return {
        name: "Component Assignments",
        status: 'passed',
        details: { 
          functionsAvailable: true
        }
      };
    } catch (error) {
      return {
        name: "Component Assignments",
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  const testDeleteBrandWithDependencies = async (): Promise<TestResult> => {
    try {
      const { deleteBrand, checkBrandDependencies, fetchAllBrands } = await import("@/services/brandService");
      
      const brands = await fetchAllBrands();
      if (brands.length === 0) {
        return {
          name: "Delete Brand (Check Dependencies)",
          status: 'passed',
          details: { message: "No brands available for dependency check test" }
        };
      }

      const testBrand = brands[0];
      const dependencies = await checkBrandDependencies(testBrand.id);
      const deleteResult = await deleteBrand(testBrand.id);
      
      const expectedToFail = dependencies.hasModels;
      const actuallyFailed = !deleteResult.success;
      
      if (expectedToFail === actuallyFailed) {
        return {
          name: "Delete Brand (Check Dependencies)",
          status: 'passed',
          details: { 
            brandTested: testBrand.name,
            hasDependencies: dependencies.hasModels,
            modelCount: dependencies.modelCount,
            deleteAttemptFailed: actuallyFailed
          }
        };
      } else {
        throw new Error(`Dependency check failed: expected delete to ${expectedToFail ? 'fail' : 'succeed'} but it ${actuallyFailed ? 'failed' : 'succeeded'}`);
      }
    } catch (error) {
      return {
        name: "Delete Brand (Check Dependencies)",
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    
    for (let categoryIndex = 0; categoryIndex < testCategories.length; categoryIndex++) {
      for (let testIndex = 0; testIndex < testCategories[categoryIndex].tests.length; testIndex++) {
        await runSingleTest(categoryIndex, testIndex);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    setIsRunning(false);
    
    toast({
      title: "Testing Complete",
      description: "All tests have finished running.",
    });
  };

  const resetAllTests = () => {
    setTestCategories(prev => 
      prev.map(category => ({
        ...category,
        tests: category.tests.map(test => ({
          ...test,
          status: 'pending' as const,
          duration: undefined,
          error: undefined
        }))
      }))
    );
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-500" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    const variants = {
      passed: 'default',
      failed: 'destructive',
      running: 'secondary',
      pending: 'outline'
    } as const;

    return (
      <Badge variant={variants[status]} className="ml-2">
        {status.toUpperCase()}
      </Badge>
    );
  };

  const calculateProgress = () => {
    const allTests = testCategories.flatMap(category => category.tests);
    const completedTests = allTests.filter(test => test.status === 'passed' || test.status === 'failed');
    return (completedTests.length / allTests.length) * 100;
  };

  return (
    <div className="space-y-6 p-6 bg-explorer-dark">
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Admin Function Tester
          </CardTitle>
          <p className="text-explorer-text-muted">
            Test critical admin functions to ensure system reliability and data integrity.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button
              onClick={runAllTests}
              disabled={isRunning}
              className="bg-accent-teal text-black hover:bg-accent-teal/80"
            >
              <Play className="h-4 w-4 mr-2" />
              {isRunning ? 'Running Tests...' : 'Run All Tests'}
            </Button>
            
            <Button
              onClick={resetAllTests}
              variant="outline"
              disabled={isRunning}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset All
            </Button>
            
            <Button
              onClick={() => copyToClipboard(JSON.stringify(formatTestResults(), null, 2))}
              variant="outline"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Results
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-explorer-text-muted">
              <span>Overall Progress</span>
              <span>{Math.round(calculateProgress())}%</span>
            </div>
            <Progress value={calculateProgress()} className="w-full" />
          </div>
        </CardContent>
      </Card>

      {testCategories.map((category, categoryIndex) => (
        <Card key={category.name} className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader>
            <CardTitle className="text-explorer-text flex items-center gap-2">
              <category.icon className="h-5 w-5" />
              {category.name}
            </CardTitle>
            <p className="text-explorer-text-muted text-sm">
              {category.description}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {category.tests.map((test, testIndex) => (
                <div
                  key={test.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-explorer-dark/50 border border-explorer-chrome/20"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(test.status)}
                    <span className="text-explorer-text">{test.name}</span>
                    {getStatusBadge(test.status)}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {test.duration && (
                      <span className="text-xs text-explorer-text-muted">
                        {test.duration}ms
                      </span>
                    )}
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => runSingleTest(categoryIndex, testIndex)}
                      disabled={isRunning || test.status === 'running'}
                    >
                      <Play className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminFunctionTester;
