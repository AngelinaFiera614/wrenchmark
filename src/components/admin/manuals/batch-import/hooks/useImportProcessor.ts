
import { useState } from 'react';
import { toast } from 'sonner';
import { useFileSelection } from './useFileSelection';
import { useImportItems } from './useImportItems';
import { useImportProcess } from './useImportProcess';
import { ImportProcessorResult } from '../types';

export const useImportProcessor = (): ImportProcessorResult => {
  const [step, setStep] = useState<'select' | 'confirm' | 'import'>('select');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { 
    selectedFiles, 
    handleSelectFiles, 
    handleSelectSingleFile, 
    validateFileSelection, 
    resetSelection 
  } = useFileSelection();
  
  const { 
    importItems, 
    prepareImportItems, 
    handleManualTypeChange, 
    updateItemStatus,
    resetItems 
  } = useImportItems();
  
  const { processImport } = useImportProcess({ 
    importItems, 
    updateItemStatus, 
    setIsProcessing 
  });

  const handlePrepareImport = () => {
    if (!validateFileSelection()) return;
    prepareImportItems(selectedFiles);
    setStep('confirm');
  };

  const handleStartImport = () => {
    setStep('import');
    processImport();
  };

  const resetImport = () => {
    setStep('select');
    resetSelection();
    resetItems();
  };

  return {
    selectedFiles,
    importItems,
    isProcessing,
    step,
    handleSelectFiles,
    handleSelectSingleFile,
    handlePrepareImport,
    handleManualTypeChange,
    handleStartImport,
    processImport,
    resetImport,
    setStep
  };
};
