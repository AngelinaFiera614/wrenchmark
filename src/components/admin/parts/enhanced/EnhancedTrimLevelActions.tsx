
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Edit, Copy, Trash2, RefreshCw, Download, Upload } from "lucide-react";
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
  const hasSelection = !!selectedConfig;
  const configCount = configurations.length;

  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-explorer-text">Trim Level Actions</CardTitle>
            <Badge variant="secondary" className="text-xs">
              {configCount} {configCount === 1 ? 'trim' : 'trims'}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            className="h-8 w-8 p-0"
            title="Refresh trim levels"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Primary Actions */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-explorer-text">Primary Actions</h4>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={onCreateNew}
              className="bg-accent-teal text-black hover:bg-accent-teal/80"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Trim Level
            </Button>
            
            <Button
              onClick={() => hasSelection && onEdit(selectedConfig)}
              disabled={!hasSelection}
              variant="outline"
              size="sm"
              className="border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Selected
            </Button>
            
            <Button
              onClick={() => hasSelection && onDelete(selectedConfig)}
              disabled={!hasSelection}
              variant="outline"
              size="sm"
              className="border-red-400/30 text-red-400 hover:bg-red-500/20"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected
            </Button>
          </div>
        </div>

        <Separator className="bg-explorer-chrome/30" />

        {/* Quick Copy Actions */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-explorer-text">Quick Copy</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => onQuickCopy('components')}
              disabled={!hasSelection}
              variant="outline"
              size="sm"
              className="text-xs border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
            >
              Components
            </Button>
            <Button
              onClick={() => onQuickCopy('dimensions')}
              disabled={!hasSelection}
              variant="outline"
              size="sm"
              className="text-xs border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
            >
              Dimensions
            </Button>
            <Button
              onClick={() => onQuickCopy('colors')}
              disabled={!hasSelection}
              variant="outline"
              size="sm"
              className="text-xs border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
            >
              Colors
            </Button>
            <Button
              onClick={() => onQuickCopy('all')}
              disabled={!hasSelection}
              variant="outline"
              size="sm"
              className="text-xs border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
            >
              All Data
            </Button>
          </div>
        </div>

        <Separator className="bg-explorer-chrome/30" />

        {/* Bulk Operations */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-explorer-text">Bulk Operations</h4>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={configCount === 0}
              className="text-xs border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
            >
              <Download className="h-3 w-3 mr-1" />
              Export All
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
            >
              <Upload className="h-3 w-3 mr-1" />
              Import
            </Button>
          </div>
        </div>

        {/* Selection Info */}
        {hasSelection && (
          <>
            <Separator className="bg-explorer-chrome/30" />
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-explorer-text">Selected Trim</h4>
              <p className="text-sm text-explorer-text-muted">
                {selectedConfig.name || 'Unnamed Configuration'}
              </p>
              {selectedConfig.msrp_usd && (
                <p className="text-xs text-explorer-text-muted">
                  MSRP: ${selectedConfig.msrp_usd.toLocaleString()}
                </p>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedTrimLevelActions;
