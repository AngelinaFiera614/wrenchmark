
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

export interface StorageFile {
  name: string;
  id: string;
  url: string;
  size: number;
  createdAt: string;
}

export const useStorageList = (bucketName: string) => {
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchFiles = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get list of files in the bucket
      const { data: fileList, error: listError } = await supabase
        .storage
        .from(bucketName)
        .list();
        
      if (listError) {
        throw listError;
      }

      if (!fileList?.length) {
        setFiles([]);
        return;
      }

      // Only include files (not folders) and exclude .gitkeep if it exists
      const filteredFiles = fileList
        .filter(item => !item.id.endsWith('/') && item.name !== '.gitkeep')
        .map(item => {
          // Fixed: Properly destructure the returned object to get publicUrl
          const { data } = supabase.storage
            .from(bucketName)
            .getPublicUrl(item.name);
            
          return {
            name: item.name,
            id: item.id,
            url: data.publicUrl,
            size: item.metadata?.size || 0,
            createdAt: item.created_at || '',
          };
        });

      setFiles(filteredFiles);
    } catch (err) {
      console.error('Error fetching storage files:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch files');
      toast({
        variant: "destructive",
        title: "Error listing files",
        description: "Could not retrieve files from storage.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { files, isLoading, error, fetchFiles };
};
