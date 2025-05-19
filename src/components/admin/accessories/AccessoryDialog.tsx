
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { AccessoryForm } from "./AccessoryForm";
import { AccessoryFormState } from "@/types/accessories";
import { createAccessory, updateAccessory } from "@/services/accessoryService";

interface AccessoryDialogProps {
  open: boolean;
  onClose: () => void;
  accessory?: {
    id: string;
    name: string;
    category: string;
    description?: string;
    price_usd?: number;
    image_url?: string;
    manufacturer?: string;
  };
  onSaved: () => void;
}

export function AccessoryDialog({
  open,
  onClose,
  accessory,
  onSaved
}: AccessoryDialogProps) {
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (formData: AccessoryFormState) => {
    setLoading(true);
    try {
      if (accessory?.id) {
        // Update existing accessory
        const result = await updateAccessory(accessory.id, formData);
        if (result) {
          toast.success("Accessory updated successfully");
          onSaved();
          onClose();
        } else {
          toast.error("Failed to update accessory");
        }
      } else {
        // Create new accessory
        const result = await createAccessory(formData);
        if (result) {
          toast.success("Accessory created successfully");
          onSaved();
          onClose();
        } else {
          toast.error("Failed to create accessory");
        }
      }
    } catch (error) {
      console.error("Error saving accessory:", error);
      toast.error("An error occurred while saving the accessory");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {accessory ? "Edit Accessory" : "Add New Accessory"}
          </DialogTitle>
        </DialogHeader>

        <AccessoryForm
          initialValues={accessory}
          onSubmit={handleSubmit}
          loading={loading}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
