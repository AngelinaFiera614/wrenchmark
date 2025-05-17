
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/**
 * Uploads a file to a specified Supabase storage bucket
 */
export const uploadFileToStorage = async (
  file: File,
  bucketName: string,
  folderPath: string = '',
  maxSizeBytes: number
): Promise<{ publicUrl: string; error?: Error }> => {
  // Check file size
  if (file.size > maxSizeBytes) {
    return { 
      publicUrl: '',
      error: new Error(`File size exceeds the maximum limit of ${maxSizeBytes / (1024 * 1024)}MB`)
    };
  }

  try {
    // Generate unique file name with timestamp to prevent collisions
    const fileId = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '-')}`;
    const filePath = folderPath ? `${folderPath}/${fileId}` : fileId;
    
    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });
      
    if (error) throw error;

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);
    
    return { publicUrl };
  } catch (error) {
    console.error("Error uploading file:", error);
    return {
      publicUrl: '',
      error: error instanceof Error ? error : new Error('Unknown error occurred during upload')
    };
  }
};
