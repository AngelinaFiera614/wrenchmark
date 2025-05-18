
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { StorageFile } from '@/hooks/useStorageList';
import { parseFileName } from '@/utils/fileNameParser';
import { listManualFiles } from '@/services/manuals/storage';

export interface ManualBucketHookResult {
  files: StorageFile[];
  isLoading: boolean;
  error: string | null;
  fetchManualFiles: () => Promise<void>;
  parseFileDetails: (fileName: string) => {
    make: string;
    model: string;
    year: number | null;
  };
}

export const useManualBucket = (): ManualBucketHookResult => {
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchManualFiles = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching files from manuals bucket');
      const fileList = await listManualFiles();
      setFiles(fileList);
    } catch (err) {
      console.error('Error fetching manual files:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch files');
      toast({
        title: "Error listing files",
        description: "Could not retrieve files from manuals storage.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Use the imported parseFileName function
  const parseFileDetails = parseFileName;

  return { 
    files, 
    isLoading, 
    error, 
    fetchManualFiles,
    parseFileDetails 
  };
};
