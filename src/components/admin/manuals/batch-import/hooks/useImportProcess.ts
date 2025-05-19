
import { useState } from 'react';
import { toast } from 'sonner';
import { importManual } from '@/services/manuals';
import { ManualWithMotorcycle } from '@/services/manuals/types';
import { ImportItem } from '../types';

interface UseImportProcessProps {
  importItems: ImportItem[];
  updateItemStatus: (
    fileId: string, 
    status: 'pending' | 'processing' | 'success' | 'error', 
    updates?: Partial<ImportItem>
  ) => void;
  setIsProcessing: (isProcessing: boolean) => void;
}

export const useImportProcess = ({ 
  importItems, 
  updateItemStatus, 
  setIsProcessing 
}: UseImportProcessProps) => {
  
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
      updateItemStatus(item.id, 'processing');
      
      try {
        console.log(`Processing import for: ${item.name}, make: "${item.make}", model: "${item.model}", year: ${item.year}`);
        
        // Calculate file size in MB if available
        const fileSizeMB = item.size ? parseFloat((item.size / (1024 * 1024)).toFixed(2)) : undefined;
        
        // Generate a title from the filename
        const baseName = item.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        const title = `${item.manualType.charAt(0).toUpperCase() + item.manualType.slice(1)} Manual: ${baseName}`;
        
        console.log(`Importing manual with title: "${title}", make: ${item.make}, model: ${item.model}`);

        // Import the manual with make/model directly
        const importedManual = await importManual({
          file_name: item.name,
          file_url: item.url,
          title,
          manual_type: item.manualType,
          make: item.make,
          model: item.model,
          year: item.year || undefined,
          file_size_mb: fileSizeMB
        });
        
        console.log("Manual successfully imported:", importedManual);
        
        // Update status to success
        updateItemStatus(item.id, 'success', { importedManual });
        
        successfulImports.push(importedManual);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Error importing ${item.name}:`, error);
        
        // Update status to error
        updateItemStatus(item.id, 'error', { errorMessage });
        
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
  
  return { processImport };
};
