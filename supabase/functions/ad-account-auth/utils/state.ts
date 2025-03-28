
/**
 * Utilities for securely storing and validating OAuth state parameters
 */

export interface OAuthStateData {
  userId: string;
  platform: string;
  redirectUri: string;
  created: string;
}

/**
 * Store OAuth state in Supabase database
 */
export async function storeOAuthState(supabaseClient: any, stateParam: string, stateData: OAuthStateData) {
  // Calculate expiration (20 minutes from now)
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 20 * 60 * 1000);
  
  // Store state in database
  const { error } = await supabaseClient
    .from('oauth_states')
    .insert({
      id: stateParam,
      user_id: stateData.userId,
      platform: stateData.platform,
      redirect_uri: stateData.redirectUri,
      created_at: now.toISOString(),
      expires_at: expiresAt.toISOString()
    });
  
  if (error) {
    console.error('Error storing OAuth state:', error);
    throw new Error(`Failed to store OAuth state: ${error.message}`);
  }
}

/**
 * Validate OAuth state from callback
 */
export async function validateOAuthState(supabaseClient: any, stateParam: string): Promise<OAuthStateData> {
  // Get the state from database
  const { data, error } = await supabaseClient
    .from('oauth_states')
    .select('*')
    .eq('id', stateParam)
    .single();
  
  if (error || !data) {
    console.error('Error validating OAuth state:', error);
    throw new Error('Invalid or expired authorization state');
  }
  
  // Check if state has expired
  const expiresAt = new Date(data.expires_at);
  if (expiresAt < new Date()) {
    console.error('OAuth state has expired');
    throw new Error('Authorization state has expired');
  }
  
  // Remove the state from the database to prevent reuse
  await supabaseClient
    .from('oauth_states')
    .delete()
    .eq('id', stateParam);
  
  // Return the state data
  return {
    userId: data.user_id,
    platform: data.platform,
    redirectUri: data.redirect_uri,
    created: data.created_at
  };
}
