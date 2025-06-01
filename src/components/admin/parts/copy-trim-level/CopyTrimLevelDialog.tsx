
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Configuration } from "@/types/motorcycle";
import { Copy, Calendar, CheckCircle, AlertCircle } from "lucide-react";
import { copyConfigurationToMultipleYears } from "@/services/models/configurationService";

interface ModelYear {
  id: string;
  year: number;
  motorcycle_id: string;
}

interface CopyTrimLevelDialogProps {
  open: boolean;
  onClose: () => void;
  sourceConfiguration: Configuration;
  availableYears: ModelYear[];
  onSuccess: () => void;
}

interface CopyOptions {
  copyComponents: boolean;
  copyDimensions: boolean;
  copyBasicInfo: boolean;
  adjustName: boolean;
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
  const [newName, setNewName] = useState(sourceConfiguration.name || "");
  const [copyOptions, setCopyOptions] = useState<CopyOptions>({
    copyComponents: true,
    copyDimensions: true,
    copyBasicInfo: true,
    adjustName: true
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
        title: "No Years Selected",
        description: "Please select at least one year to copy to.",
      });
      return;
    }

    setCopying(true);
    
    try {
      const results = await copyConfigurationToMultipleYears(
        sourceConfiguration.id,
        selectedYears,
        {
          newName: copyOptions.adjustName ? newName : sourceConfiguration.name || "",
          copyComponents: copyOptions.copyComponents,
          copyDimensions: copyOptions.copyDimensions,
          copyBasicInfo: copyOptions.copyBasicInfo
        }
      );

      const successCount = results.filter(r => r.success).length;
      const failureCount = results.length - successCount;

      if (successCount > 0) {
        toast({
          title: "Copy Successful!",
          description: `Copied trim level to ${successCount} year(s)${failureCount > 0 ? ` (${failureCount} failed)` : ''}`,
          action: <CheckCircle className="h-4 w-4 text-green-500" />
        });
        onSuccess();
        onClose();
      } else {
        throw new Error("All copy operations failed");
      }
    } catch (error: any) {
      console.error("Error copying trim level:", error);
      toast({
        variant: "destructive",
        title: "Copy Failed",
        description: error.message || "Failed to copy trim level to selected years.",
        action: <AlertCircle className="h-4 w-4 text-red-500" />
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
            Copy Trim Level: {sourceConfiguration.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Available Years */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Select Target Years</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto">
              {availableYears.map((year) => (
                <label
                  key={year.id}
                  className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-accent/50"
                >
                  <Checkbox
                    checked={selectedYears.includes(year.id)}
                    onCheckedChange={() => handleYearToggle(year.id)}
                  />
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{year.year}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Copy Options */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Copy Options</Label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <Checkbox
                  checked={copyOptions.copyBasicInfo}
                  onCheckedChange={(checked) => 
                    setCopyOptions(prev => ({ ...prev, copyBasicInfo: !!checked }))
                  }
                />
                <span>Basic Information (name, market region, etc.)</span>
              </label>
              <label className="flex items-center space-x-2">
                <Checkbox
                  checked={copyOptions.copyComponents}
                  onCheckedChange={(checked) => 
                    setCopyOptions(prev => ({ ...prev, copyComponents: !!checked }))
                  }
                />
                <span>Components (engine, brakes, suspension, etc.)</span>
              </label>
              <label className="flex items-center space-x-2">
                <Checkbox
                  checked={copyOptions.copyDimensions}
                  onCheckedChange={(checked) => 
                    setCopyOptions(prev => ({ ...prev, copyDimensions: !!checked }))
                  }
                />
                <span>Dimensions (weight, seat height, wheelbase, etc.)</span>
              </label>
              <label className="flex items-center space-x-2">
                <Checkbox
                  checked={copyOptions.adjustName}
                  onCheckedChange={(checked) => 
                    setCopyOptions(prev => ({ ...prev, adjustName: !!checked }))
                  }
                />
                <span>Customize name for copied trim levels</span>
              </label>
            </div>
          </div>

          {/* Name Customization */}
          {copyOptions.adjustName && (
            <div className="space-y-2">
              <Label htmlFor="newName">New Trim Level Name</Label>
              <Input
                id="newName"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter new name for copied trim levels"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose} disabled={copying}>
              Cancel
            </Button>
            <Button 
              onClick={handleCopy} 
              disabled={copying || selectedYears.length === 0}
              className="bg-accent-teal text-black hover:bg-accent-teal/80"
            >
              {copying ? "Copying..." : `Copy to ${selectedYears.length} Year(s)`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CopyTrimLevelDialog;
