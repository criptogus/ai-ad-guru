
import { supabase } from "@/integrations/supabase/client";

/**
 * Service for cleaning up storage to free disk space
 */
export const storageCleanupService = {
  /**
   * Manually trigger storage cleanup on Supabase Edge Functions
   */
  triggerCleanup: async () => {
    try {
      console.log("Triggering storage cleanup...");
      const { data, error } = await supabase.functions.invoke('cleanup-storage', {
        body: { manual: true, aggressive: true }
      });
      
      if (error) {
        console.error("Storage cleanup error:", error);
        throw new Error(`Cleanup failed: ${error.message}`);
      }
      
      return data;
    } catch (error) {
      console.error("Failed to trigger storage cleanup:", error);
      throw error;
    }
  },
  
  /**
   * Clear temporary files from localStorage to free up space
   */
  clearTemporaryFiles: () => {
    try {
      // Clear any temporary files stored in localStorage
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('temp_') || key.includes('image_cache'))) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      console.log(`Cleared ${keysToRemove.length} temporary files from localStorage`);
      
      return keysToRemove.length;
    } catch (error) {
      console.error("Failed to clear temporary files:", error);
      return 0;
    }
  },
  
  /**
   * Clear IndexedDB storage used by the application
   */
  clearIndexedDBStorage: async () => {
    try {
      const databases = await window.indexedDB.databases();
      
      // Close and delete any databases that might be using space
      const deletionPromises = databases.map(db => {
        return new Promise((resolve, reject) => {
          if (!db.name) return resolve(false);
          
          const request = window.indexedDB.deleteDatabase(db.name);
          
          request.onsuccess = () => {
            console.log(`Successfully deleted database: ${db.name}`);
            resolve(true);
          };
          
          request.onerror = () => {
            console.error(`Failed to delete database: ${db.name}`);
            resolve(false);
          };
        });
      });
      
      const results = await Promise.all(deletionPromises);
      return results.filter(Boolean).length;
    } catch (error) {
      console.error("Failed to clear IndexedDB storage:", error);
      return 0;
    }
  },
  
  /**
   * Perform a full local cleanup to free up space
   */
  fullLocalCleanup: async () => {
    const tempFilesCleared = storageCleanupService.clearTemporaryFiles();
    const dbsCleared = await storageCleanupService.clearIndexedDBStorage();
    
    // Also clear application cache if available
    if ('caches' in window) {
      try {
        const cacheKeys = await window.caches.keys();
        await Promise.all(
          cacheKeys.map(cacheKey => window.caches.delete(cacheKey))
        );
        console.log(`Cleared ${cacheKeys.length} caches`);
      } catch (e) {
        console.error("Failed to clear caches:", e);
      }
    }
    
    return {
      tempFilesCleared,
      dbsCleared
    };
  }
};
