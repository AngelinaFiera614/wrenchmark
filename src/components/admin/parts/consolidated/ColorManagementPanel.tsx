
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Palette, Plus } from "lucide-react";

interface ColorManagementPanelProps {
  selectedConfigData?: any;
  onRefresh: () => void;
}

const ColorManagementPanel: React.FC<ColorManagementPanelProps> = ({
  selectedConfigData,
  onRefresh
}) => {
  if (!selectedConfigData) {
    return (
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Colors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Palette className="h-12 w-12 text-explorer-text-muted mx-auto mb-4" />
            <p className="text-explorer-text-muted">Select a configuration to manage colors</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-explorer-text flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Colors
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="border-accent-teal/30 text-accent-teal hover:bg-accent-teal/10"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Color
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-6">
          <Palette className="h-8 w-8 text-explorer-text-muted mx-auto mb-3" />
          <p className="text-sm text-explorer-text-muted">
            Color management coming soon
          </p>
          <Badge variant="outline" className="mt-2">
            Future Feature
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default ColorManagementPanel;
