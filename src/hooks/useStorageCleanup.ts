
import { useState } from 'react';
import { useToast } from './use-toast';
import { storageCleanupService } from '@/services/storage/storageCleanup';

interface CleanupResult {
  tempFilesCleared: number;
  dbsCleared: number;
  serverCleanupSuccess: boolean;
}

export const useStorageCleanup = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [lastResult, setLastResult] = useState<CleanupResult | null>(null);
  
  const runCleanup = async (showToast = true) => {
    if (isLoading) return;
    setIsLoading(true);
    
    try {
      // Step 1: Run local cleanup
      const localResults = await storageCleanupService.fullLocalCleanup();
      
      // Step 2: Try to run server-side cleanup
      let serverCleanupSuccess = false;
      try {
        await storageCleanupService.triggerCleanup();
        serverCleanupSuccess = true;
      } catch (err) {
        console.warn("Server cleanup failed, but local cleanup completed", err);
      }
      
      // Set the combined results
      const result = {
        ...localResults,
        serverCleanupSuccess
      };
      
      setLastResult(result);
      
      if (showToast) {
        toast({
          title: "Storage Cleanup Complete",
          description: `Cleared ${localResults.tempFilesCleared} temporary files and ${
            serverCleanupSuccess ? "freed server storage space" : "performed local cleanup"
          }`,
        });
      }
      
      return result;
    } catch (error) {
      console.error("Storage cleanup error:", error);
      
      if (showToast) {
        toast({
          title: "Cleanup Failed",
          description: error instanceof Error ? error.message : "Unknown error occurred",
          variant: "destructive"
        });
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Simple cleanup that doesn't show toasts - useful for background cleanups
  const silentCleanup = async () => {
    return runCleanup(false);
  };
  
  return {
    runCleanup,
    silentCleanup,
    isLoading,
    lastResult
  };
};

export default useStorageCleanup;
