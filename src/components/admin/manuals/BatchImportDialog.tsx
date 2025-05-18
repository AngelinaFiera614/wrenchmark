
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Check, X, AlertCircle } from "lucide-react";
import { useManualBucket } from "@/hooks/useManualBucket";
import ManualBucketBrowser, { BucketFile } from "./ManualBucketBrowser";
import { findMotorcycleByDetails, createPlaceholderMotorcycle } from '@/services/motorcycleService';
import { importManual } from '@/services/manuals';
import { toast } from 'sonner';
import { ManualType } from '@/types';
import { ManualWithMotorcycle } from '@/services/manuals/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ImportItem extends BucketFile {
  status: "pending" | "processing" | "success" | "error";
  manualType: ManualType;
  make: string;
  model: string;
  year: number | null;
  errorMessage?: string;
  importedManual?: ManualWithMotorcycle;
}

interface BatchImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportSuccess: (manuals: ManualWithMotorcycle[]) => void;
}

const BatchImportDialog: React.FC<BatchImportDialogProps> = ({ 
  open, 
  onOpenChange,
  onImportSuccess
}) => {
  const [selectedFiles, setSelectedFiles] = useState<BucketFile[]>([]);
  const [importItems, setImportItems] = useState<ImportItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'select' | 'confirm' | 'import'>('select');
  const { parseFileDetails } = useManualBucket();

  const handleSelectFiles = (files: BucketFile[]) => {
    setSelectedFiles(files);
  };

  // Required by ManualBucketBrowser props, but not used when in multiSelect mode
  const handleSelectSingleFile = (file: BucketFile) => {
    // This function is required by the component props but we don't need it
    // when using multiSelect mode, as we're using onSelectMultiple instead
  };

  const handlePrepareImport = () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one file to import');
      return;
    }

    // Transform selected files to import items
    const items: ImportItem[] = selectedFiles.map(file => {
      const { make, model, year } = parseFileDetails(file.name);
      
      // Set default manual type based on filename
      let manualType: ManualType = 'owner';
      if (file.name.toLowerCase().includes('service')) {
        manualType = 'service';
      } else if (file.name.toLowerCase().includes('wiring')) {
        manualType = 'wiring';
      }
      
      return {
        ...file,
        status: 'pending',
        manualType,
        make,
        model,
        year,
      };
    });
    
    setImportItems(items);
    setStep('confirm');
  };

  const handleManualTypeChange = (fileId: string, manualType: ManualType) => {
    setImportItems(items => 
      items.map(item => 
        item.id === fileId 
          ? { ...item, manualType } 
          : item
      )
    );
  };

  const processImport = async () => {
    setIsProcessing(true);
    const successfulImports: ManualWithMotorcycle[] = [];
    
    for (const item of importItems) {
      // Skip already processed items
      if (item.status === 'success') {
        successfulImports.push(item.importedManual!);
        continue;
      }
      
      // Update status to processing
      setImportItems(items => 
        items.map(i => 
          i.id === item.id 
            ? { ...i, status: 'processing' } 
            : i
        )
      );
      
      try {
        // Check if motorcycle exists or create a placeholder
        let motorcycle = await findMotorcycleByDetails(item.make, item.model, item.year || new Date().getFullYear());

        if (!motorcycle) {
          // Create a placeholder motorcycle
          motorcycle = await createPlaceholderMotorcycle({
            make: item.make,
            model: item.model,
            year: item.year || new Date().getFullYear(),
          });
        }

        // Calculate file size in MB if available
        const fileSizeMB = item.size ? parseFloat((item.size / (1024 * 1024)).toFixed(2)) : undefined;
        
        // Generate a title from the filename
        const baseName = item.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        const title = `${item.manualType.charAt(0).toUpperCase() + item.manualType.slice(1)} Manual: ${baseName}`;

        // Import the manual
        const importedManual = await importManual({
          file_name: item.name,
          file_url: item.url,
          title,
          manual_type: item.manualType,
          motorcycle_id: motorcycle.id,
          year: item.year || undefined,
          file_size_mb: fileSizeMB
        });
        
        // Update status to success
        setImportItems(items => 
          items.map(i => 
            i.id === item.id 
              ? { ...i, status: 'success', importedManual } 
              : i
          )
        );
        
        successfulImports.push(importedManual);
      } catch (error) {
        console.error(`Error importing ${item.name}:`, error);
        
        // Update status to error
        setImportItems(items => 
          items.map(i => 
            i.id === item.id 
              ? { 
                  ...i, 
                  status: 'error',
                  errorMessage: error instanceof Error ? error.message : 'Unknown error'
                } 
              : i
          )
        );
      }
    }
    
    setIsProcessing(false);
    
    if (successfulImports.length > 0) {
      toast.success(`Successfully imported ${successfulImports.length} manuals`);
      onImportSuccess(successfulImports);
    }
  };

  const handleStartImport = () => {
    setStep('import');
    processImport();
  };

  const handleClose = () => {
    // Only allow closing if not processing
    if (!isProcessing) {
      setStep('select');
      setSelectedFiles([]);
      setImportItems([]);
      onOpenChange(false);
    }
  };

  const handleDone = () => {
    const successfulImports = importItems
      .filter(item => item.status === 'success')
      .map(item => item.importedManual!);
      
    onImportSuccess(successfulImports);
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="min-w-[800px] max-w-[800px]">
        <DialogHeader>
          <DialogTitle>
            {step === 'select' && "Select Files to Import"}
            {step === 'confirm' && "Confirm Import Details"}
            {step === 'import' && "Importing Manuals"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {step === 'select' && (
            <>
              <ManualBucketBrowser 
                onSelectMultiple={handleSelectFiles}
                onSelect={handleSelectSingleFile}
                multiSelect={true} 
              />
              
              <div className="flex justify-end mt-6">
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePrepareImport}
                  disabled={selectedFiles.length === 0}
                >
                  Continue ({selectedFiles.length} selected)
                </Button>
              </div>
            </>
          )}
          
          {step === 'confirm' && (
            <>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Review and confirm the details for each manual before importing. 
                  You can change the manual type if needed.
                </p>
              </div>
              
              <div className="border rounded-md">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium">File Name</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Make</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Model</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Year</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {importItems.map(item => (
                      <tr key={item.id} className="text-sm">
                        <td className="px-4 py-3 truncate max-w-[200px]">
                          {item.name}
                        </td>
                        <td className="px-4 py-3">{item.make}</td>
                        <td className="px-4 py-3">{item.model}</td>
                        <td className="px-4 py-3">{item.year}</td>
                        <td className="px-4 py-3">
                          <select
                            value={item.manualType}
                            onChange={(e) => handleManualTypeChange(
                              item.id, 
                              e.target.value as ManualType
                            )}
                            className="border rounded px-2 py-1 text-sm bg-background"
                          >
                            <option value="owner">Owner</option>
                            <option value="service">Service</option>
                            <option value="wiring">Wiring</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-end mt-6">
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => setStep('select')}
                >
                  Back
                </Button>
                <Button onClick={handleStartImport}>
                  Start Import
                </Button>
              </div>
            </>
          )}
          
          {step === 'import' && (
            <>
              <div className="border rounded-md">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium">File Name</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Make/Model</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Type</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {importItems.map(item => (
                      <tr key={item.id} className="text-sm">
                        <td className="px-4 py-3 truncate max-w-[200px]">
                          {item.name}
                        </td>
                        <td className="px-4 py-3">
                          {item.make} {item.model} {item.year}
                        </td>
                        <td className="px-4 py-3 capitalize">
                          {item.manualType}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            {item.status === 'pending' && (
                              <span className="text-muted-foreground">Pending</span>
                            )}
                            {item.status === 'processing' && (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2 text-accent-teal" />
                                <span>Processing</span>
                              </>
                            )}
                            {item.status === 'success' && (
                              <>
                                <Check className="h-4 w-4 mr-2 text-green-500" />
                                <span className="text-green-500">Success</span>
                              </>
                            )}
                            {item.status === 'error' && (
                              <>
                                <X className="h-4 w-4 mr-2 text-red-500" />
                                <span className="text-red-500">Error</span>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <AlertCircle className="h-4 w-4 ml-1 text-red-500 cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      {item.errorMessage || 'Unknown error'}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end mt-6">
                <Button 
                  onClick={handleDone} 
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Done'
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BatchImportDialog;
