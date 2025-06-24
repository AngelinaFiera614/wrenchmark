
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";

interface ModelAssignmentCardProps {
  model: any;
  assignmentStatus: {
    engine: boolean;
    brake_system: boolean;
    frame: boolean;
    suspension: boolean;
    wheel: boolean;
  };
  onManage: () => void;
}

const ModelAssignmentCard: React.FC<ModelAssignmentCardProps> = ({
  model,
  assignmentStatus,
  onManage
}) => {
  const completedCount = Object.values(assignmentStatus).filter(Boolean).length;
  const totalCount = Object.keys(assignmentStatus).length;
  const completionPercentage = Math.round((completedCount / totalCount) * 100);
  const brandName = model.brands?.[0]?.name || 'Unknown Brand';

  return (
    <Card className="bg-explorer-card border-explorer-chrome/30 hover:border-accent-teal/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="font-medium text-explorer-text mb-1">
              {brandName} {model.name}
            </div>
            <div className="text-sm text-explorer-text-muted">
              {model.type} • {model.production_start_year}
              {model.production_end_year && ` - ${model.production_end_year}`}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-sm font-medium text-explorer-text">
                {completedCount}/{totalCount}
              </div>
              <div className="text-xs text-explorer-text-muted">
                {completionPercentage}%
              </div>
            </div>
            <div className="w-12 h-2 bg-explorer-chrome/30 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all ${
                  completionPercentage >= 80 ? 'bg-green-400' :
                  completionPercentage >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                }`}
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-wrap gap-1">
            {Object.entries(assignmentStatus).map(([type, assigned]) => (
              <Badge
                key={type}
                variant={assigned ? "default" : "outline"}
                className={`text-xs ${
                  assigned 
                    ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                    : 'border-orange-400/30 text-orange-400'
                }`}
              >
                {assigned ? (
                  <CheckCircle className="h-2 w-2 mr-1" />
                ) : (
                  <AlertCircle className="h-2 w-2 mr-1" />
                )}
                {type.replace('_', ' ')}
              </Badge>
            ))}
          </div>
        </div>
        
        <Button
          onClick={onManage}
          variant="outline"
          size="sm"
          className="w-full border-explorer-chrome/30 text-explorer-text hover:bg-accent-teal/20 hover:border-accent-teal"
        >
          <Settings className="h-3 w-3 mr-2" />
          Manage Components
          <ArrowRight className="h-3 w-3 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default ModelAssignmentCard;
