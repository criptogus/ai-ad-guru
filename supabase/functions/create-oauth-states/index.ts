
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    // Create a Supabase client with the Auth context
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if table exists
    const { error: checkError, data: existingTable } = await supabase
      .from('oauth_states')
      .select('*', { count: 'exact', head: true });

    if (checkError && checkError.code !== 'PGRST204') {
      // If table doesn't exist, create it
      const { error: createError } = await supabase.rpc('create_oauth_states_table');

      if (createError) {
        console.error('Error creating table:', createError);
        throw new Error(`Failed to create oauth_states table: ${createError.message}`);
      }

      return new Response(
        JSON.stringify({ success: true, message: 'OAuth states table created successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If we get here, let's check the columns in the table
    const { data: columnsData, error: columnsError } = await supabase
      .rpc('get_table_columns', { table_name: 'oauth_states' });
      
    if (columnsError) {
      console.error('Error getting columns:', columnsError);
    } else {
      console.log('OAuth states table columns:', columnsData);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'OAuth states table already exists',
        columns: columnsData || []
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in create-oauth-states function:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
