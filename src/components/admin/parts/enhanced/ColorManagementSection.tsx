import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Palette, Plus, Eye } from "lucide-react";
import { Configuration } from "@/types/motorcycle";
import { TrimColorAssignment } from "@/types/colorManagement";
import { getTrimColorAssignments } from "@/services/colorManagementService";
import ColorManagerDialog from "@/components/admin/colors/ColorManagerDialog";

interface ColorManagementSectionProps {
  selectedConfig?: Configuration;
  onRefresh: () => void;
}

const ColorManagementSection = ({
  selectedConfig,
  onRefresh
}: ColorManagementSectionProps) => {
  const [colorManagerOpen, setColorManagerOpen] = useState(false);
  const [assignedColors, setAssignedColors] = useState<TrimColorAssignment[]>([]);
  const [loading, setLoading] = useState(false);

  const loadAssignedColors = async () => {
    if (!selectedConfig) return;
    
    setLoading(true);
    try {
      const colors = await getTrimColorAssignments(selectedConfig.id);
      setAssignedColors(colors);
    } catch (error) {
      console.error("Error loading assigned colors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignedColors();
  }, [selectedConfig]);

  const handleColorManagerOpen = () => {
    if (!selectedConfig) return;
    setColorManagerOpen(true);
  };

  const handleColorsChange = () => {
    loadAssignedColors();
    onRefresh();
  };

  if (!selectedConfig) {
    return (
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text">Color Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-explorer-text-muted">
            Select a trim level to manage colors
          </div>
        </CardContent>
      </Card>
    );
  }

  const defaultColor = assignedColors.find(ac => ac.is_default);

  return (
    <>
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Color Management
              <Badge variant="outline" className="text-xs">
                {selectedConfig.name || "Standard"}
              </Badge>
            </div>
            <Button
              size="sm"
              onClick={handleColorManagerOpen}
              className="bg-accent-teal text-black hover:bg-accent-teal/80"
            >
              <Plus className="h-4 w-4 mr-2" />
              Manage Colors
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4 text-explorer-text-muted">
              Loading colors...
            </div>
          ) : assignedColors.length === 0 ? (
            <div className="text-center py-8">
              <Palette className="h-12 w-12 mx-auto text-explorer-text-muted mb-4" />
              <h4 className="text-lg font-medium mb-2">No Colors Assigned</h4>
              <p className="text-explorer-text-muted mb-4">
                This trim level doesn't have any colors assigned yet.
              </p>
              <Button
                onClick={handleColorManagerOpen}
                className="bg-accent-teal text-black hover:bg-accent-teal/80"
              >
                <Plus className="h-4 w-4 mr-2" />
                Assign Colors
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Default Color */}
              {defaultColor && (
                <div className="p-3 rounded-lg border border-accent-teal bg-accent-teal/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">Default</Badge>
                      <span className="text-sm font-medium">
                        {defaultColor.color_options?.name || 'Unknown Color'}
                      </span>
                      {defaultColor.color_options?.hex_code && (
                        <div 
                          className="w-4 h-4 rounded border border-explorer-chrome/30"
                          style={{ backgroundColor: defaultColor.color_options.hex_code }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Other Colors */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {assignedColors
                  .filter(ac => !ac.is_default)
                  .map((assignment) => {
                    const color = assignment.color_options;
                    if (!color) return null;

                    return (
                      <div
                        key={assignment.id}
                        className="p-2 rounded border border-explorer-chrome/30 bg-explorer-dark"
                      >
                        <div className="flex items-center gap-2">
                          {color.hex_code && (
                            <div 
                              className="w-3 h-3 rounded border border-explorer-chrome/30"
                              style={{ backgroundColor: color.hex_code }}
                            />
                          )}
                          <span className="text-xs text-explorer-text truncate">
                            {color.name}
                          </span>
                          {color.is_limited && (
                            <Badge variant="outline" className="text-xs">L</Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Summary */}
              <div className="flex items-center justify-between pt-2 border-t border-explorer-chrome/30">
                <span className="text-sm text-explorer-text-muted">
                  {assignedColors.length} color{assignedColors.length !== 1 ? 's' : ''} assigned
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleColorManagerOpen}
                  className="bg-explorer-card border-explorer-chrome/30"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View All
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Color Manager Dialog */}
      {colorManagerOpen && selectedConfig && (
        <ColorManagerDialog
          isOpen={colorManagerOpen}
          onClose={() => setColorManagerOpen(false)}
          configuration={selectedConfig}
          onColorsChange={handleColorsChange}
        />
      )}
    </>
  );
};

export default ColorManagementSection;
