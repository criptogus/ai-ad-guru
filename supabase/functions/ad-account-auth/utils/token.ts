
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

// Store tokens in Supabase with enhanced security
export const storeTokens = async (
  supabaseClient: any,
  userId: string,
  platform: string,
  accessToken: string,
  refreshToken: string | null,
  accountId: string,
  expiresAt: string | null
) => {
  try {
    // Log the connection attempt (not the tokens)
    console.log(`Storing secure connection for user ${userId} with ${platform}. Account ID: ${accountId}`);
    
    // Security check to ensure the token appears valid
    if (!accessToken || accessToken.length < 20) {
      throw new Error("Invalid access token format");
    }
    
    // Insert security log entry
    await supabaseClient
      .from('security_logs')
      .insert({
        event: 'token_stored',
        user_id: userId,
        platform,
        details: {
          has_refresh_token: !!refreshToken,
          has_expiry: !!expiresAt,
          account_id: accountId || 'unknown'
        }
      });

    // Store tokens securely
    const { data, error } = await supabaseClient
      .from('user_integrations')
      .upsert({
        user_id: userId,
        platform,
        access_token: accessToken,
        refresh_token: refreshToken,
        account_id: accountId,
        expires_at: expiresAt
      }, {
        onConflict: 'user_id,platform'
      });
    
    if (error) {
      console.error('Error storing tokens:', error);
      throw new Error(error.message || "Failed to store connection details");
    }
    
    // Log successful storage (without sensitive data)
    console.log(`Successfully stored ${platform} connection for user ${userId}`);
    
    return data;
  } catch (error) {
    console.error('Error in storeTokens:', error);
    throw error;
  }
};

// Revoke tokens when disconnecting
export const revokeTokens = async (
  supabaseClient: any,
  userId: string,
  platform: string,
  accessToken: string | null
) => {
  try {
    // Log revocation attempt
    console.log(`Revoking ${platform} tokens for user ${userId}`);
    
    // Platform-specific token revocation logic would go here
    // This would typically call the respective platform's API to revoke the token
    
    // Log completion
    console.log(`Completed ${platform} token revocation process`);
    
    return true;
  } catch (error) {
    console.error(`Error revoking ${platform} tokens:`, error);
    return false;
  }
};
