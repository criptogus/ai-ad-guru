
/**
 * Media Storage Service
 * Handles storage and retrieval of media files
 */

import { errorLogger } from '@/services/libs/error-handling';
import { supabase } from '@/integrations/supabase/client';

export interface StorageParams {
  bucket: string;
  path: string;
  file: File;
  contentType?: string;
  metadata?: Record<string, string>;
}

export interface StoredFile {
  path: string;
  url: string;
  size: number;
  contentType: string;
  metadata?: Record<string, string>;
}

/**
 * Upload a file to storage
 */
export const uploadFile = async (params: StorageParams): Promise<StoredFile | null> => {
  try {
    // Generate a unique filename if needed
    const filename = params.path || `${Date.now()}_${params.file.name.replace(/\s+/g, '_')}`;
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(params.bucket)
      .upload(filename, params.file, {
        contentType: params.contentType || params.file.type,
        upsert: true,
        ...(params.metadata ? { metadata: params.metadata } : {})
      });
    
    if (error) {
      throw error;
    }
    
    if (!data) {
      throw new Error('Upload failed with no error');
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(params.bucket)
      .getPublicUrl(filename);
    
    return {
      path: data.path,
      url: publicUrl,
      size: params.file.size,
      contentType: params.contentType || params.file.type,
      metadata: params.metadata
    };
  } catch (error) {
    errorLogger.logError(error, 'uploadFile');
    return null;
  }
};

/**
 * Delete a file from storage
 */
export const deleteFile = async (bucket: string, path: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    errorLogger.logError(error, 'deleteFile');
    return false;
  }
};

/**
 * Get a public URL for a file
 */
export const getPublicUrl = (bucket: string, path: string): string => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
  
  return data.publicUrl;
};

/**
 * List files in a storage bucket
 */
export const listFiles = async (bucket: string, prefix?: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(prefix || '');
    
    if (error) {
      throw error;
    }
    
    if (!data) {
      return [];
    }
    
    return data.map(item => item.name);
  } catch (error) {
    errorLogger.logError(error, 'listFiles');
    return [];
  }
};
