
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Trash2, Info, Archive, Palette, Wrench } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Configuration } from "@/types/motorcycle";
import { deleteConfiguration } from "@/services/models/configurationService";
import { getTrimColorAssignments } from "@/services/colorManagementService";

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
  const [deleting, setDeleting] = useState(false);
  const [dependencies, setDependencies] = useState({
    colors: 0,
    components: 0,
    images: 0
  });

  useEffect(() => {
    if (open && configuration) {
      loadDependencies();
    }
  }, [open, configuration]);

  const loadDependencies = async () => {
    try {
      // Load color assignments
      const colors = await getTrimColorAssignments(configuration.id);
      
      // Count components
      const components = [
        configuration.engine,
        configuration.brakes,
        configuration.frame,
        configuration.suspension,
        configuration.wheels
      ].filter(Boolean).length;

      setDependencies({
        colors: colors.length,
        components,
        images: 0 // Could be enhanced to check for configuration-specific images
      });
    } catch (error) {
      console.error("Error loading dependencies:", error);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const success = await deleteConfiguration(configuration.id);
      
      if (success) {
        toast({
          title: "Success!",
          description: `Trim level "${configuration.name}" has been deleted successfully.`
        });
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      console.error("Error deleting trim level:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete trim level: ${error.message}`
      });
    } finally {
      setDeleting(false);
    }
  };

  const hasDependencies = dependencies.colors > 0 || dependencies.components > 0 || dependencies.images > 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete Trim Level
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Configuration Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{configuration.name}</CardTitle>
              <CardDescription>
                {configuration.description || "No description"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {configuration.is_default && (
                  <Badge variant="outline" className="text-accent-teal border-accent-teal">
                    Default
                  </Badge>
                )}
                {configuration.market_region && (
                  <Badge variant="outline">{configuration.market_region}</Badge>
                )}
                {configuration.trim_level && (
                  <Badge variant="outline">{configuration.trim_level}</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Dependencies Warning */}
          {hasDependencies && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-orange-800">
                  <Info className="h-5 w-5" />
                  Dependencies Found
                </CardTitle>
                <CardDescription className="text-orange-700">
                  This trim level has associated data that will also be deleted:
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {dependencies.colors > 0 && (
                  <div className="flex items-center gap-2 text-sm text-orange-800">
                    <Palette className="h-4 w-4" />
                    {dependencies.colors} color assignment{dependencies.colors !== 1 ? 's' : ''}
                  </div>
                )}
                {dependencies.components > 0 && (
                  <div className="flex items-center gap-2 text-sm text-orange-800">
                    <Wrench className="h-4 w-4" />
                    {dependencies.components} component assignment{dependencies.components !== 1 ? 's' : ''}
                  </div>
                )}
                {dependencies.images > 0 && (
                  <div className="flex items-center gap-2 text-sm text-orange-800">
                    <Archive className="h-4 w-4" />
                    {dependencies.images} image{dependencies.images !== 1 ? 's' : ''}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Confirmation */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-800">
                  This action cannot be undone
                </h4>
                <p className="text-sm text-red-700 mt-1">
                  The trim level "{configuration.name}" and all its associated data will be permanently deleted.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={deleting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1"
            >
              {deleting ? (
                <>Deleting...</>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Trim Level
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedDeleteTrimDialog;
