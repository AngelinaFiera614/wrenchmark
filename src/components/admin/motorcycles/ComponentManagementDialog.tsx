
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Cog, 
  Disc, 
  Box, 
  Waves, 
  Circle,
  Plus,
  Settings
} from "lucide-react";
import SimpleComponentsManager from "@/components/admin/parts/enhanced/SimpleComponentsManager";

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Component Management
            {selectedModel && (
              <Badge variant="outline" className="ml-2">
                {selectedModel.name}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {selectedModel ? (
            <SimpleComponentsManager
              selectedModel={selectedModel}
              selectedConfiguration={selectedConfiguration}
              onComponentLinked={onComponentLinked}
              showManagementView={true}
            />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-medium mb-2">No Model Selected</h3>
              <p>Please select a motorcycle model to manage its components.</p>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComponentManagementDialog;
