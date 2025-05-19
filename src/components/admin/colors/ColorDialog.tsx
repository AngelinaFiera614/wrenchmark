
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ColorForm } from "./ColorForm";
import { ColorFormState } from "@/types/colors";
import { createColor, updateColor } from "@/services/colorService";
import { toast } from "sonner";

interface ColorDialogProps {
  open: boolean;
  onClose: () => void;
  configurationId: string;
  colorId?: string;
  initialData?: ColorFormState;
  onSuccess: () => void;
}

export function ColorDialog({
  open,
  onClose,
  configurationId,
  colorId,
  initialData,
  onSuccess
}: ColorDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (data: ColorFormState) => {
    setIsSubmitting(true);
    try {
      if (colorId) {
        // Update existing color
        await updateColor(colorId, data);
        toast.success("Color updated successfully");
      } else {
        // Create new color
        await createColor(configurationId, data);
        toast.success("Color added successfully");
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving color:", error);
      toast.error("Failed to save color");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {colorId ? "Edit Color" : "Add New Color"}
          </DialogTitle>
        </DialogHeader>
        
        <ColorForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
