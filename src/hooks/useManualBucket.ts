
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { StorageFile } from '@/hooks/useStorageList';
import { parseFileName } from '@/utils/fileNameParser';
import { listManualFiles, organizeManualFiles, deleteManualFile } from '@/services/manuals/storage';

export interface ManualBucketHookResult {
  files: StorageFile[];
  isLoading: boolean;
  error: string | null;
  fetchManualFiles: () => Promise<void>;
  deleteFile: (fileName: string) => Promise<void>;
  organizeFiles: (options: { 
    sortBy?: 'name' | 'size' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    search?: string;
    limit?: number;
  }) => Promise<void>;
  parseFileDetails: (fileName: string) => {
    make: string;
    model: string;
    year: number | null;
    suggestedTags: string[];
  };
}

export function useManualBucket() {
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

  const organizeFiles = async (options: {
    sortBy?: 'name' | 'size' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    search?: string;
    limit?: number;
  }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Organizing files from manuals bucket with options:', options);
      const fileList = await organizeManualFiles(options);
      setFiles(fileList);
    } catch (err) {
      console.error('Error organizing manual files:', err);
      setError(err instanceof Error ? err.message : 'Failed to organize files');
      toast({
        title: "Error organizing files",
        description: "Could not retrieve organized files from manuals storage.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFile = async (fileName: string) => {
    try {
      console.log(`Deleting file ${fileName} from manuals bucket`);
      await deleteManualFile(fileName);
      
      // Update files list after deletion
      setFiles(files.filter(file => file.name !== fileName));
      
      toast({
        title: "File deleted",
        description: `${fileName} has been removed from storage.`
      });
    } catch (err) {
      console.error('Error deleting manual file:', err);
      toast({
        title: "Error deleting file",
        description: "Could not delete the file from storage.",
        variant: "destructive"
      });
    }
  };

  // Function to parse file details from filename with suggested tags
  const parseFileDetails = (fileName: string) => {
    return parseFileName(fileName);
  };

  return { 
    files, 
    isLoading, 
    error, 
    fetchManualFiles,
    organizeFiles,
    deleteFile,
    parseFileDetails 
  };
}
