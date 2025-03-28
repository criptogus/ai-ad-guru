
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

// Store OAuth state in Supabase for validation during the callback
export const storeOAuthState = async (
  supabaseClient: any,
  stateId: string,
  stateData: any
) => {
  try {
    const { data, error } = await supabaseClient
      .from('oauth_states')
      .insert({
        id: stateId,
        user_id: stateData.userId,
        platform: stateData.platform,
        redirect_uri: stateData.redirectUri,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes expiry
      });
    
    if (error) {
      console.error('Error storing OAuth state:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in storeOAuthState:', error);
    throw error;
  }
};

// Validate the state parameter during the callback
export const validateOAuthState = async (
  supabaseClient: any,
  stateId: string
) => {
  try {
    const { data, error } = await supabaseClient
      .from('oauth_states')
      .select('*')
      .eq('id', stateId)
      .single();
    
    if (error || !data) {
      console.error('Error validating OAuth state or state not found:', error);
      return null;
    }
    
    // Check if the state has expired (10 minutes)
    const expiresAt = new Date(data.expires_at);
    if (expiresAt < new Date()) {
      console.error('OAuth state has expired');
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in validateOAuthState:', error);
    return null;
  }
};
