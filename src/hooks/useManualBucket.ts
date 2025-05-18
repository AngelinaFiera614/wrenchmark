import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { StorageFile } from '@/hooks/useStorageList';

export const useManualBucket = () => {
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchManualFiles = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching files from manuals bucket');
      
      // Get list of files in the bucket
      const { data: fileList, error: listError } = await supabase
        .storage
        .from('manuals')
        .list('', {
          limit: 100,
          sortBy: { column: 'name', order: 'asc' },
        });
        
      if (listError) {
        console.error('Error listing files:', listError);
        throw listError;
      }

      if (!fileList?.length) {
        console.log('No files found in manuals bucket');
        setFiles([]);
        setIsLoading(false);
        return;
      }

      console.log(`Found ${fileList.length} files in manuals bucket`);

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

      setFiles(filteredFiles);
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

  const parseFileDetails = (fileName: string) => {
    // Attempt to extract make, model, and year from filename
    // Format patterns: make-model-year.pdf, make_model_year.pdf, etc.
    
    // Remove .pdf or other extensions
    const baseName = fileName.replace(/\.[^/.]+$/, "");
    
    // Split by common separators
    const parts = baseName.split(/[-_\s]+/);
    
    // Simple extraction logic
    let make = '';
    let model = '';
    let year: number | null = null;
    
    if (parts.length >= 3) {
      // Try to find year (usually the last part or second-to-last part)
      for (let i = parts.length - 1; i >= 0; i--) {
        const yearCandidate = parseInt(parts[i], 10);
        if (!isNaN(yearCandidate) && yearCandidate > 1900 && yearCandidate <= new Date().getFullYear() + 1) {
          year = yearCandidate;
          parts.splice(i, 1); // Remove year from parts
          break;
        }
      }
      
      // First part is usually make
      make = parts[0] || '';
      
      // Rest is model
      model = parts.slice(1).join(' ');
    } else if (parts.length === 2) {
      make = parts[0] || '';
      
      // Check if second part is a year
      const yearCandidate = parseInt(parts[1], 10);
      if (!isNaN(yearCandidate) && yearCandidate > 1900 && yearCandidate <= new Date().getFullYear() + 1) {
        year = yearCandidate;
      } else {
        model = parts[1] || '';
      }
    } else if (parts.length === 1) {
      make = parts[0] || '';
    }

    // Capitalize make and model
    make = make.charAt(0).toUpperCase() + make.slice(1);
    model = model.charAt(0).toUpperCase() + model.slice(1);

    return {
      make,
      model,
      year
    };
  };

  return { 
    files, 
    isLoading, 
    error, 
    fetchManualFiles,
    parseFileDetails 
  };
};
