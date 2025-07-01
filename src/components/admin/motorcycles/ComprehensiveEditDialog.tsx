import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
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
  const handleClose = () => {
    onOpenChange(false);
  };

  const handleUpdateSuccess = () => {
    onSuccess();
    // Keep dialog open so user can continue editing
  };

  if (!motorcycle) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[95vh] bg-explorer-card border-explorer-chrome/30 overflow-hidden">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-explorer-text text-xl">
              Edit Motorcycle: {motorcycle.name}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-explorer-text-muted hover:text-explorer-text"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
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
