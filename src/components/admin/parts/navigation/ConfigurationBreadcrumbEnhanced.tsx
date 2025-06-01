
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, Home, Copy, Edit, Save } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from "@/components/ui/breadcrumb";

interface ConfigurationBreadcrumbEnhancedProps {
  selectedModelData: any;
  selectedYearData: any;
  selectedConfigData: any;
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
  showQuickActions = true
}: ConfigurationBreadcrumbEnhancedProps) => {
  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin">
                  <Home className="h-4 w-4" />
                </BreadcrumbLink>
              </BreadcrumbItem>
              
              {selectedModelData && (
                <>
                  <BreadcrumbSeparator>
                    <ChevronRight className="h-4 w-4" />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    <BreadcrumbLink className="text-accent-teal">
                      {selectedModelData.brands?.[0]?.name} {selectedModelData.name}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}
              
              {selectedYearData && (
                <>
                  <BreadcrumbSeparator>
                    <ChevronRight className="h-4 w-4" />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    <BreadcrumbLink className="text-blue-400">
                      {selectedYearData.year}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}
              
              {selectedConfigData && (
                <>
                  <BreadcrumbSeparator>
                    <ChevronRight className="h-4 w-4" />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-purple-400">
                      {selectedConfigData.name || "Standard"}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
              
              {!selectedModelData && (
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-explorer-text-muted">
                    Select a model to begin configuration workflow
                  </BreadcrumbPage>
                </BreadcrumbItem>
              )}
            </BreadcrumbList>
          </Breadcrumb>

          {/* Quick Actions Toolbar */}
          {showQuickActions && selectedConfigData && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onQuickCopy}
                className="flex items-center gap-1"
                title="Quick Copy (Ctrl+C)"
              >
                <Copy className="h-3 w-3" />
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onQuickEdit}
                className="flex items-center gap-1"
                title="Quick Edit (Ctrl+E)"
              >
                <Edit className="h-3 w-3" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onQuickSave}
                className="flex items-center gap-1"
                title="Quick Save (Ctrl+S)"
              >
                <Save className="h-3 w-3" />
                Save
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConfigurationBreadcrumbEnhanced;
