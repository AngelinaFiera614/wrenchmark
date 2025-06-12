
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, Home, Car, Calendar, Settings, Copy, Edit, Save } from "lucide-react";

interface ConfigurationBreadcrumbEnhancedProps {
  selectedModelData?: any;
  selectedYearData?: any;
  selectedConfigData?: any;
  onQuickCopy?: () => void;
  onQuickEdit?: () => void;
  onQuickSave?: () => void;
  showQuickActions?: boolean;
}

const ConfigurationBreadcrumbEnhanced = ({
  selectedModelData,
  selectedYearData,
  selectedConfigData,
  onQuickCopy,
  onQuickEdit,
  onQuickSave,
  showQuickActions = false
}: ConfigurationBreadcrumbEnhancedProps) => {
  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardContent className="py-3">
        <div className="flex items-center justify-between">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center space-x-2 text-sm">
            <Home className="h-4 w-4 text-explorer-text-muted" />
            <span className="text-explorer-text-muted">Admin</span>
            
            <ChevronRight className="h-4 w-4 text-explorer-text-muted" />
            <span className="text-explorer-text-muted">Parts Assignment</span>
            
            {selectedModelData && (
              <>
                <ChevronRight className="h-4 w-4 text-explorer-text-muted" />
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-accent-teal" />
                  <span className="text-explorer-text font-medium">
                    {selectedModelData.brand?.name} {selectedModelData.name}
                  </span>
                </div>
              </>
            )}
            
            {selectedYearData && (
              <>
                <ChevronRight className="h-4 w-4 text-explorer-text-muted" />
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-400" />
                  <span className="text-explorer-text">{selectedYearData.year}</span>
                </div>
              </>
            )}
            
            {selectedConfigData && (
              <>
                <ChevronRight className="h-4 w-4 text-explorer-text-muted" />
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-yellow-400" />
                  <span className="text-explorer-text">{selectedConfigData.name}</span>
                  {selectedConfigData.is_default && (
                    <Badge variant="secondary" className="text-xs">Default</Badge>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Quick Actions */}
          {showQuickActions && selectedConfigData && (
            <div className="flex items-center gap-2">
              <Separator orientation="vertical" className="h-6 bg-explorer-chrome/30" />
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onQuickCopy}
                  className="h-8 px-2 text-xs"
                  title="Quick Copy (Ctrl+C)"
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onQuickEdit}
                  className="h-8 px-2 text-xs"
                  title="Quick Edit (Ctrl+E)"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onQuickSave}
                  className="h-8 px-2 text-xs"
                  title="Quick Save (Ctrl+S)"
                >
                  <Save className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConfigurationBreadcrumbEnhanced;
