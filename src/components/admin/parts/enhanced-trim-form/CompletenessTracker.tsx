import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

interface CompletenessTrackerProps {
  completeness: {
    overall: number;
    sections: {
      basic: number;
      components: number;
      colors: number;
    };
  };
  className?: string;
}

const CompletenessTracker = ({ completeness, className = "" }: CompletenessTrackerProps) => {
  const getStatusColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-500";
    if (percentage >= 50) return "text-amber-500";
    return "text-destructive";
  };

  const getStatusIcon = (percentage: number) => {
    if (percentage >= 80) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (percentage >= 50) return <Clock className="h-4 w-4 text-amber-500" />;
    return <AlertCircle className="h-4 w-4 text-destructive" />;
  };

  const getStatusText = (percentage: number) => {
    if (percentage >= 80) return "Complete";
    if (percentage >= 50) return "In Progress";
    return "Needs Attention";
  };

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Overall Progress */}
      <div className="flex items-center gap-2">
        <div className="text-right">
          <div className="text-sm font-medium text-explorer-text">
            {completeness.overall}% Complete
          </div>
          <div className="text-xs text-explorer-text/60">
            Overall Progress
          </div>
        </div>
        <div className="w-12 h-12 relative">
          <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-explorer-chrome/30"
              stroke="currentColor"
              strokeWidth="3"
              fill="transparent"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={getStatusColor(completeness.overall)}
              stroke="currentColor"
              strokeWidth="3"
              fill="transparent"
              strokeDasharray={`${completeness.overall}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            {getStatusIcon(completeness.overall)}
          </div>
        </div>
      </div>

      {/* Section Progress Details */}
      <div className="flex gap-3">
        {Object.entries(completeness.sections).map(([section, percentage]) => {
          const sectionNames = {
            basic: "Basic",
            components: "Components",
            colors: "Colors"
          };

          return (
            <div key={section} className="text-center">
              <div className={`text-xs font-medium ${getStatusColor(percentage)}`}>
                {percentage}%
              </div>
              <div className="text-xs text-explorer-text/60">
                {sectionNames[section as keyof typeof sectionNames]}
              </div>
            </div>
          );
        })}
      </div>

      {/* Status Badge */}
      <Badge
        variant={completeness.overall >= 80 ? "default" : "outline"}
        className={
          completeness.overall >= 80
            ? "bg-green-500/20 text-green-500 border-green-500/30"
            : completeness.overall >= 50
            ? "bg-amber-500/20 text-amber-500 border-amber-500/30"
            : "bg-destructive/20 text-destructive border-destructive/30"
        }
      >
        {getStatusText(completeness.overall)}
      </Badge>
    </div>
  );
};

export default CompletenessTracker;