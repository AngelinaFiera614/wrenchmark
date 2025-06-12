
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  Download, 
  Upload, 
  Copy, 
  Trash2, 
  Edit, 
  CheckCircle2,
  AlertCircle,
  X
} from "lucide-react";
import { Configuration } from "@/types/motorcycle";
import { useToast } from "@/hooks/use-toast";

interface BulkOperationsPanelProps {
  configurations: Configuration[];
  selectedConfigs: Set<string>;
  onSelectionChange: (selected: Set<string>) => void;
  onBulkOperation: (operation: string, configs: Configuration[]) => Promise<void>;
  isVisible: boolean;
  onClose: () => void;
}

const BulkOperationsPanel = ({
  configurations,
  selectedConfigs,
  onSelectionChange,
  onBulkOperation,
  isVisible,
  onClose
}: BulkOperationsPanelProps) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentOperation, setCurrentOperation] = useState<string>("");
  const [progress, setProgress] = useState(0);

  if (!isVisible) return null;

  const selectedConfigurations = configurations.filter(config => 
    selectedConfigs.has(config.id)
  );

  const handleSelectAll = () => {
    if (selectedConfigs.size === configurations.length) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(configurations.map(c => c.id)));
    }
  };

  const handleBulkOperation = async (operation: string) => {
    if (selectedConfigurations.length === 0) {
      toast({
        variant: "destructive",
        title: "No Selection",
        description: "Please select configurations to perform bulk operations."
      });
      return;
    }

    setIsProcessing(true);
    setCurrentOperation(operation);
    setProgress(0);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      await onBulkOperation(operation, selectedConfigurations);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setTimeout(() => {
        setIsProcessing(false);
        setCurrentOperation("");
        setProgress(0);
        onSelectionChange(new Set());
        
        toast({
          title: "Bulk Operation Complete",
          description: `Successfully ${operation}ed ${selectedConfigurations.length} configurations.`
        });
      }, 500);
      
    } catch (error) {
      setIsProcessing(false);
      setCurrentOperation("");
      setProgress(0);
      
      toast({
        variant: "destructive",
        title: "Bulk Operation Failed",
        description: `Failed to ${operation} configurations. Please try again.`
      });
    }
  };

  const operations = [
    {
      id: 'export',
      label: 'Export',
      icon: Download,
      description: 'Export selected configurations',
      variant: 'outline' as const
    },
    {
      id: 'duplicate',
      label: 'Duplicate',
      icon: Copy,
      description: 'Create copies of selected configurations',
      variant: 'outline' as const
    },
    {
      id: 'edit',
      label: 'Bulk Edit',
      icon: Edit,
      description: 'Edit multiple configurations at once',
      variant: 'outline' as const
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: Trash2,
      description: 'Delete selected configurations',
      variant: 'destructive' as const
    }
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="bg-explorer-card border-explorer-chrome/30 w-96 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-explorer-text text-sm">
              Bulk Operations
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Selection Summary */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedConfigs.size === configurations.length}
                onCheckedChange={handleSelectAll}
                className="border-explorer-chrome/30"
              />
              <span className="text-sm text-explorer-text">
                Select All
              </span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {selectedConfigs.size} / {configurations.length}
            </Badge>
          </div>

          {selectedConfigs.size > 0 && (
            <>
              <Separator className="bg-explorer-chrome/30" />
              
              {/* Selected Items */}
              <div className="max-h-32 overflow-y-auto space-y-1">
                {selectedConfigurations.map((config) => (
                  <div key={config.id} className="flex items-center gap-2 text-xs">
                    <CheckCircle2 className="h-3 w-3 text-green-400" />
                    <span className="text-explorer-text truncate">
                      {config.name || 'Unnamed Configuration'}
                    </span>
                    {config.is_default && (
                      <Badge variant="secondary" className="text-xs">Default</Badge>
                    )}
                  </div>
                ))}
              </div>

              <Separator className="bg-explorer-chrome/30" />

              {/* Progress Display */}
              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-blue-400" />
                    <span className="text-explorer-text">
                      {currentOperation.charAt(0).toUpperCase() + currentOperation.slice(1)}ing configurations...
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              {/* Operations */}
              {!isProcessing && (
                <div className="grid grid-cols-2 gap-2">
                  {operations.map((operation) => {
                    const Icon = operation.icon;
                    return (
                      <Button
                        key={operation.id}
                        variant={operation.variant}
                        size="sm"
                        onClick={() => handleBulkOperation(operation.id)}
                        className="text-xs h-8 flex items-center gap-1"
                        title={operation.description}
                      >
                        <Icon className="h-3 w-3" />
                        {operation.label}
                      </Button>
                    );
                  })}
                </div>
              )}

              {/* Warning for destructive operations */}
              {selectedConfigs.size > 0 && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-2">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5" />
                    <div className="text-xs text-yellow-400">
                      <p className="font-medium">Bulk operations cannot be undone</p>
                      <p className="text-yellow-400/80">
                        Please review your selection carefully before proceeding.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Keyboard Shortcuts Hint */}
          <div className="text-xs text-explorer-text-muted">
            <p><kbd className="bg-explorer-chrome/20 px-1 rounded">Ctrl+A</kbd> Select All</p>
            <p><kbd className="bg-explorer-chrome/20 px-1 rounded">Ctrl+Alt+E</kbd> Bulk Edit</p>
            <p><kbd className="bg-explorer-chrome/20 px-1 rounded">Ctrl+Alt+D</kbd> Bulk Delete</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkOperationsPanel;
