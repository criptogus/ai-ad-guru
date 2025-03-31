
// Google Ads Accounts Edge Function
// Lists accessible Google Ads accounts for a user using their stored access token
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import { corsHeaders } from './utils/cors.ts';

Deno.serve(async (req) => {
  // Handle preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Parse request
    const { userId } = await req.json();
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
      { auth: { persistSession: false } }
    );
    
    // Get user's Google Ads integration
    const { data: integration, error: integrationError } = await supabaseClient
      .from('user_integrations')
      .select('access_token, refresh_token, expires_at')
      .eq('user_id', userId)
      .eq('platform', 'google')
      .single();
    
    if (integrationError || !integration) {
      return new Response(
        JSON.stringify({ error: 'Google Ads integration not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }
    
    // Check if token is expired
    const now = new Date();
    const expiresAt = integration.expires_at ? new Date(integration.expires_at) : null;
    let accessToken = integration.access_token;
    
    if (expiresAt && now > expiresAt && integration.refresh_token) {
      // Refresh token
      const refreshed = await refreshGoogleToken(
        integration.refresh_token,
        Deno.env.get('GOOGLE_CLIENT_ID') || '',
        Deno.env.get('GOOGLE_CLIENT_SECRET') || ''
      );
      
      if (refreshed) {
        // Update token in database
        await supabaseClient
          .from('user_integrations')
          .update({
            access_token: refreshed.accessToken,
            expires_at: new Date(Date.now() + refreshed.expiresIn * 1000).toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .eq('platform', 'google');
        
        accessToken = refreshed.accessToken;
      }
    }
    
    // Get Google Ads developer token
    const developerToken = Deno.env.get('GOOGLE_DEVELOPER_TOKEN');
    if (!developerToken) {
      return new Response(
        JSON.stringify({ error: 'Google Ads developer token not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    // Call Google Ads API to list accessible customers
    const accounts = await listAccessibleGoogleAdsAccounts(accessToken, developerToken);
    
    // Return accounts list
    return new Response(
      JSON.stringify({ 
        success: true, 
        accounts: accounts.map(parseGoogleAdsAccountId)
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Error listing Google Ads accounts:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to list Google Ads accounts' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

// Parse Google Ads resource name to extract account ID
function parseGoogleAdsAccountId(resourceName: string) {
  // Format: customers/1234567890
  const match = resourceName.match(/customers\/(\d+)/);
  const id = match ? match[1] : resourceName;
  
  return {
    id,
    resourceName
  };
}

// List accessible Google Ads accounts
async function listAccessibleGoogleAdsAccounts(accessToken: string, developerToken: string) {
  const response = await fetch('https://googleads.googleapis.com/v15/customers:listAccessibleCustomers', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'developer-token': developerToken
    }
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Google Ads API error:', errorText);
    throw new Error(`Failed to list Google Ads accounts: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.resourceNames || [];
}

// Refresh expired Google access token
async function refreshGoogleToken(refreshToken: string, clientId: string, clientSecret: string) {
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      }).toString()
    });
    
    if (!response.ok) {
      console.error('Token refresh failed:', await response.text());
      return null;
    }
    
    const data = await response.json();
    return {
      accessToken: data.access_token,
      expiresIn: data.expires_in || 3600
    };
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}
