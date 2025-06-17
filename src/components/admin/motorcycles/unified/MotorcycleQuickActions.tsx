
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Upload, 
  Copy, 
  Trash2, 
  Eye, 
  EyeOff, 
  Zap,
  Database
} from "lucide-react";
import { Motorcycle } from "@/types";

interface MotorcycleQuickActionsProps {
  selectedMotorcycles: Motorcycle[];
  onRefresh: () => void;
}

const MotorcycleQuickActions = ({ selectedMotorcycles, onRefresh }: MotorcycleQuickActionsProps) => {
  const bulkActions = [
    {
      title: "Publish Selected",
      description: "Make selected motorcycles visible to users",
      icon: Eye,
      color: "text-green-400",
      action: () => console.log("Bulk publish")
    },
    {
      title: "Unpublish Selected", 
      description: "Move selected motorcycles to drafts",
      icon: EyeOff,
      color: "text-orange-400",
      action: () => console.log("Bulk unpublish")
    },
    {
      title: "Auto-Complete Data",
      description: "Fill missing specs using AI and similar models",
      icon: Zap,
      color: "text-accent-teal",
      action: () => console.log("Auto-complete")
    },
    {
      title: "Duplicate Models",
      description: "Create copies of selected models",
      icon: Copy,
      color: "text-blue-400",
      action: () => console.log("Duplicate")
    },
    {
      title: "Delete Selected",
      description: "Permanently remove selected motorcycles",
      icon: Trash2,
      color: "text-red-400",
      action: () => console.log("Delete")
    }
  ];

  const dataActions = [
    {
      title: "Export to CSV",
      description: "Download motorcycle data as spreadsheet",
      icon: Download,
      action: () => console.log("Export CSV")
    },
    {
      title: "Import from CSV",
      description: "Upload motorcycle data from spreadsheet",
      icon: Upload,
      action: () => console.log("Import CSV")
    },
    {
      title: "Sync with Components",
      description: "Update motorcycle specs from component data",
      icon: Database,
      action: () => console.log("Sync components")
    }
  ];

  return (
    <div className="space-y-6">
      {/* Selection Info */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-explorer-text">
                {selectedMotorcycles.length} motorcycle{selectedMotorcycles.length !== 1 ? 's' : ''} selected
              </span>
              {selectedMotorcycles.length > 0 && (
                <div className="text-sm text-explorer-text-muted mt-1">
                  Ready for bulk operations
                </div>
              )}
            </div>
            {selectedMotorcycles.length > 0 && (
              <Badge variant="outline" className="text-accent-teal border-accent-teal">
                {selectedMotorcycles.length} Selected
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text">Bulk Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bulkActions.map((action) => (
              <div
                key={action.title}
                className="p-4 bg-explorer-dark rounded-lg border border-explorer-chrome/20 hover:border-explorer-chrome/40 transition-colors cursor-pointer"
                onClick={action.action}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-explorer-chrome/10`}>
                    <action.icon className={`h-5 w-5 ${action.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-explorer-text">{action.title}</div>
                    <div className="text-sm text-explorer-text-muted mt-1">
                      {action.description}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Operations */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text">Data Operations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dataActions.map((action) => (
              <Button
                key={action.title}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 bg-explorer-dark border-explorer-chrome/30 hover:border-accent-teal"
                onClick={action.action}
              >
                <action.icon className="h-6 w-6 text-accent-teal" />
                <div className="text-center">
                  <div className="font-medium text-explorer-text">{action.title}</div>
                  <div className="text-xs text-explorer-text-muted mt-1">
                    {action.description}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Suggestions */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text">Quick Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-explorer-dark rounded-lg border border-yellow-400/30">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-explorer-text font-medium">45 motorcycles missing engine specs</div>
                  <div className="text-sm text-explorer-text-muted">Auto-fill from component library?</div>
                </div>
                <Button size="sm" className="bg-accent-teal text-black hover:bg-accent-teal/80">
                  Auto-Fill
                </Button>
              </div>
            </div>
            
            <div className="p-3 bg-explorer-dark rounded-lg border border-blue-400/30">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-explorer-text font-medium">23 draft motorcycles ready to publish</div>
                  <div className="text-sm text-explorer-text-muted">All have complete basic information</div>
                </div>
                <Button size="sm" variant="outline">
                  Review & Publish
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MotorcycleQuickActions;
