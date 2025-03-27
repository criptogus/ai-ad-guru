
import { supabase } from '@/integrations/supabase/client';

/**
 * Media Service API
 * This service encapsulates all media-related operations
 */
export const mediaApi = {
  /**
   * Generate an image using AI
   */
  generateImage: async (prompt: string, options: any = {}) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { prompt, options }
      });
      
      if (error) throw error;
      return data?.imageUrl;
    } catch (error) {
      console.error('Error generating image:', error);
      throw error;
    }
  },
  
  /**
   * Get user's generated images
   */
  getUserImages: async (userId: string) => {
    const { data, error } = await supabase
      .from('generated_images')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  },
  
  /**
   * Upload a file to storage
   */
  uploadFile: async (bucket: string, path: string, file: File) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      });
      
    if (error) throw error;
    
    // Get public URL for the file
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
      
    return urlData.publicUrl;
  },
  
  /**
   * Delete a file from storage
   */
  deleteFile: async (bucket: string, path: string) => {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
      
    if (error) throw error;
    return true;
  }
};
