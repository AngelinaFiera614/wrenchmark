
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
import EnhancedColorForm from "./EnhancedColorForm";

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
        
        <div className="space-y-6 max-h-[70vh] overflow-y-auto">
          <ModelYearSelector
            value={formData.model_year_id}
            onChange={(value) => setFormData(prev => ({ ...prev, model_year_id: value }))}
            modelYears={modelYears}
          />

          <EnhancedColorForm
            formData={formData}
            setFormData={(data) => setFormData(data)}
          />

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
