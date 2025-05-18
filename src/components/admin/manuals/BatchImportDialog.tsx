
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useImportProcessor } from './batch-import/useImportProcessor';
import { BatchImportDialogProps } from './batch-import/types';
import SelectFilesStep from './batch-import/SelectFilesStep';
import ConfirmDetailsStep from './batch-import/ConfirmDetailsStep';
import ImportProgressStep from './batch-import/ImportProgressStep';

const BatchImportDialog: React.FC<BatchImportDialogProps> = ({ 
  open, 
  onOpenChange,
  onImportSuccess
}) => {
  const { 
    selectedFiles, 
    importItems, 
    isProcessing, 
    step, 
    handleSelectFiles,
    handleSelectSingleFile,
    handlePrepareImport,
    handleManualTypeChange,
    handleStartImport,
    resetImport,
  } = useImportProcessor();

  const handleClose = () => {
    // Only allow closing if not processing
    if (!isProcessing) {
      resetImport();
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
            <SelectFilesStep 
              selectedFiles={selectedFiles}
              onSelectFiles={handleSelectFiles}
              onSelectSingleFile={handleSelectSingleFile}
              onCancel={handleClose}
              onContinue={handlePrepareImport}
            />
          )}
          
          {step === 'confirm' && (
            <ConfirmDetailsStep
              importItems={importItems}
              onBack={() => resetImport()}
              onStartImport={handleStartImport}
              onManualTypeChange={handleManualTypeChange}
            />
          )}
          
          {step === 'import' && (
            <ImportProgressStep
              importItems={importItems}
              isProcessing={isProcessing}
              onDone={handleDone}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BatchImportDialog;
