
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Configuration } from "@/types/motorcycle";
import { copyConfigurationToMultipleYears } from "@/services/models/configurationService";

interface CopyTrimLevelDialogProps {
  open: boolean;
  onClose: () => void;
  sourceConfiguration: Configuration;
  availableYears: any[];
  onSuccess: () => void;
}

const CopyTrimLevelDialog = ({
  open,
  onClose,
  sourceConfiguration,
  availableYears,
  onSuccess
}: CopyTrimLevelDialogProps) => {
  const { toast } = useToast();
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [copying, setCopying] = useState(false);
  const [copyOptions, setCopyOptions] = useState({
    copyComponents: true,
    copyDimensions: true,
    copyBasicInfo: true
  });

  const handleYearToggle = (yearId: string) => {
    setSelectedYears(prev => 
      prev.includes(yearId) 
        ? prev.filter(id => id !== yearId)
        : [...prev, yearId]
    );
  };

  const handleCopy = async () => {
    if (selectedYears.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select at least one year to copy to."
      });
      return;
    }

    setCopying(true);
    try {
      const results = await copyConfigurationToMultipleYears(
        sourceConfiguration.id,
        selectedYears,
        copyOptions
      );

      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;

      if (successful > 0) {
        toast({
          title: "Success!",
          description: `Copied trim level to ${successful} year${successful > 1 ? 's' : ''}${failed > 0 ? `, ${failed} failed` : ''}.`
        });
        onSuccess();
        onClose();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to copy trim level to any years."
        });
      }
    } catch (error: any) {
      console.error("Error copying trim level:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to copy trim level: ${error.message}`
      });
    } finally {
      setCopying(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Copy className="h-5 w-5" />
            Copy "{sourceConfiguration.name}" to Other Years
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Copy Options */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">What to copy:</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="copyBasicInfo"
                  checked={copyOptions.copyBasicInfo}
                  onCheckedChange={(checked) => 
                    setCopyOptions(prev => ({ ...prev, copyBasicInfo: !!checked }))
                  }
                />
                <Label htmlFor="copyBasicInfo">Basic Info (name, market region, price)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="copyComponents"
                  checked={copyOptions.copyComponents}
                  onCheckedChange={(checked) => 
                    setCopyOptions(prev => ({ ...prev, copyComponents: !!checked }))
                  }
                />
                <Label htmlFor="copyComponents">Components (engine, brakes, frame, etc.)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="copyDimensions"
                  checked={copyOptions.copyDimensions}
                  onCheckedChange={(checked) => 
                    setCopyOptions(prev => ({ ...prev, copyDimensions: !!checked }))
                  }
                />
                <Label htmlFor="copyDimensions">Dimensions (weight, height, etc.)</Label>
              </div>
            </div>
          </div>

          {/* Available Years */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Copy to years:</Label>
            {availableYears.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No other years available for this motorcycle.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                {availableYears.map((year) => (
                  <div
                    key={year.id}
                    className="flex items-center space-x-2 p-2 border rounded hover:bg-muted cursor-pointer"
                    onClick={() => handleYearToggle(year.id)}
                  >
                    <Checkbox
                      checked={selectedYears.includes(year.id)}
                      onChange={() => handleYearToggle(year.id)}
                    />
                    <Label className="cursor-pointer flex-1">
                      {year.year}
                      {year.marketing_tagline && (
                        <span className="text-xs text-muted-foreground block">
                          {year.marketing_tagline}
                        </span>
                      )}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Years Summary */}
          {selectedYears.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Selected years:</Label>
              <div className="flex flex-wrap gap-1">
                {selectedYears.map((yearId) => {
                  const year = availableYears.find(y => y.id === yearId);
                  return (
                    <Badge key={yearId} variant="secondary" className="text-xs">
                      {year?.year}
                      <button
                        onClick={() => handleYearToggle(yearId)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose} disabled={copying}>
              Cancel
            </Button>
            <Button
              onClick={handleCopy}
              disabled={copying || selectedYears.length === 0}
              className="bg-accent-teal text-black hover:bg-accent-teal/80"
            >
              {copying ? (
                <>Copying...</>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy to {selectedYears.length} Year{selectedYears.length !== 1 ? 's' : ''}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CopyTrimLevelDialog;
