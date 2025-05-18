import { supabase } from "@/integrations/supabase/client";
import { StorageFile } from "@/hooks/useStorageList";

/**
 * Lists files in the manuals bucket
 */
export const listManualFiles = async (): Promise<StorageFile[]> => {
  // Get list of files in the bucket
  const { data: fileList, error } = await supabase
    .storage
    .from('manuals')
    .list('', {
      limit: 100,
      sortBy: { column: 'name', order: 'asc' },
    });
    
  if (error) {
    console.error('Error listing files:', error);
    throw error;
  }

  if (!fileList?.length) {
    console.log('No files found in manuals bucket');
    return [];
  }

  // Only include files (not folders) and exclude .gitkeep if it exists
  const filteredFiles = await Promise.all(fileList
    .filter(item => !item.id.endsWith('/') && item.name !== '.gitkeep')
    .map(async item => {
      // Generate public URL
      const { data } = supabase.storage
        .from('manuals')
        .getPublicUrl(item.name);
        
      return {
        name: item.name,
        id: item.id,
        url: data.publicUrl,
        size: item.metadata?.size || 0,
        createdAt: item.created_at || '',
      };
    }));

  return filteredFiles;
};
