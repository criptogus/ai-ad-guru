
import { corsHeaders } from '../utils/cors.ts';
import { exchangeToken as exchangeTokenUtil } from '../utils/token-exchange.ts';

/**
 * Exchange OAuth authorization code for access token
 */
export async function exchangeToken(supabaseClient: any, requestData: any) {
  const { code, state, redirectUri } = requestData;
  
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
    
    const { user_id: userId, platform } = stateData;
    
    // Exchange the authorization code for tokens
    const tokenResponse = await exchangeTokenUtil(platform, code, redirectUri);
    
    if (!tokenResponse) {
      throw new Error(`Failed to exchange token for ${platform}`);
    }
    
    // Save user tokens in the database
    const { data: connectionData, error: connectionError } = await supabaseClient
      .from('user_integrations')
      .upsert(
        {
          user_id: userId,
          platform,
          access_token: tokenResponse.accessToken,
          refresh_token: tokenResponse.refreshToken || null,
          expires_at: tokenResponse.expiresIn 
            ? new Date(Date.now() + tokenResponse.expiresIn * 1000).toISOString() 
            : null,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'user_id,platform' }
      )
      .select('id');
    
    if (connectionError) {
      console.error('Failed to save connection:', connectionError);
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
        connectionId: connectionData?.[0]?.id,
        platform
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error(`Error exchanging token:`, error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: `Failed to exchange token: ${error.message}`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
}
