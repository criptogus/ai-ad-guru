
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
    
    // Parse the request data
    const { days = 30, bucket = 'ads-assets', folder = 'temp' } = await req.json();
    
    // Calculate the cutoff date
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoffTimestamp = cutoffDate.toISOString();
    
    console.log(`Cleaning up files in ${bucket}/${folder} older than ${cutoffTimestamp}`);
    
    // List files in the specified folder
    const { data: files, error: listError } = await supabase
      .storage
      .from(bucket)
      .list(folder);
    
    if (listError) {
      throw listError;
    }
    
    if (!files || files.length === 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'No files found to clean up', 
        filesRemoved: 0 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    console.log(`Found ${files.length} files in ${folder}`);
    
    // Filter files older than the cutoff date
    const oldFiles = files.filter(file => {
      if (!file.created_at) return false;
      return new Date(file.created_at) < cutoffDate;
    });
    
    if (oldFiles.length === 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'No old files found to clean up', 
        filesRemoved: 0 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    console.log(`Found ${oldFiles.length} old files to remove`);
    
    // Remove old files
    const filesToRemove = oldFiles.map(file => `${folder}/${file.name}`);
    const { error: removeError } = await supabase
      .storage
      .from(bucket)
      .remove(filesToRemove);
    
    if (removeError) {
      throw removeError;
    }
    
    console.log(`Successfully removed ${filesToRemove.length} old files`);
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: `Successfully cleaned up ${filesToRemove.length} files`, 
      filesRemoved: filesToRemove.length 
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
