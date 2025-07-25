import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

interface ValidationSummaryProps {
  validation: {
    isValid: boolean;
    errors: Array<{
      field: string;
      message: string;
      section: string;
    }>;
  };
}

const ValidationSummary = ({ validation }: ValidationSummaryProps) => {
  const errorsBySection = validation.errors.reduce((acc, error) => {
    if (!acc[error.section]) {
      acc[error.section] = [];
    }
    acc[error.section].push(error);
    return acc;
  }, {} as Record<string, typeof validation.errors>);

  const sectionNames = {
    basic: "Basic Information",
    components: "Component Overrides", 
    colors: "Color Management"
  };

  return (
    <Card className="bg-destructive/10 border-destructive/30">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <h3 className="font-semibold text-destructive">
            Validation Issues ({validation.errors.length})
          </h3>
        </div>

        <div className="space-y-4">
          {Object.entries(errorsBySection).map(([section, errors]) => (
            <div key={section} className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="destructive" className="text-xs">
                  {sectionNames[section as keyof typeof sectionNames] || section}
                </Badge>
                <span className="text-destructive/70 text-sm">
                  {errors.length} issue{errors.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              <ul className="space-y-1 ml-4">
                {errors.map((error, index) => (
                  <li key={index} className="text-destructive text-sm flex items-start gap-2">
                    <span className="text-destructive/70 mt-1">•</span>
                    <span>{error.message}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-destructive/5 rounded-lg border border-destructive/20">
          <p className="text-destructive text-sm">
            Please resolve all validation issues before saving the configuration.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ValidationSummary;