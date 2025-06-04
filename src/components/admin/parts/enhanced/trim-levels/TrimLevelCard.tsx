
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Eye, Copy, Trash2 } from "lucide-react";

interface TrimLevelCardProps {
  config: any;
  onEdit: (config: any) => void;
  onPreview: (config: any) => void;
  onCopy: (config: any) => void;
  onDelete: (config: any) => void;
}

const TrimLevelCard = ({ config, onEdit, onPreview, onCopy, onDelete }: TrimLevelCardProps) => {
  const getCompletionStatus = (config: any) => {
    // Mock completion logic
    const requiredFields = ['name', 'msrp_usd', 'engine_id', 'brake_system_id'];
    const completedFields = requiredFields.filter(field => config[field]);
    const percentage = (completedFields.length / requiredFields.length) * 100;
    
    if (percentage >= 80) return 'complete';
    if (percentage >= 40) return 'partial';
    return 'missing';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'complete': return <Badge className="bg-green-100 text-green-800 text-xs">Complete</Badge>;
      case 'partial': return <Badge className="bg-yellow-100 text-yellow-800 text-xs">Partial</Badge>;
      default: return <Badge className="bg-red-100 text-red-800 text-xs">Incomplete</Badge>;
    }
  };

  const status = getCompletionStatus(config);

  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-explorer-text">
            {config.name || 'Unnamed Trim'}
          </div>
          {getStatusBadge(status)}
        </div>
        {config.msrp_usd && (
          <div className="text-xs text-explorer-text-muted">
            MSRP: ${config.msrp_usd.toLocaleString()}
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(config)}
            className="p-1 h-auto text-explorer-text hover:bg-explorer-chrome/20"
          >
            <Settings className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPreview(config)}
            className="p-1 h-auto text-explorer-text hover:bg-explorer-chrome/20"
          >
            <Eye className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCopy(config)}
            className="p-1 h-auto text-explorer-text hover:bg-explorer-chrome/20"
          >
            <Copy className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(config)}
            className="p-1 h-auto text-red-400 hover:bg-red-500/20"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrimLevelCard;
