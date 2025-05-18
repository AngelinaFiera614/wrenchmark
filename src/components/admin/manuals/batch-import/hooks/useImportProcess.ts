
import { useState } from 'react';
import { toast } from 'sonner';
import { findMotorcycleByDetails, createPlaceholderMotorcycle } from '@/services/motorcycleService';
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
