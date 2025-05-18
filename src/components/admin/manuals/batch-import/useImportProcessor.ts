
import { useState } from 'react';
import { toast } from 'sonner';
import { BucketFile } from '../ManualBucketBrowser';
import { useManualBucket } from '@/hooks/useManualBucket';
import { findMotorcycleByDetails, createPlaceholderMotorcycle } from '@/services/motorcycleService';
import { importManual } from '@/services/manuals';
import { ManualType } from '@/types';
import { ManualWithMotorcycle } from '@/services/manuals/types';
import { ImportItem, ImportProcessorResult } from './types';

export const useImportProcessor = (): ImportProcessorResult => {
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
      const lowerName = file.name.toLowerCase();
      
      if (lowerName.includes('service') || lowerName.includes('repair') || 
          lowerName.includes('workshop') || lowerName.includes('maintenance')) {
        manualType = 'service';
      } else if (lowerName.includes('wiring') || lowerName.includes('diagram') || 
               lowerName.includes('electric') || lowerName.includes('schematic')) {
        manualType = 'wiring';
      }
      
      console.log(`Prepared import item for ${file.name}: ${make} ${model} ${year}, type: ${manualType}`);
      
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

  const processImport = async (): Promise<ManualWithMotorcycle[]> => {
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
        console.log(`Processing import for: ${item.name}, make: "${item.make}", model: "${item.model}", year: ${item.year}`);
        
        // Check if motorcycle exists or create a placeholder
        console.log(`Looking up motorcycle: ${item.make} ${item.model} ${item.year || new Date().getFullYear()}`);
        let motorcycle = await findMotorcycleByDetails(item.make, item.model, item.year || new Date().getFullYear());

        if (!motorcycle) {
          console.log(`No motorcycle found, creating placeholder for: ${item.make} ${item.model} ${item.year || new Date().getFullYear()}`);
          // Create a placeholder motorcycle
          motorcycle = await createPlaceholderMotorcycle({
            make: item.make,
            model: item.model,
            year: item.year || new Date().getFullYear(),
          });
          console.log("Created placeholder motorcycle:", motorcycle);
        } else {
          console.log("Found existing motorcycle:", motorcycle);
        }

        // Calculate file size in MB if available
        const fileSizeMB = item.size ? parseFloat((item.size / (1024 * 1024)).toFixed(2)) : undefined;
        
        // Generate a title from the filename
        const baseName = item.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        const title = `${item.manualType.charAt(0).toUpperCase() + item.manualType.slice(1)} Manual: ${baseName}`;
        
        console.log(`Importing manual with title: "${title}", motorcycle_id: ${motorcycle.id}`);

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
        
        console.log("Manual successfully imported:", importedManual);
        
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
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Error importing ${item.name}:`, error);
        
        // Update status to error
        setImportItems(items => 
          items.map(i => 
            i.id === item.id 
              ? { 
                  ...i, 
                  status: 'error',
                  errorMessage
                } 
              : i
          )
        );
        
        toast.error(`Failed to import ${item.name}: ${errorMessage}`);
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
