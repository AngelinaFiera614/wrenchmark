import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Motorcycle } from "@/types";
import MotorcycleDetailsPanel from "./unified/MotorcycleDetailsPanel";

interface ComprehensiveEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  motorcycle: Motorcycle | null;
  onSuccess: () => void;
}

const ComprehensiveEditDialog = ({
  open,
  onOpenChange,
  motorcycle,
  onSuccess
}: ComprehensiveEditDialogProps) => {
  const handleUpdateSuccess = () => {
    onSuccess();
    // Keep dialog open so user can continue editing
  };

  if (!motorcycle) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[95vh] bg-explorer-card border-explorer-chrome/30 overflow-hidden">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-explorer-text text-xl">
            Edit Motorcycle: {motorcycle.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          <MotorcycleDetailsPanel
            motorcycle={motorcycle}
            onUpdate={handleUpdateSuccess}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComprehensiveEditDialog;
