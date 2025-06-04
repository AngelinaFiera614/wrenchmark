
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { AlertTriangle, AlertCircle, Info, ChevronDown, ChevronRight, Lightbulb } from "lucide-react";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  completeness: number;
  sectionStatus: Record<string, 'complete' | 'partial' | 'missing'>;
}

interface EnhancedValidationDisplayProps {
  validation: ValidationResult;
  className?: string;
}

const EnhancedValidationDisplay = ({ validation, className = "" }: EnhancedValidationDisplayProps) => {
  const [showDetails, setShowDetails] = React.useState(false);

  if (validation.isValid && validation.warnings.length === 0 && validation.suggestions.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Errors */}
      {validation.errors.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <div className="font-medium">Validation Errors</div>
              <ul className="list-disc list-inside space-y-1">
                {validation.errors.map((error, index) => (
                  <li key={index} className="text-sm">{error}</li>
                ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Warnings */}
      {validation.warnings.length > 0 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-medium text-yellow-800">
                  Warnings ({validation.warnings.length})
                </div>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Review Needed
                </Badge>
              </div>
              
              <Collapsible open={showDetails} onOpenChange={setShowDetails}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-0 h-auto font-normal text-yellow-700 hover:text-yellow-800">
                    {showDetails ? (
                      <ChevronDown className="h-3 w-3 mr-1" />
                    ) : (
                      <ChevronRight className="h-3 w-3 mr-1" />
                    )}
                    {showDetails ? 'Hide' : 'Show'} details
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  <ul className="list-disc list-inside space-y-1">
                    {validation.warnings.map((warning, index) => (
                      <li key={index} className="text-sm text-yellow-700">{warning}</li>
                    ))}
                  </ul>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Suggestions */}
      {validation.suggestions.length > 0 && (
        <Alert className="border-blue-200 bg-blue-50">
          <Lightbulb className="h-4 w-4 text-blue-600" />
          <AlertDescription>
            <div className="space-y-2">
              <div className="font-medium text-blue-800">Suggestions for Improvement</div>
              <ul className="list-disc list-inside space-y-1">
                {validation.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-blue-700">{suggestion}</li>
                ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default EnhancedValidationDisplay;
