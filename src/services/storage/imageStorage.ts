import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { storageCleanupService } from './storageCleanup';

/**
 * Uploads an image to Supabase storage
 * @param file - The file to upload
 * @param userId - The ID of the user uploading the file
 * @param folder - Optional subfolder within the user's directory (default: 'images')
 * @param isTemp - Whether this is a temporary file that can be cleaned up later (default: false)
 * @returns URL of the uploaded image or null if upload failed
 */
export const uploadImageToSupabase = async (
  file: File,
  userId: string,
  folder: string = 'images',
  isTemp: boolean = false
): Promise<string | null> => {
  try {
    if (!userId) {
      console.error('No user ID provided for upload');
      return null;
    }

    // Create a unique file path to avoid name collisions
    const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const fileExt = file.name.split('.').pop();
    const fileName = `${uniqueId}.${fileExt}`;
    
    // If temporary, use the temp folder
    const actualFolder = isTemp ? 'temp' : folder;
    const filePath = `${userId}/${actualFolder}/${fileName}`;

    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('ads-assets')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading file to Supabase:', error);
      return null;
    }

    // Get the public URL of the uploaded file
    const { data: publicUrlData } = await supabase.storage
      .from('ads-assets')
      .getPublicUrl(filePath);

    // If disk space is a concern, we can trigger cleanup of old files
    if (isTemp) {
      // Run a cleanup in the background for old temp files (older than 7 days)
      storageCleanupService.fullLocalCleanup().catch(error => {
        console.error('Background cleanup failed:', error);
      });
    }

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Unexpected error during file upload:', error);
    return null;
  }
};

/**
 * Hook for handling image uploads to Supabase
 */
export const useImageUpload = () => {
  const { user } = useAuth();

  const uploadImage = async (
    file: File, 
    folder: string = 'images',
    isTemp: boolean = false
  ): Promise<string | null> => {
    if (!user?.id) {
      toast.error("You must be logged in to upload images");
      return null;
    }
    
    const toastId = toast.loading("Uploading image...");
    
    try {
      const imageUrl = await uploadImageToSupabase(file, user.id, folder, isTemp);
      
      if (imageUrl) {
        toast.success("Image uploaded successfully", { id: toastId });
        return imageUrl;
      } else {
        toast.error("Failed to upload image", { id: toastId });
        return null;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Upload failed", { id: toastId });
      return null;
    }
  };
  
  /**
   * Cleans up temporary images to free up disk space
   */
  const cleanupTemporaryImages = async (days: number = 7): Promise<boolean> => {
    if (!user?.id) {
      toast.error("You must be logged in to clean up images");
      return false;
    }
    
    const toastId = toast.loading("Cleaning up temporary images...");
    
    try {
      const result = await storageCleanupService.triggerCleanup();
      
      if (result) {
        toast.success(`Temporary images cleaned up successfully`, { id: toastId });
        return true;
      } else {
        toast.error("Failed to clean up temporary images", { id: toastId });
        return false;
      }
    } catch (error) {
      console.error("Error cleaning up temporary images:", error);
      toast.error("Cleanup failed", { id: toastId });
      return false;
    }
  };

  return { 
    uploadImage,
    cleanupTemporaryImages
  };
};
