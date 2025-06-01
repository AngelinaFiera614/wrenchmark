
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, XCircle, Info } from "lucide-react";
import { FormCompleteness } from "./validationEnhanced";

interface CompletenessIndicatorProps {
  completeness: FormCompleteness;
  className?: string;
}

const CompletenessIndicator = ({ completeness, className = "" }: CompletenessIndicatorProps) => {
  const getStatusColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (score >= 60) return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    return <XCircle className="h-4 w-4 text-red-600" />;
  };

  const getStatusBadge = (score: number) => {
    if (score >= 80) return <Badge variant="secondary" className="bg-green-100 text-green-800">Complete</Badge>;
    if (score >= 60) return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Partial</Badge>;
    return <Badge variant="secondary" className="bg-red-100 text-red-800">Incomplete</Badge>;
  };

  return (
    <div className={`space-y-4 p-4 border rounded-lg bg-muted/50 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Configuration Completeness</span>
        </div>
        {getStatusBadge(completeness.overall)}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Overall Progress</span>
          <div className="flex items-center gap-2">
            {getStatusIcon(completeness.overall)}
            <span className={`text-sm font-medium ${getStatusColor(completeness.overall)}`}>
              {completeness.overall}%
            </span>
          </div>
        </div>
        <Progress value={completeness.overall} className="h-2" />
      </div>

      <div className="grid grid-cols-3 gap-3 text-sm">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span>Basic Info</span>
            <span className={getStatusColor(completeness.basicInfo)}>
              {completeness.basicInfo}%
            </span>
          </div>
          <Progress value={completeness.basicInfo} className="h-1" />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span>Components</span>
            <span className={getStatusColor(completeness.components)}>
              {completeness.components}%
            </span>
          </div>
          <Progress value={completeness.components} className="h-1" />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span>Dimensions</span>
            <span className={getStatusColor(completeness.dimensions)}>
              {completeness.dimensions}%
            </span>
          </div>
          <Progress value={completeness.dimensions} className="h-1" />
        </div>
      </div>
    </div>
  );
};

export default CompletenessIndicator;
