
import { corsHeaders } from '../utils/cors.ts';
import { exchangeToken as exchangeTokenUtil } from '../utils/token-exchange.ts';

/**
 * Exchange OAuth authorization code for access token
 */
export async function exchangeToken(supabaseClient: any, requestData: any) {
  const { code, state, platform, redirectUri } = requestData;
  
  try {
    // Validate required parameters
    if (!code) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Authorization code is required'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }
    
    if (!state) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'State parameter is required'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }
    
    // Verify the state parameter to prevent CSRF attacks
    const { data: stateData, error: stateError } = await supabaseClient
      .from('oauth_states')
      .select('user_id, platform')
      .eq('state', state)
      .single();
      
    if (stateError || !stateData) {
      console.error('Invalid or expired state parameter:', stateError);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Invalid or expired authorization state. Please try again.'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }
    
    // Get userId and platform from verified state
    const { user_id: userId, platform: statePlatform } = stateData;
    
    // Use either the provided platform or the one from state
    const effectivePlatform = platform || statePlatform;
    
    if (!effectivePlatform) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Platform identifier not found in request or state data'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }
    
    // Exchange the authorization code for tokens
    console.log(`Exchanging code for ${effectivePlatform} tokens with redirect URI:`, redirectUri);
    const tokenResponse = await exchangeTokenUtil(effectivePlatform, code, redirectUri);
    
    if (!tokenResponse) {
      throw new Error(`Failed to exchange token for ${effectivePlatform}`);
    }
    
    // For Google Ads, additionally verify API access with developer token if available
    let metadata = {};
    if (effectivePlatform === 'google') {
      const developerToken = Deno.env.get('GOOGLE_DEVELOPER_TOKEN');
      if (developerToken) {
        metadata.developerToken = 'configured';
        
        // Try to verify account access
        try {
          // This attempt helps verify that the token has proper Google Ads API scopes
          const response = await fetch('https://googleads.googleapis.com/v15/customers:listAccessibleCustomers', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${tokenResponse.accessToken}`,
              'developer-token': developerToken
            }
          });
          
          // If successful, save some account data
          if (response.ok) {
            const data = await response.json();
            if (data.resourceNames && data.resourceNames.length > 0) {
              // Parse account ID from the first resource name (format: customers/1234567890)
              const accountId = data.resourceNames[0].split('/')[1] || 'unknown';
              metadata.accountId = accountId;
              metadata.accountCount = data.resourceNames.length;
            }
          } else {
            const errorText = await response.text();
            console.warn('Could not verify Google Ads API access:', errorText);
            metadata.apiAccessError = 'Could not verify Google Ads API access';
          }
        } catch (apiError) {
          console.warn('Error verifying Google Ads API access:', apiError);
        }
      } else {
        console.warn('Google Ads developer token not configured');
        metadata.developerTokenWarning = 'Missing developer token';
      }
    }
    
    // Save user tokens in the database
    const { data: connectionData, error: connectionError } = await supabaseClient
      .from('user_integrations')
      .upsert(
        {
          user_id: userId,
          platform: effectivePlatform,
          access_token: tokenResponse.accessToken,
          refresh_token: tokenResponse.refreshToken || null,
          expires_at: tokenResponse.expiresIn 
            ? new Date(Date.now() + tokenResponse.expiresIn * 1000).toISOString() 
            : null,
          updated_at: new Date().toISOString(),
          metadata: metadata
        },
        { onConflict: 'user_id,platform', returning: 'minimal' }
      );
      
    if (connectionError) {
      console.error('Error saving connection:', connectionError);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: `Failed to save connection: ${connectionError.message}`
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }
    
    // Clean up the used state
    await supabaseClient
      .from('oauth_states')
      .delete()
      .eq('state', state);
      
    return new Response(
      JSON.stringify({ 
        success: true,
        platform: effectivePlatform
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
    
  } catch (error) {
    console.error('Token exchange error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: `Token exchange failed: ${error.message}`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
}
