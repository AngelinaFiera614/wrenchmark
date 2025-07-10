
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings } from "lucide-react";
import ComponentAssignmentDialog from "./ComponentAssignmentDialog";

interface ComponentManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedModel?: any;
  selectedConfiguration?: any;
  onComponentLinked: () => void;
}

const ComponentManagementDialog = ({ 
  open, 
  onOpenChange, 
  selectedModel, 
  selectedConfiguration,
  onComponentLinked 
}: ComponentManagementDialogProps) => {
  return (
    <ComponentAssignmentDialog
      open={open}
      onOpenChange={onOpenChange}
      selectedModel={selectedModel}
      onSuccess={onComponentLinked}
    />
  );
};

export default ComponentManagementDialog;
