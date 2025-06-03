
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, RefreshCw, Copy, Trash2, Edit, Palette, Wrench, Ruler } from "lucide-react";
import { Configuration } from "@/types/motorcycle";

interface EnhancedTrimLevelActionsProps {
  selectedConfig?: Configuration;
  configurations: Configuration[];
  onCreateNew: () => void;
  onEdit: (config: Configuration) => void;
  onDelete: (config: Configuration) => void;
  onQuickCopy: (type: 'components' | 'dimensions' | 'colors' | 'all') => void;
  onRefresh: () => void;
}

const EnhancedTrimLevelActions = ({
  selectedConfig,
  configurations,
  onCreateNew,
  onEdit,
  onDelete,
  onQuickCopy,
  onRefresh
}: EnhancedTrimLevelActionsProps) => {
  const hasOtherConfigs = configurations.length > 1;

  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            Trim Level Actions
            <Badge variant="outline" className="text-xs">
              {configurations.length} trim{configurations.length !== 1 ? 's' : ''}
            </Badge>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={onRefresh}
            className="bg-explorer-card border-explorer-chrome/30"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Primary Actions */}
        <div className="flex gap-2">
          <Button
            onClick={onCreateNew}
            className="bg-accent-teal text-black hover:bg-accent-teal/80 flex-1"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Trim Level
          </Button>
          
          {selectedConfig && (
            <>
              <Button
                onClick={() => onEdit(selectedConfig)}
                variant="outline"
                className="bg-explorer-card border-explorer-chrome/30"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                onClick={() => onDelete(selectedConfig)}
                variant="destructive"
                size="sm"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        {/* Quick Copy Actions */}
        {selectedConfig && hasOtherConfigs && (
          <div className="space-y-3">
            <div className="text-sm font-medium text-explorer-text">
              Quick Copy to "{selectedConfig.name}":
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onQuickCopy('components')}
                className="bg-explorer-card border-explorer-chrome/30 justify-start"
              >
                <Wrench className="h-3 w-3 mr-2" />
                Components
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onQuickCopy('dimensions')}
                className="bg-explorer-card border-explorer-chrome/30 justify-start"
              >
                <Ruler className="h-3 w-3 mr-2" />
                Dimensions
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onQuickCopy('colors')}
                className="bg-explorer-card border-explorer-chrome/30 justify-start"
              >
                <Palette className="h-3 w-3 mr-2" />
                Colors
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onQuickCopy('all')}
                className="bg-explorer-card border-explorer-chrome/30 justify-start"
              >
                <Copy className="h-3 w-3 mr-2" />
                All Data
              </Button>
            </div>
          </div>
        )}

        {/* Status Information */}
        {selectedConfig && (
          <div className="pt-3 border-t border-explorer-chrome/30">
            <div className="text-xs text-explorer-text-muted">
              Selected: {selectedConfig.name}
              {selectedConfig.is_default && " (Default)"}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedTrimLevelActions;
