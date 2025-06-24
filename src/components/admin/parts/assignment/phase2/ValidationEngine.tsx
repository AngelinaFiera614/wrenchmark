
import React from "react";
import { AlertTriangle, CheckCircle, AlertCircle, Shield, Database, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ValidationRule {
  id: string;
  name: string;
  description: string;
  severity: 'error' | 'warning' | 'info';
  category: 'compatibility' | 'completeness' | 'data_quality';
}

interface ValidationResult {
  rule: ValidationRule;
  passed: boolean;
  message: string;
  affectedComponents?: string[];
}

interface ValidationEngineProps {
  modelId?: string;
  configurationId?: string;
  components: {
    engine?: any;
    brake_system?: any;
    frame?: any;
    suspension?: any;
    wheel?: any;
  };
  onValidationComplete?: (results: ValidationResult[]) => void;
}

const ValidationEngine: React.FC<ValidationEngineProps> = ({
  modelId,
  configurationId,
  components,
  onValidationComplete
}) => {
  const validationRules: ValidationRule[] = [
    {
      id: 'engine_brake_compatibility',
      name: 'Engine-Brake Compatibility',
      description: 'Ensures brake system can handle engine power output',
      severity: 'error',
      category: 'compatibility'
    },
    {
      id: 'frame_suspension_match',
      name: 'Frame-Suspension Compatibility',
      description: 'Verifies suspension mounting compatibility with frame',
      severity: 'error',
      category: 'compatibility'
    },
    {
      id: 'component_completeness',
      name: 'Component Completeness',
      description: 'Checks if all essential components are assigned',
      severity: 'warning',
      category: 'completeness'
    },
    {
      id: 'data_quality_check',
      name: 'Data Quality',
      description: 'Validates component data completeness and accuracy',
      severity: 'info',
      category: 'data_quality'
    }
  ];

  const runValidation = (): ValidationResult[] => {
    const results: ValidationResult[] = [];

    // Engine-Brake Compatibility Check
    if (components.engine && components.brake_system) {
      const enginePower = components.engine.power_hp || 0;
      const hasPowerfulBrakes = components.brake_system.has_abs || 
                               components.brake_system.type?.toLowerCase().includes('dual');
      
      results.push({
        rule: validationRules[0],
        passed: enginePower < 100 || hasPowerfulBrakes,
        message: enginePower > 100 && !hasPowerfulBrakes 
          ? `High-power engine (${enginePower}hp) requires ABS or dual disc brakes`
          : 'Engine and brake system are compatible',
        affectedComponents: ['engine', 'brake_system']
      });
    }

    // Frame-Suspension Compatibility
    if (components.frame && components.suspension) {
      const frameType = components.frame.type?.toLowerCase() || '';
      const suspensionType = components.suspension.front_type?.toLowerCase() || '';
      
      const compatible = !frameType.includes('rigid') || !suspensionType.includes('telescopic');
      
      results.push({
        rule: validationRules[1],
        passed: compatible,
        message: compatible 
          ? 'Frame and suspension are compatible'
          : 'Rigid frames may not be compatible with telescopic suspension',
        affectedComponents: ['frame', 'suspension']
      });
    }

    // Component Completeness
    const requiredComponents = ['engine', 'brake_system', 'frame'];
    const missingComponents = requiredComponents.filter(comp => !components[comp as keyof typeof components]);
    
    results.push({
      rule: validationRules[2],
      passed: missingComponents.length === 0,
      message: missingComponents.length === 0 
        ? 'All essential components are assigned'
        : `Missing components: ${missingComponents.join(', ')}`,
      affectedComponents: missingComponents
    });

    // Data Quality Check
    const componentCount = Object.keys(components).filter(key => components[key as keyof typeof components]).length;
    const totalPossible = 5; // engine, brake_system, frame, suspension, wheel
    const completeness = (componentCount / totalPossible) * 100;
    
    results.push({
      rule: validationRules[3],
      passed: completeness >= 80,
      message: `Configuration is ${completeness.toFixed(0)}% complete`,
      affectedComponents: []
    });

    return results;
  };

  const validationResults = runValidation();
  const errorCount = validationResults.filter(r => !r.passed && r.rule.severity === 'error').length;
  const warningCount = validationResults.filter(r => !r.passed && r.rule.severity === 'warning').length;
  const overallScore = (validationResults.filter(r => r.passed).length / validationResults.length) * 100;

  React.useEffect(() => {
    onValidationComplete?.(validationResults);
  }, [components, onValidationComplete]);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default: return <CheckCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity: string, passed: boolean) => {
    if (passed) return 'text-green-500 border-green-500';
    switch (severity) {
      case 'error': return 'text-red-500 border-red-500';
      case 'warning': return 'text-yellow-500 border-yellow-500';
      default: return 'text-blue-500 border-blue-500';
    }
  };

  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-explorer-text">
          <Shield className="h-5 w-5 text-accent-teal" />
          Validation Engine
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-explorer-text">Overall Score</span>
            <span className="text-sm text-explorer-text-muted">{overallScore.toFixed(0)}%</span>
          </div>
          <Progress value={overallScore} className="h-2" />
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-red-500/10 rounded border border-red-500/20">
            <div className="text-lg font-bold text-red-400">{errorCount}</div>
            <div className="text-xs text-red-300">Errors</div>
          </div>
          <div className="text-center p-2 bg-yellow-500/10 rounded border border-yellow-500/20">
            <div className="text-lg font-bold text-yellow-400">{warningCount}</div>
            <div className="text-xs text-yellow-300">Warnings</div>
          </div>
          <div className="text-center p-2 bg-green-500/10 rounded border border-green-500/20">
            <div className="text-lg font-bold text-green-400">
              {validationResults.filter(r => r.passed).length}
            </div>
            <div className="text-xs text-green-300">Passed</div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-explorer-text">Validation Results</h4>
          {validationResults.map((result, index) => (
            <Alert 
              key={index} 
              className={`border ${getSeverityColor(result.rule.severity, result.passed)}`}
            >
              <div className="flex items-start gap-3">
                {getSeverityIcon(result.rule.severity)}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <AlertDescription className="font-medium">
                      {result.rule.name}
                    </AlertDescription>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getSeverityColor(result.rule.severity, result.passed)}`}
                    >
                      {result.passed ? 'PASS' : result.rule.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <AlertDescription className="text-xs text-explorer-text-muted mt-1">
                    {result.message}
                  </AlertDescription>
                  {result.affectedComponents && result.affectedComponents.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {result.affectedComponents.map(comp => (
                        <Badge key={comp} variant="outline" className="text-xs">
                          {comp.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Alert>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ValidationEngine;
