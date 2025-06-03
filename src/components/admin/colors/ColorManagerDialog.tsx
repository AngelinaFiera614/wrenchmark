
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Palette, Eye, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Configuration } from "@/types/motorcycle";
import { ColorOption } from "@/types/colors";
import { TrimColorAssignment } from "@/types/colorManagement";
import { getAvailableColorsForTrim, assignColorToTrim, unassignColorFromTrim, setDefaultTrimColor } from "@/services/colorManagementService";
import { ColorDialog } from "./ColorDialog";

interface ColorManagerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  configuration: Configuration;
  onColorsChange: () => void;
}

const ColorManagerDialog = ({
  isOpen,
  onClose,
  configuration,
  onColorsChange
}: ColorManagerDialogProps) => {
  const { toast } = useToast();
  const [availableColors, setAvailableColors] = useState<ColorOption[]>([]);
  const [assignedColors, setAssignedColors] = useState<TrimColorAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [colorDialogOpen, setColorDialogOpen] = useState(false);
  const [assigningColor, setAssigningColor] = useState<string | null>(null);

  const loadColors = async () => {
    if (!configuration.model_year_id) return;
    
    setLoading(true);
    try {
      const { availableColors: available, assignedColors: assigned } = await getAvailableColorsForTrim(
        configuration.model_year_id,
        configuration.id
      );
      setAvailableColors(available);
      setAssignedColors(assigned);
    } catch (error) {
      console.error("Error loading colors:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load colors for this trim level."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadColors();
    }
  }, [isOpen, configuration]);

  const handleAssignColor = async (colorId: string) => {
    setAssigningColor(colorId);
    try {
      const result = await assignColorToTrim({
        configuration_id: configuration.id,
        color_option_id: colorId
      });

      if (result) {
        toast({
          title: "Success",
          description: "Color assigned to trim level successfully."
        });
        loadColors();
        onColorsChange();
      } else {
        throw new Error("Assignment failed");
      }
    } catch (error) {
      console.error("Error assigning color:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to assign color to trim level."
      });
    } finally {
      setAssigningColor(null);
    }
  };

  const handleUnassignColor = async (colorId: string) => {
    try {
      const success = await unassignColorFromTrim(configuration.id, colorId);
      
      if (success) {
        toast({
          title: "Success",
          description: "Color unassigned from trim level."
        });
        loadColors();
        onColorsChange();
      } else {
        throw new Error("Unassignment failed");
      }
    } catch (error) {
      console.error("Error unassigning color:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to unassign color from trim level."
      });
    }
  };

  const handleSetDefault = async (colorId: string) => {
    try {
      const success = await setDefaultTrimColor(configuration.id, colorId);
      
      if (success) {
        toast({
          title: "Success",
          description: "Default color updated successfully."
        });
        loadColors();
        onColorsChange();
      } else {
        throw new Error("Setting default failed");
      }
    } catch (error) {
      console.error("Error setting default color:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to set default color."
      });
    }
  };

  const isColorAssigned = (colorId: string) => {
    return assignedColors.some(ac => ac.color_option_id === colorId);
  };

  const getDefaultColor = () => {
    return assignedColors.find(ac => ac.is_default);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col bg-explorer-card border-explorer-chrome/30">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-explorer-text flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Palette className="h-5 w-5" />
                <span>Color Manager</span>
                <Badge variant="outline" className="text-xs">
                  {configuration.name || "Standard"}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-explorer-text-muted hover:text-explorer-text"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-hidden">
            <Tabs defaultValue="assigned" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="assigned">Assigned Colors ({assignedColors.length})</TabsTrigger>
                <TabsTrigger value="available">Available Colors ({availableColors.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="assigned" className="flex-1 overflow-auto">
                {loading ? (
                  <div className="text-center py-8 text-explorer-text-muted">Loading colors...</div>
                ) : assignedColors.length === 0 ? (
                  <div className="text-center py-8">
                    <Palette className="h-12 w-12 mx-auto text-explorer-text-muted mb-4" />
                    <p className="text-explorer-text-muted">No colors assigned to this trim level yet.</p>
                    <p className="text-sm text-explorer-text-muted mt-2">
                      Switch to the "Available Colors" tab to assign colors.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {assignedColors.map((assignment) => {
                      const color = assignment.color_options;
                      if (!color) return null;
                      
                      return (
                        <div
                          key={assignment.id}
                          className={`p-4 rounded-lg border ${
                            assignment.is_default 
                              ? 'border-accent-teal bg-accent-teal/10' 
                              : 'border-explorer-chrome/30 bg-explorer-dark'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {color.hex_code && (
                                <div 
                                  className="w-6 h-6 rounded border border-explorer-chrome/30"
                                  style={{ backgroundColor: color.hex_code }}
                                />
                              )}
                              <span className="font-medium text-explorer-text">{color.name}</span>
                              {assignment.is_default && (
                                <Badge variant="secondary" className="text-xs">Default</Badge>
                              )}
                              {color.is_limited && (
                                <Badge variant="outline" className="text-xs">Limited</Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex gap-2 mt-3">
                            {!assignment.is_default && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleSetDefault(color.id)}
                                className="bg-explorer-card border-explorer-chrome/30"
                              >
                                Set Default
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUnassignColor(color.id)}
                              className="text-orange-400 border-orange-400/30 hover:bg-orange-400/20"
                            >
                              Unassign
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="available" className="flex-1 overflow-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-medium text-explorer-text">Available for this Model Year</h3>
                  <Button
                    size="sm"
                    onClick={() => setColorDialogOpen(true)}
                    className="bg-accent-teal text-black hover:bg-accent-teal/80"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Color
                  </Button>
                </div>

                {loading ? (
                  <div className="text-center py-8 text-explorer-text-muted">Loading colors...</div>
                ) : availableColors.length === 0 ? (
                  <div className="text-center py-8">
                    <Palette className="h-12 w-12 mx-auto text-explorer-text-muted mb-4" />
                    <p className="text-explorer-text-muted">No colors available for this model year.</p>
                    <Button
                      onClick={() => setColorDialogOpen(true)}
                      className="mt-4 bg-accent-teal text-black hover:bg-accent-teal/80"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Color
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableColors.map((color) => {
                      const isAssigned = isColorAssigned(color.id);
                      const isAssigning = assigningColor === color.id;
                      
                      return (
                        <div
                          key={color.id}
                          className={`p-4 rounded-lg border ${
                            isAssigned 
                              ? 'border-green-500/30 bg-green-500/5' 
                              : 'border-explorer-chrome/30 bg-explorer-dark'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {color.hex_code && (
                                <div 
                                  className="w-6 h-6 rounded border border-explorer-chrome/30"
                                  style={{ backgroundColor: color.hex_code }}
                                />
                              )}
                              <span className="font-medium text-explorer-text">{color.name}</span>
                              {color.is_limited && (
                                <Badge variant="outline" className="text-xs">Limited</Badge>
                              )}
                            </div>
                            <Badge 
                              variant={isAssigned ? "secondary" : "destructive"}
                              className="text-xs"
                            >
                              {isAssigned ? "Assigned" : "Not Assigned"}
                            </Badge>
                          </div>
                          
                          <div className="flex gap-2 mt-3">
                            {isAssigned ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUnassignColor(color.id)}
                                className="text-orange-400 border-orange-400/30 hover:bg-orange-400/20"
                              >
                                Unassign
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => handleAssignColor(color.id)}
                                disabled={isAssigning}
                                className="bg-accent-teal text-black hover:bg-accent-teal/80"
                              >
                                {isAssigning ? "Assigning..." : "Assign"}
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* Color Creation Dialog */}
      {colorDialogOpen && configuration.model_year_id && (
        <ColorDialog
          open={colorDialogOpen}
          onClose={() => setColorDialogOpen(false)}
          configurationId={configuration.model_year_id}
          onSuccess={() => {
            loadColors();
            setColorDialogOpen(false);
          }}
        />
      )}
    </>
  );
};

export default ColorManagerDialog;
