
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Configuration } from "@/types/motorcycle";
import { deleteConfiguration } from "@/services/models/configurationService";

interface EnhancedDeleteTrimDialogProps {
  open: boolean;
  onClose: () => void;
  configuration: Configuration;
  onSuccess: () => void;
}

const EnhancedDeleteTrimDialog = ({
  open,
  onClose,
  configuration,
  onSuccess
}: EnhancedDeleteTrimDialogProps) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      const success = await deleteConfiguration(configuration.id);
      
      if (success) {
        toast({
          title: "Configuration Deleted",
          description: `"${configuration.name}" has been successfully deleted.`
        });
        onSuccess();
        onClose();
      } else {
        throw new Error("Delete operation failed");
      }
    } catch (error) {
      console.error("Error deleting configuration:", error);
      toast({
        variant: "destructive",
        title: "Delete Failed",
        description: "Failed to delete the configuration. Please try again."
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-explorer-card border-explorer-chrome/30 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-explorer-text flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-400" />
            Delete Trim Level
          </DialogTitle>
          <DialogDescription className="text-explorer-text-muted">
            This action cannot be undone. This will permanently delete the trim level configuration.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Configuration Details */}
          <div className="bg-explorer-dark/50 p-4 rounded-lg border border-explorer-chrome/30">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-explorer-text">
                  {configuration.name || 'Unnamed Configuration'}
                </span>
                {configuration.is_default && (
                  <Badge variant="secondary" className="text-xs">Default</Badge>
                )}
              </div>
              
              {configuration.msrp_usd && (
                <p className="text-sm text-explorer-text-muted">
                  MSRP: ${configuration.msrp_usd.toLocaleString()}
                </p>
              )}
              
              <p className="text-xs text-explorer-text-muted">
                ID: {configuration.id}
              </p>
            </div>
          </div>

          {/* Warning Alert */}
          <Alert className="border-red-400/30 bg-red-500/10">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-400">
              <strong>Warning:</strong> Deleting this trim level will permanently remove all associated 
              component assignments, dimensions, colors, and other configuration data.
            </AlertDescription>
          </Alert>

          {/* Additional Warning for Default Configuration */}
          {configuration.is_default && (
            <Alert className="border-orange-400/30 bg-orange-500/10">
              <AlertTriangle className="h-4 w-4 text-orange-400" />
              <AlertDescription className="text-orange-400">
                <strong>Note:</strong> This is the default trim level. You may want to set another 
                configuration as default before deleting this one.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-explorer-chrome/30 text-explorer-text"
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-500 text-white hover:bg-red-600"
          >
            {isDeleting ? "Deleting..." : "Delete Trim Level"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedDeleteTrimDialog;
