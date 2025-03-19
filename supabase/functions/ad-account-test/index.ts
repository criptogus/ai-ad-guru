
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { platform } = await req.json();
    
    if (!platform) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Platform parameter is required' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Different test logic based on platform
    if (platform === 'linkedin') {
      return await testLinkedInConnection();
    } else if (platform === 'microsoft') {
      return await testMicrosoftConnection();
    } else if (platform === 'google') {
      return await testGoogleConnection();
    } else if (platform === 'meta') {
      return await testMetaConnection();
    } else {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `Unsupported platform: ${platform}` 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
  } catch (error) {
    console.error("Error in ad-account-test function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error.message || 'An unexpected error occurred' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function testLinkedInConnection() {
  const clientId = Deno.env.get('LINKEDIN_CLIENT_ID');
  const clientSecret = Deno.env.get('LINKEDIN_CLIENT_SECRET');
  
  // Verify credentials are configured
  if (!clientId || !clientSecret) {
    console.error('LinkedIn API credentials not configured');
    const missingCredentials = [];
    if (!clientId) missingCredentials.push('LINKEDIN_CLIENT_ID');
    if (!clientSecret) missingCredentials.push('LINKEDIN_CLIENT_SECRET');
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: `Missing LinkedIn API credentials: ${missingCredentials.join(', ')}` 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
  
  try {
    // Test connecting to the LinkedIn API
    // We'll make a request to the API to validate our credentials
    // Since we don't have a valid access token, we'll use the OAuth endpoint
    // to verify that our client ID and secret are valid
    
    const tokenUrl = 'https://www.linkedin.com/oauth/v2/accessToken';
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);
    
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString()
    });
    
    // Check response status
    if (response.ok) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'LinkedIn API credentials are valid' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    } else {
      const errorData = await response.text();
      console.error('LinkedIn API validation failed:', errorData);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `LinkedIn API credentials are invalid. Error: ${errorData}` 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
  } catch (error) {
    console.error('Error testing LinkedIn connection:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: `Error testing LinkedIn connection: ${error.message}` 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}

async function testMicrosoftConnection() {
  const clientId = Deno.env.get('MICROSOFT_CLIENT_ID');
  const clientSecret = Deno.env.get('MICROSOFT_CLIENT_SECRET');
  const developerToken = Deno.env.get('MICROSOFT_DEVELOPER_TOKEN');
  
  // Verify credentials are configured
  if (!clientId || !clientSecret || !developerToken) {
    console.error('Microsoft Ads API credentials not configured');
    const missingCredentials = [];
    if (!clientId) missingCredentials.push('MICROSOFT_CLIENT_ID');
    if (!clientSecret) missingCredentials.push('MICROSOFT_CLIENT_SECRET');
    if (!developerToken) missingCredentials.push('MICROSOFT_DEVELOPER_TOKEN');
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: `Missing Microsoft Ads API credentials: ${missingCredentials.join(', ')}` 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
  
  try {
    // Test the developer token by making a request to the Microsoft Ads API
    // We don't have an access token, so we'll just validate the developer token format
    
    // Microsoft developer tokens should be in a specific format
    const isValidDeveloperToken = /^[A-Za-z0-9]+$/.test(developerToken) && developerToken.length > 20;
    
    if (isValidDeveloperToken) {
      // Test OAuth endpoint
      const tokenUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';
      const params = new URLSearchParams();
      params.append('client_id', clientId);
      params.append('client_secret', clientSecret);
      params.append('scope', 'https://ads.microsoft.com/msads.manage offline_access');
      params.append('grant_type', 'client_credentials');
      
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString()
      });
      
      if (response.ok) {
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'Microsoft Ads API credentials are valid' 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      } else {
        const errorData = await response.text();
        console.error('Microsoft OAuth validation failed:', errorData);
        
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: `Microsoft Ads API client credentials are invalid. Error: ${errorData}` 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    } else {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Microsoft Ads Developer Token appears to be invalid' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
  } catch (error) {
    console.error('Error testing Microsoft Ads connection:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: `Error testing Microsoft Ads connection: ${error.message}` 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}

async function testGoogleConnection() {
  const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
  const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');
  const developerToken = Deno.env.get('GOOGLE_DEVELOPER_TOKEN');
  
  // Verify credentials are configured
  if (!clientId || !clientSecret || !developerToken) {
    console.error('Google Ads API credentials not configured');
    const missingCredentials = [];
    if (!clientId) missingCredentials.push('GOOGLE_CLIENT_ID');
    if (!clientSecret) missingCredentials.push('GOOGLE_CLIENT_SECRET');
    if (!developerToken) missingCredentials.push('GOOGLE_DEVELOPER_TOKEN');
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: `Missing Google Ads API credentials: ${missingCredentials.join(', ')}` 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
  
  try {
    // Test the OAuth flow by validating client credentials
    const tokenUrl = 'https://oauth2.googleapis.com/token';
    const params = new URLSearchParams();
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);
    params.append('grant_type', 'client_credentials');
    
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString()
    });
    
    // Google doesn't support client_credentials flow directly,
    // so we're just checking if the client ID and secret format are valid
    const isValidClientId = clientId.includes('.apps.googleusercontent.com');
    const isValidClientSecret = clientSecret.length > 10;
    const isValidDeveloperToken = developerToken.length > 10;
    
    if (isValidClientId && isValidClientSecret && isValidDeveloperToken) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Google Ads API credentials appear to be properly formatted' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    } else {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Google Ads API credentials appear to be invalid or improperly formatted' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
  } catch (error) {
    console.error('Error testing Google Ads connection:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: `Error testing Google Ads connection: ${error.message}` 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}

async function testMetaConnection() {
  const clientId = Deno.env.get('META_CLIENT_ID');
  const clientSecret = Deno.env.get('META_CLIENT_SECRET');
  
  // Verify credentials are configured
  if (!clientId || !clientSecret) {
    console.error('Meta Ads API credentials not configured');
    const missingCredentials = [];
    if (!clientId) missingCredentials.push('META_CLIENT_ID');
    if (!clientSecret) missingCredentials.push('META_CLIENT_SECRET');
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: `Missing Meta Ads API credentials: ${missingCredentials.join(', ')}` 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
  
  try {
    // Test the OAuth flow by validating client credentials
    const tokenUrl = 'https://graph.facebook.com/v19.0/oauth/access_token';
    const params = new URLSearchParams();
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);
    params.append('grant_type', 'client_credentials');
    
    const response = await fetch(tokenUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    });
    
    if (response.ok) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Meta Ads API credentials are valid' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    } else {
      const errorData = await response.text();
      console.error('Meta OAuth validation failed:', errorData);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `Meta Ads API credentials are invalid. Error: ${errorData}` 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
  } catch (error) {
    console.error('Error testing Meta Ads connection:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: `Error testing Meta Ads connection: ${error.message}` 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}
