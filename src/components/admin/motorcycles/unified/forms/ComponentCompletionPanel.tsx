
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Wrench, CheckCircle2, AlertCircle, Plus } from "lucide-react";
import { Motorcycle } from "@/types";
import { useMotorcycleCompleteness } from "@/hooks/useMotorcycleCompleteness";

interface ComponentCompletionPanelProps {
  motorcycle: Motorcycle;
  onManageComponents?: () => void;
}

const ComponentCompletionPanel = ({
  motorcycle,
  onManageComponents
}: ComponentCompletionPanelProps) => {
  const { completeness, loading } = useMotorcycleCompleteness(motorcycle);

  if (loading || !completeness) {
    return (
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-explorer-chrome/20 rounded w-3/4 mb-2"></div>
            <div className="h-2 bg-explorer-chrome/20 rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const componentStatus = [
    { type: 'Engine', hasComponent: completeness.hasEngine, label: 'engine' },
    { type: 'Brake System', hasComponent: completeness.hasBrakes, label: 'brake_system' },
    { type: 'Frame', hasComponent: completeness.hasFrame, label: 'frame' },
    { type: 'Suspension', hasComponent: completeness.hasSuspension, label: 'suspension' },
    { type: 'Wheels', hasComponent: completeness.hasWheels, label: 'wheel' }
  ];

  const completedComponents = componentStatus.filter(c => c.hasComponent).length;
  const componentCompletionPercentage = Math.round((completedComponents / componentStatus.length) * 100);

  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-explorer-text flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Component Integration
          </CardTitle>
          <Badge 
            variant={componentCompletionPercentage >= 80 ? "default" : "secondary"}
            className={componentCompletionPercentage >= 80 ? "bg-green-500 text-white" : "bg-yellow-500 text-black"}
          >
            {componentCompletionPercentage}% Complete
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-explorer-text-muted">
            {completedComponents} of {componentStatus.length} components linked
          </span>
          <Progress value={componentCompletionPercentage} className="w-32 h-2" />
        </div>

        <div className="grid grid-cols-1 gap-3">
          {componentStatus.map(({ type, hasComponent, label }) => (
            <div key={type} className="flex items-center justify-between p-3 bg-explorer-dark/50 rounded-lg border border-explorer-chrome/20">
              <div className="flex items-center gap-2">
                {hasComponent ? (
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-400" />
                )}
                <span className="text-explorer-text">{type}</span>
              </div>
              <Badge 
                variant="outline" 
                className={hasComponent ? "text-green-400 border-green-400/30" : "text-red-400 border-red-400/30"}
              >
                {hasComponent ? "Linked" : "Missing"}
              </Badge>
            </div>
          ))}
        </div>

        {onManageComponents && (
          <Button 
            onClick={onManageComponents}
            className="w-full bg-accent-teal text-black hover:bg-accent-teal/80"
          >
            <Plus className="h-4 w-4 mr-2" />
            Manage Components
          </Button>
        )}

        {completeness.missingCriticalFields.length > 0 && (
          <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <span className="text-red-400 font-medium text-sm">Critical Fields Missing</span>
            </div>
            <div className="text-sm text-red-300">
              {completeness.missingCriticalFields.join(', ')}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ComponentCompletionPanel;
