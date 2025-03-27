
// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (error) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid request format"
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    const { action, platform, userId } = requestBody;
    console.log(`Processing ${action} for ${platform} account, user: ${userId}`);
    
    // Generate OAuth URL (mock)
    if (action === 'getAuthUrl') {
      return new Response(
        JSON.stringify({ 
          success: true, 
          url: `https://example.com/oauth/${platform}?user=${userId}`
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }
    
    // Exchange code for token (mock)
    if (action === 'exchangeToken') {
      return new Response(
        JSON.stringify({ 
          success: true, 
          accountId: 'mock-account-123',
          accountName: `${platform} Account`,
          accessToken: 'mock-token'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Invalid action specified: ${action}`
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error("Auth error:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Authentication process failed"
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
