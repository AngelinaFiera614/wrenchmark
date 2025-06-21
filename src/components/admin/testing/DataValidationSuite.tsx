
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Database, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  RefreshCw,
  FileCheck,
  Link2,
  Shield
} from "lucide-react";

interface ValidationResult {
  test: string;
  status: 'pass' | 'warning' | 'fail';
  message: string;
  details?: string;
  count?: number;
}

const DataValidationSuite = () => {
  const [isRunning, setIsRunning] = useState(false);

  const { data: validationResults, isLoading, refetch } = useQuery({
    queryKey: ['data-validation'],
    queryFn: async () => {
      console.log('🧪 Running comprehensive data validation...');
      const results: ValidationResult[] = [];

      try {
        // Test 1: Motorcycle models data completeness
        const { data: models } = await supabase
          .from('motorcycle_models')
          .select('id, name, brand_id, type, is_draft');

        const publishedModels = models?.filter(m => !m.is_draft) || [];
        const modelsWithMissingData = publishedModels.filter(m => !m.name || !m.brand_id || !m.type);

        results.push({
          test: 'Motorcycle Models Data Completeness',
          status: modelsWithMissingData.length === 0 ? 'pass' : 'warning',
          message: `${modelsWithMissingData.length} of ${publishedModels.length} published models have missing required data`,
          details: modelsWithMissingData.length > 0 ? 'Some models missing name, brand_id, or type' : 'All published models have complete required data',
          count: publishedModels.length
        });

        // Test 2: Brand references integrity
        const { data: brandsCheck } = await supabase
          .from('motorcycle_models')
          .select(`
            id,
            name,
            brand_id,
            brands!motorcycle_models_brand_id_fkey(id, name)
          `)
          .limit(100);

        const orphanedModels = brandsCheck?.filter(m => m.brand_id && !m.brands) || [];

        results.push({
          test: 'Brand Reference Integrity',
          status: orphanedModels.length === 0 ? 'pass' : 'fail',
          message: `${orphanedModels.length} motorcycles reference non-existent brands`,
          details: orphanedModels.length > 0 ? 'Foreign key constraints may be missing' : 'All brand references are valid',
          count: brandsCheck?.length || 0
        });

        // Test 3: Component assignments validation
        const { data: assignments } = await supabase
          .from('model_component_assignments')
          .select('id, model_id, component_type, component_id');

        const assignmentCounts = {
          engine: assignments?.filter(a => a.component_type === 'engine').length || 0,
          brake_system: assignments?.filter(a => a.component_type === 'brake_system').length || 0,
          frame: assignments?.filter(a => a.component_type === 'frame').length || 0,
          suspension: assignments?.filter(a => a.component_type === 'suspension').length || 0,
          wheel: assignments?.filter(a => a.component_type === 'wheel').length || 0
        };

        const totalAssignments = Object.values(assignmentCounts).reduce((a, b) => a + b, 0);

        results.push({
          test: 'Component Assignments Coverage',
          status: totalAssignments > 0 ? 'pass' : 'warning',
          message: `${totalAssignments} component assignments across all types`,
          details: `Engines: ${assignmentCounts.engine}, Brakes: ${assignmentCounts.brake_system}, Frames: ${assignmentCounts.frame}, Suspensions: ${assignmentCounts.suspension}, Wheels: ${assignmentCounts.wheel}`,
          count: totalAssignments
        });

        // Test 4: Published component availability
        const componentChecks = await Promise.all([
          supabase.from('engines').select('id').eq('is_draft', false),
          supabase.from('brake_systems').select('id').eq('is_draft', false),
          supabase.from('frames').select('id').eq('is_draft', false),
          supabase.from('suspensions').select('id').eq('is_draft', false),
          supabase.from('wheels').select('id').eq('is_draft', false)
        ]);

        const publishedComponents = {
          engines: componentChecks[0].data?.length || 0,
          brakes: componentChecks[1].data?.length || 0,
          frames: componentChecks[2].data?.length || 0,
          suspensions: componentChecks[3].data?.length || 0,
          wheels: componentChecks[4].data?.length || 0
        };

        const totalPublishedComponents = Object.values(publishedComponents).reduce((a, b) => a + b, 0);

        results.push({
          test: 'Published Components Availability',
          status: totalPublishedComponents > 20 ? 'pass' : totalPublishedComponents > 10 ? 'warning' : 'fail',
          message: `${totalPublishedComponents} published components available`,
          details: `Engines: ${publishedComponents.engines}, Brakes: ${publishedComponents.brakes}, Frames: ${publishedComponents.frames}, Suspensions: ${publishedComponents.suspensions}, Wheels: ${publishedComponents.wheels}`,
          count: totalPublishedComponents
        });

        // Test 5: Model years and configurations
        const { data: years } = await supabase
          .from('model_years')
          .select(`
            id,
            motorcycle_id,
            year,
            model_configurations(id)
          `);

        const yearsWithConfigs = years?.filter(y => y.model_configurations && y.model_configurations.length > 0) || [];
        const totalYears = years?.length || 0;

        results.push({
          test: 'Model Years Configuration Coverage',
          status: yearsWithConfigs.length >= totalYears * 0.8 ? 'pass' : yearsWithConfigs.length >= totalYears * 0.5 ? 'warning' : 'fail',
          message: `${yearsWithConfigs.length} of ${totalYears} model years have configurations`,
          details: `Coverage: ${totalYears > 0 ? Math.round((yearsWithConfigs.length / totalYears) * 100) : 0}%`,
          count: totalYears
        });

        // Test 6: Motorcycle stats coverage
        const { data: statsCount } = await supabase
          .from('motorcycle_stats')
          .select('id, model_configuration_id');

        results.push({
          test: 'Motorcycle Stats Coverage',
          status: (statsCount?.length || 0) > 0 ? 'pass' : 'warning',
          message: `${statsCount?.length || 0} configuration stats entries`,
          details: statsCount && statsCount.length > 0 ? 'Stats table is populated' : 'Stats table needs population',
          count: statsCount?.length || 0
        });

        console.log('🧪 Data validation completed:', results);
        return results;

      } catch (error) {
        console.error('🚨 Validation error:', error);
        return [{
          test: 'Validation Suite Error',
          status: 'fail' as const,
          message: 'Critical error during validation',
          details: error instanceof Error ? error.message : 'Unknown error'
        }];
      }
    },
    enabled: true,
    refetchInterval: 60000, // Re-run every minute
  });

  const runValidation = async () => {
    setIsRunning(true);
    await refetch();
    setIsRunning(false);
  };

  const passedTests = validationResults?.filter(r => r.status === 'pass').length || 0;
  const totalTests = validationResults?.length || 0;
  const completionPercentage = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'fail': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Database className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'fail': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-explorer-text">Data Validation Suite</h2>
          <p className="text-explorer-text-muted">Comprehensive data quality and integrity checks</p>
        </div>
        <Button 
          variant="outline" 
          onClick={runValidation}
          disabled={isRunning || isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${(isRunning || isLoading) ? 'animate-spin' : ''}`} />
          {isRunning || isLoading ? 'Validating...' : 'Run Validation'}
        </Button>
      </div>

      {/* Validation Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overall Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{completionPercentage}%</div>
              <Progress value={completionPercentage} className="h-2" />
              <div className="text-xs text-muted-foreground">
                {passedTests} of {totalTests} tests passing
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileCheck className="h-4 w-4" />
              Data Quality
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {completionPercentage >= 80 ? 'Excellent' : completionPercentage >= 60 ? 'Good' : 'Needs Work'}
            </div>
            <div className="text-xs text-muted-foreground">
              Based on validation results
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent-teal">
              {validationResults?.some(r => r.status === 'fail') ? 'Issues' : 'Stable'}
            </div>
            <div className="text-xs text-muted-foreground">
              Auto-refresh every minute
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Validation Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Validation Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {validationResults?.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(result.status)}
                  <div>
                    <div className="font-medium">{result.test}</div>
                    <div className="text-sm text-muted-foreground">{result.message}</div>
                    {result.details && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {result.details}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {result.count !== undefined && (
                    <span className="text-sm text-muted-foreground">
                      ({result.count})
                    </span>
                  )}
                  <Badge className={getStatusColor(result.status)}>
                    {result.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            )) || (
              <div className="text-center py-8 text-muted-foreground">
                {isLoading ? 'Running validation tests...' : 'No validation results available'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataValidationSuite;
