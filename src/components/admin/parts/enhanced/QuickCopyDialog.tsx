
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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Configuration } from "@/types/motorcycle";

interface QuickCopyDialogProps {
  open: boolean;
  onClose: () => void;
  targetConfiguration: Configuration;
  availableConfigurations: Configuration[];
  defaultCopyType: 'components' | 'dimensions' | 'colors' | 'all';
  onSuccess: () => void;
}

const QuickCopyDialog = ({
  open,
  onClose,
  targetConfiguration,
  availableConfigurations,
  defaultCopyType,
  onSuccess
}: QuickCopyDialogProps) => {
  const { toast } = useToast();
  const [copyType, setCopyType] = useState(defaultCopyType);
  const [sourceConfigId, setSourceConfigId] = useState<string>("");
  const [overwriteExisting, setOverwriteExisting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCopy = async () => {
    if (!sourceConfigId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a source configuration to copy from."
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate copy operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Copy Successful",
        description: `${copyType} data copied from source configuration.`
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Copy Failed",
        description: "Failed to copy configuration data. Please try again."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOverwriteChange = (checked: boolean | "indeterminate") => {
    setOverwriteExisting(checked === true);
  };

  const sourceConfigs = availableConfigurations.filter(config => config.id !== targetConfiguration.id);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-explorer-card border-explorer-chrome/30 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-explorer-text">Quick Copy Data</DialogTitle>
          <DialogDescription className="text-explorer-text-muted">
            Copy data from another configuration to "{targetConfiguration.name}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Source Configuration Selection */}
          <div className="space-y-2">
            <Label className="text-explorer-text">Copy From</Label>
            <Select value={sourceConfigId} onValueChange={setSourceConfigId}>
              <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text">
                <SelectValue placeholder="Select source configuration" />
              </SelectTrigger>
              <SelectContent className="bg-explorer-card border-explorer-chrome/30">
                {sourceConfigs.map((config) => (
                  <SelectItem key={config.id} value={config.id} className="text-explorer-text">
                    {config.name || 'Unnamed Configuration'}
                    {config.is_default && ' (Default)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Copy Type Selection */}
          <div className="space-y-3">
            <Label className="text-explorer-text">What to Copy</Label>
            <RadioGroup value={copyType} onValueChange={setCopyType as (value: string) => void}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="components" id="components" />
                <Label htmlFor="components" className="text-explorer-text">Components Only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dimensions" id="dimensions" />
                <Label htmlFor="dimensions" className="text-explorer-text">Dimensions Only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="colors" id="colors" />
                <Label htmlFor="colors" className="text-explorer-text">Colors Only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all" className="text-explorer-text">All Data</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Options */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="overwrite"
                checked={overwriteExisting}
                onCheckedChange={handleOverwriteChange}
              />
              <Label htmlFor="overwrite" className="text-explorer-text text-sm">
                Overwrite existing data
              </Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-explorer-chrome/30 text-explorer-text"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCopy}
            disabled={!sourceConfigId || isProcessing}
            className="bg-accent-teal text-black hover:bg-accent-teal/80"
          >
            {isProcessing ? "Copying..." : "Copy Data"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuickCopyDialog;
