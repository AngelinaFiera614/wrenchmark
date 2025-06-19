
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useColorDialog } from "./hooks/useColorDialog";
import { ColorOptionDialogProps } from "./types";
import ModelYearSelector from "./ModelYearSelector";
import ColorPreview from "./ColorPreview";

const ColorOptionDialog = ({ open, color, onClose }: ColorOptionDialogProps) => {
  const {
    formData,
    setFormData,
    saving,
    isEditing,
    modelYears,
    handleSave
  } = useColorDialog(color, open);

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="bg-explorer-card border-explorer-chrome/30 text-explorer-text sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit" : "Add"} Color Option</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Color Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Midnight Black"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="bg-explorer-dark border-explorer-chrome/30"
            />
          </div>

          <ModelYearSelector
            value={formData.model_year_id}
            onChange={(value) => setFormData(prev => ({ ...prev, model_year_id: value }))}
            modelYears={modelYears}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hex_code">Hex Color Code</Label>
              <Input
                id="hex_code"
                placeholder="#000000"
                value={formData.hex_code}
                onChange={(e) => setFormData(prev => ({ ...prev, hex_code: e.target.value }))}
                className="bg-explorer-dark border-explorer-chrome/30"
              />
            </div>

            <div className="flex items-center space-x-2 mt-6">
              <Switch
                id="is_limited"
                checked={formData.is_limited}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_limited: checked }))}
              />
              <Label htmlFor="is_limited">Limited Edition</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              placeholder="https://example.com/color-image.jpg"
              value={formData.image_url}
              onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
              className="bg-explorer-dark border-explorer-chrome/30"
            />
          </div>

          <ColorPreview 
            hexCode={formData.hex_code}
            imageUrl={formData.image_url}
          />

          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => onClose()}
              className="border-explorer-chrome/30"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => handleSave(onClose)}
              disabled={saving}
              className="bg-accent-teal text-black hover:bg-accent-teal/80"
            >
              {saving ? "Saving..." : isEditing ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ColorOptionDialog;
