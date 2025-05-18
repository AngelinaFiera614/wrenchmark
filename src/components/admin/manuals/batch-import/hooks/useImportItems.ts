
import { useState } from 'react';
import { BucketFile } from '../../ManualBucketBrowser';
import { useManualBucket } from '@/hooks/useManualBucket';
import { ImportItem } from '../types';
import { ManualType } from '@/types';

export const useImportItems = () => {
  const [importItems, setImportItems] = useState<ImportItem[]>([]);
  const { parseFileDetails } = useManualBucket();
  
  const prepareImportItems = (selectedFiles: BucketFile[]): ImportItem[] => {
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
    return items;
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
  
  const updateItemStatus = (
    fileId: string, 
    status: 'pending' | 'processing' | 'success' | 'error', 
    updates: Partial<ImportItem> = {}
  ) => {
    setImportItems(items => 
      items.map(i => 
        i.id === fileId 
          ? { ...i, status, ...updates } 
          : i
      )
    );
  };
  
  const resetItems = () => {
    setImportItems([]);
  };
  
  return {
    importItems,
    prepareImportItems,
    handleManualTypeChange,
    updateItemStatus,
    setImportItems,
    resetItems
  };
};
