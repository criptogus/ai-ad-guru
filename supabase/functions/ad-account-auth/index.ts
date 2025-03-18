
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { platform, code, redirectUri, userId } = await req.json();

    // We would implement the actual OAuth token exchange here
    // For now, this is a simplified implementation
    
    console.log(`Received auth request for platform: ${platform}, userId: ${userId}`);
    
    let accountId = "";
    let accessToken = "";
    let refreshToken = "";
    
    // Simulate token exchange and account data
    if (platform === 'google') {
      // In a real implementation, we would call the Google OAuth token endpoint
      accessToken = "google_simulated_access_token";
      refreshToken = "google_simulated_refresh_token";
      accountId = "1234567890"; // Simulated Google Ads account ID
    } else if (platform === 'meta') {
      // In a real implementation, we would call the Meta OAuth token endpoint
      accessToken = "meta_simulated_access_token";
      refreshToken = "";  // Meta might not provide refresh token
      accountId = "act_1234567890"; // Simulated Meta Ads account ID
    } else {
      throw new Error("Unsupported platform");
    }
    
    // Store the tokens in Supabase
    const { data, error } = await supabaseClient
      .from('user_integrations')
      .insert({
        user_id: userId,
        platform,
        access_token: accessToken,
        refresh_token: refreshToken,
        account_id: accountId
      });
    
    if (error) {
      throw error;
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully connected to ${platform} Ads`,
        accountId
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error(`Error processing request:`, error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
