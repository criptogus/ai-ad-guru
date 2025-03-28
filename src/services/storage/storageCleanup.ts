
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Triggers the cleanup-storage Edge Function to free up disk space
 * @param options Cleanup options
 * @returns Success status and details about the cleanup operation
 */
export const triggerStorageCleanup = async (options: {
  days?: number;
  bucket?: string;
  folder?: string;
  aggressive?: boolean;
} = {}): Promise<{
  success: boolean;
  totalFilesRemoved?: number;
  message?: string;
  error?: string;
}> => {
  try {
    // Default options
    const cleanupOptions = {
      days: options.days || 7,
      bucket: options.bucket || 'ads-assets',
      folder: options.folder || 'temp',
      aggressive: options.aggressive || false
    };
    
    // Call the cleanup-storage Edge Function
    const { data, error } = await supabase.functions.invoke('cleanup-storage', {
      body: cleanupOptions
    });
    
    if (error) {
      console.error('Error triggering storage cleanup:', error);
      return {
        success: false,
        error: error.message || 'Unknown error occurred'
      };
    }
    
    return {
      success: data.success,
      totalFilesRemoved: data.totalFilesRemoved,
      message: data.message,
      error: data.error
    };
    
  } catch (error) {
    console.error('Unexpected error during storage cleanup:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Hook for managing storage cleanup operations
 */
export const useStorageCleanup = () => {
  const runCleanup = async (options: {
    days?: number;
    bucket?: string;
    folder?: string;
    aggressive?: boolean;
    showToast?: boolean;
  } = {}) => {
    const showToast = options.showToast !== false;
    
    if (showToast) {
      toast.loading('Cleaning up storage...');
    }
    
    try {
      const result = await triggerStorageCleanup({
        days: options.days,
        bucket: options.bucket,
        folder: options.folder,
        aggressive: options.aggressive
      });
      
      if (result.success) {
        if (showToast) {
          toast.success(result.message || `Successfully cleaned up ${result.totalFilesRemoved} files`);
        }
        return result;
      } else {
        if (showToast) {
          toast.error(result.error || 'Failed to clean up storage');
        }
        return result;
      }
    } catch (error) {
      if (showToast) {
        toast.error('Error during storage cleanup');
      }
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  };
  
  return {
    runCleanup
  };
};
