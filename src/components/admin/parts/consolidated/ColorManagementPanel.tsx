import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Palette, Plus, Edit, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ColorManagementPanelProps {
  selectedYearData?: any;
  selectedConfigData?: any;
  onColorAssigned: () => void;
  onRefresh?: () => void;
}

const ColorManagementPanel: React.FC<ColorManagementPanelProps> = ({
  selectedYearData,
  selectedConfigData,
  onColorAssigned,
  onRefresh
}) => {
  const { toast } = useToast();
  const [showColorDialog, setShowColorDialog] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [isAssigning, setIsAssigning] = useState(false);
  const [showCreateColor, setShowCreateColor] = useState(false);
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#000000");

  // Fetch available colors for the model year
  const { data: colors = [], isLoading } = useQuery({
    queryKey: ['color_options', selectedYearData?.id],
    queryFn: async () => {
      if (!selectedYearData?.id) return [];
      
      const { data, error } = await supabase
        .from('color_options')
        .select('*')
        .eq('model_year_id', selectedYearData.id)
        .order('name');
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedYearData?.id
  });

  const handleAssignColor = async () => {
    if (!selectedColor || !selectedConfigData?.id) return;

    setIsAssigning(true);
    try {
      const { error } = await supabase
        .from('model_configurations')
        .update({ color_id: selectedColor })
        .eq('id', selectedConfigData.id);

      if (error) throw error;

      toast({
        title: "Color Assigned",
        description: "Color has been successfully assigned to the configuration."
      });

      onColorAssigned();
      onRefresh?.();
      setShowColorDialog(false);
      setSelectedColor("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Assignment Failed",
        description: error.message || "Failed to assign color."
      });
    } finally {
      setIsAssigning(false);
    }
  };

  const handleCreateColor = async () => {
    if (!newColorName || !selectedYearData?.id) return;

    try {
      const { data, error } = await supabase
        .from('color_options')
        .insert({
          model_year_id: selectedYearData.id,
          name: newColorName,
          hex_code: newColorHex
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Color Created",
        description: `${newColorName} has been created successfully.`
      });

      onRefresh?.();
      setShowCreateColor(false);
      setNewColorName("");
      setNewColorHex("#000000");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Creation Failed",
        description: error.message || "Failed to create color."
      });
    }
  };

  if (!selectedYearData) {
    return (
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Color Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Palette className="h-12 w-12 text-explorer-text-muted mx-auto mb-4" />
            <p className="text-explorer-text-muted">Select a model year to manage colors</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-explorer-text flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Color Management
              <Badge variant="secondary">{colors.length}</Badge>
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCreateColor(true)}
                className="border-accent-teal/30 text-accent-teal hover:bg-accent-teal/10"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Color
              </Button>
              {selectedConfigData && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowColorDialog(true)}
                  className="border-accent-teal/30 text-accent-teal hover:bg-accent-teal/10"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Assign
                </Button>
              )}
            </div>
          </div>
          <p className="text-sm text-explorer-text-muted">
            {selectedYearData.year} Color Options
          </p>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-12 bg-explorer-chrome/20 rounded animate-pulse" />
              ))}
            </div>
          ) : colors.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {colors.map((color) => (
                <div
                  key={color.id}
                  className="flex items-center justify-between p-3 border border-explorer-chrome/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-full border border-explorer-chrome/30"
                      style={{ backgroundColor: color.hex_code }}
                    />
                    <div>
                      <div className="font-medium text-explorer-text">{color.name}</div>
                      <div className="text-sm text-explorer-text-muted">{color.hex_code}</div>
                    </div>
                  </div>
                  {selectedConfigData?.color_id === color.id && (
                    <Badge variant="secondary">Current</Badge>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Palette className="h-12 w-12 text-explorer-text-muted mx-auto mb-4" />
              <p className="text-explorer-text-muted mb-4">No colors found</p>
              <Button
                variant="outline"
                onClick={() => setShowCreateColor(true)}
                className="border-accent-teal/30 text-accent-teal hover:bg-accent-teal/10"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Color
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Color Assignment Dialog */}
      <Dialog open={showColorDialog} onOpenChange={setShowColorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Color to Configuration</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              {colors.map((color) => (
                <div
                  key={color.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedColor === color.id
                      ? 'border-accent-teal bg-accent-teal/10'
                      : 'border-explorer-chrome/30 hover:bg-explorer-chrome/10'
                  }`}
                  onClick={() => setSelectedColor(color.id)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-full border border-explorer-chrome/30"
                      style={{ backgroundColor: color.hex_code }}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{color.name}</div>
                      <div className="text-sm text-explorer-text-muted">{color.hex_code}</div>
                    </div>
                    {selectedColor === color.id && (
                      <Check className="h-5 w-5 text-accent-teal" />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowColorDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAssignColor}
                disabled={!selectedColor || isAssigning}
                className="bg-accent-teal text-black hover:bg-accent-teal/80"
              >
                {isAssigning ? "Assigning..." : "Assign Color"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Color Dialog */}
      <Dialog open={showCreateColor} onOpenChange={setShowCreateColor}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Color</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Color Name</label>
              <Input
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                placeholder="Racing Red, Midnight Black, etc."
              />
            </div>
            <div>
              <label className="text-sm font-medium">Hex Color Code</label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={newColorHex}
                  onChange={(e) => setNewColorHex(e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={newColorHex}
                  onChange={(e) => setNewColorHex(e.target.value)}
                  placeholder="#000000"
                  className="flex-1"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowCreateColor(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateColor}
                disabled={!newColorName}
                className="bg-accent-teal text-black hover:bg-accent-teal/80"
              >
                Create Color
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ColorManagementPanel;
