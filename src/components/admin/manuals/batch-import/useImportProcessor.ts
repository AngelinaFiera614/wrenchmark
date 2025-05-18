import { useState } from 'react';
import { toast } from 'sonner';
import { BucketFile } from '../ManualBucketBrowser';
import { useManualBucket } from '@/hooks/useManualBucket';
import { findMotorcycleByDetails, createPlaceholderMotorcycle } from '@/services/motorcycleService';
import { importManual } from '@/services/manuals';
import { ManualType } from '@/types';
import { ManualWithMotorcycle } from '@/services/manuals/types';
import { ImportItem } from '../shared/types';

export const useImportProcessor = () => {
  const [selectedFiles, setSelectedFiles] = useState<BucketFile[]>([]);
  const [importItems, setImportItems] = useState<ImportItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'select' | 'confirm' | 'import'>('select');
  const { parseFileDetails } = useManualBucket();

  const handleSelectFiles = (files: BucketFile[]) => {
    setSelectedFiles(files);
  };

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
      return successfulImports;
    }
    
    return [];
  };

  const handleStartImport = () => {
    setStep('import');
    processImport();
  };

  const resetImport = () => {
    setStep('select');
    setSelectedFiles([]);
    setImportItems([]);
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
