
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Palette, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ColorOption } from "@/types/colors";
import { getColorsForConfiguration, deleteColor } from "@/services/colorService";
import { ColorDialog } from "@/components/admin/colors/ColorDialog";
import ColorOptionCard from "./ColorOptionCard";

interface ColorManagementTabProps {
  modelYearId: string;
}

const ColorManagementTab = ({ modelYearId }: ColorManagementTabProps) => {
  const { toast } = useToast();
  const [colors, setColors] = useState<ColorOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingColor, setEditingColor] = useState<ColorOption | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadColors = async () => {
    try {
      setLoading(true);
      const colorData = await getColorsForConfiguration(modelYearId);
      setColors(colorData);
    } catch (error) {
      console.error("Error loading colors:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load colors for this model year."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadColors();
  }, [modelYearId]);

  const handleAddColor = () => {
    setEditingColor(null);
    setDialogOpen(true);
  };

  const handleEditColor = (color: ColorOption) => {
    setEditingColor(color);
    setDialogOpen(true);
  };

  const handleDeleteColor = async (colorId: string) => {
    if (!confirm("Are you sure you want to delete this color option?")) {
      return;
    }

    setDeletingId(colorId);
    try {
      const success = await deleteColor(colorId);
      if (success) {
        toast({
          title: "Success",
          description: "Color option deleted successfully."
        });
        loadColors();
      } else {
        throw new Error("Delete operation failed");
      }
    } catch (error) {
      console.error("Error deleting color:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete color option."
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleDialogSuccess = () => {
    loadColors();
    setDialogOpen(false);
    setEditingColor(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="text-muted-foreground">Loading colors...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Color Options</h3>
        </div>
        <Button onClick={handleAddColor} className="bg-accent-teal text-black hover:bg-accent-teal/80">
          <Plus className="mr-2 h-4 w-4" />
          Add Color
        </Button>
      </div>

      {colors.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <Palette className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h4 className="text-lg font-medium mb-2">No Color Options</h4>
            <p className="text-muted-foreground mb-4">
              This model year doesn't have any color options yet.
            </p>
            <Button onClick={handleAddColor} className="bg-accent-teal text-black hover:bg-accent-teal/80">
              <Plus className="mr-2 h-4 w-4" />
              Add First Color
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {colors.map((color) => (
            <ColorOptionCard
              key={color.id}
              color={color}
              onEdit={() => handleEditColor(color)}
              onDelete={() => handleDeleteColor(color.id)}
              isDeleting={deletingId === color.id}
            />
          ))}
        </div>
      )}

      <ColorDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        configurationId={modelYearId}
        colorId={editingColor?.id}
        initialData={editingColor ? {
          name: editingColor.name,
          hex_code: editingColor.hex_code,
          image_url: editingColor.image_url,
          is_limited: editingColor.is_limited
        } : undefined}
        onSuccess={handleDialogSuccess}
      />
    </div>
  );
};

export default ColorManagementTab;
