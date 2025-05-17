
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
      console.log(`Fetching files from bucket: ${bucketName}`);
      
      // Check if bucket exists
      const { data: buckets, error: bucketError } = await supabase
        .storage
        .listBuckets();
        
      if (bucketError) {
        console.error('Error checking buckets:', bucketError);
        throw bucketError;
      }
      
      const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
      
      if (!bucketExists) {
        console.error(`Bucket "${bucketName}" does not exist`);
        setFiles([]);
        setError(`Bucket "${bucketName}" does not exist`);
        return;
      }
      
      // Get list of files in the bucket
      const { data: fileList, error: listError } = await supabase
        .storage
        .from(bucketName)
        .list('', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' }
        });
        
      if (listError) {
        console.error('Error listing files:', listError);
        throw listError;
      }

      if (!fileList?.length) {
        console.log(`No files found in bucket: ${bucketName}`);
        setFiles([]);
        return;
      }

      console.log(`Found ${fileList.length} files in bucket: ${bucketName}`, fileList);

      // Only include files (not folders) and exclude .gitkeep if it exists
      const filteredFiles = await Promise.all(fileList
        .filter(item => !item.id.endsWith('/') && item.name !== '.gitkeep')
        .map(async item => {
          // Generate public URL
          const { data } = supabase.storage
            .from(bucketName)
            .getPublicUrl(item.name);

          console.log(`Generated URL for ${item.name}:`, data.publicUrl);
            
          return {
            name: item.name,
            id: item.id,
            url: data.publicUrl,
            size: item.metadata?.size || 0,
            createdAt: item.created_at || '',
          };
        }));

      setFiles(filteredFiles);
      console.log('Final files array:', filteredFiles);
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
