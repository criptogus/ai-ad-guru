
// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing environment variables for Supabase connection');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Parse the request data with defaults
    let { 
      days = 7,  // Reduced from 30 to 7 days to be more aggressive with cleanup
      bucket = 'ads-assets', 
      folder = 'temp',
      aggressive = false  // New parameter for more thorough cleanup
    } = await req.json();
    
    // Calculate the cutoff date
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoffTimestamp = cutoffDate.toISOString();
    
    console.log(`Cleaning up files in ${bucket}/${folder} older than ${cutoffTimestamp}`);
    
    // List all folders in the bucket if in aggressive mode
    let foldersToClean = [folder];
    
    if (aggressive) {
      // Add other temporary folders to clean
      foldersToClean = [...foldersToClean, 'uploads', 'drafts', 'cache'];
      console.log(`Aggressive mode: will clean ${foldersToClean.join(', ')} folders`);
    }
    
    let totalFilesRemoved = 0;
    let folderResults = [];
    
    // Process each folder
    for (const currentFolder of foldersToClean) {
      // List files in the specified folder
      const { data: files, error: listError } = await supabase
        .storage
        .from(bucket)
        .list(currentFolder);
      
      if (listError) {
        console.error(`Error listing files in ${currentFolder}:`, listError);
        folderResults.push({
          folder: currentFolder,
          status: 'error',
          error: listError.message
        });
        continue;
      }
      
      if (!files || files.length === 0) {
        console.log(`No files found in ${currentFolder}`);
        folderResults.push({
          folder: currentFolder,
          status: 'success',
          message: 'No files found to clean up',
          filesRemoved: 0
        });
        continue;
      }
      
      console.log(`Found ${files.length} files in ${currentFolder}`);
      
      // Filter files older than the cutoff date
      const oldFiles = files.filter(file => {
        if (!file.created_at) return false;
        return new Date(file.created_at) < cutoffDate;
      });
      
      if (oldFiles.length === 0) {
        console.log(`No old files found in ${currentFolder}`);
        folderResults.push({
          folder: currentFolder,
          status: 'success',
          message: 'No old files found to clean up',
          filesRemoved: 0
        });
        continue;
      }
      
      console.log(`Found ${oldFiles.length} old files to remove in ${currentFolder}`);
      
      // Remove old files
      const filesToRemove = oldFiles.map(file => `${currentFolder}/${file.name}`);
      const { error: removeError } = await supabase
        .storage
        .from(bucket)
        .remove(filesToRemove);
      
      if (removeError) {
        console.error(`Error removing files from ${currentFolder}:`, removeError);
        folderResults.push({
          folder: currentFolder,
          status: 'error',
          error: removeError.message
        });
        continue;
      }
      
      console.log(`Successfully removed ${filesToRemove.length} old files from ${currentFolder}`);
      folderResults.push({
        folder: currentFolder,
        status: 'success',
        message: `Successfully cleaned up ${filesToRemove.length} files`,
        filesRemoved: filesToRemove.length
      });
      
      totalFilesRemoved += filesToRemove.length;
    }
    
    // Optionally clean up old AI results from database to free up more space
    if (aggressive) {
      try {
        console.log("Cleaning up old AI results from database");
        const { error: dbCleanupError } = await supabase
          .from('ai_results')
          .delete()
          .lt('created_at', cutoffTimestamp);
        
        if (dbCleanupError) {
          console.error("Error cleaning up AI results:", dbCleanupError);
        } else {
          console.log("Successfully cleaned up old AI results");
        }
      } catch (dbError) {
        console.error("Error attempting database cleanup:", dbError);
      }
    }
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: `Successfully cleaned up ${totalFilesRemoved} total files across ${folderResults.length} folders`, 
      totalFilesRemoved,
      folderResults
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error cleaning up storage:', error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message || 'Unknown error occurred during storage cleanup'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
