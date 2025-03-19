
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

// Store tokens in Supabase
export const storeTokens = async (
  supabaseClient: any,
  userId: string,
  platform: string,
  accessToken: string,
  refreshToken: string | null,
  accountId: string,
  expiresAt: string | null
) => {
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
  
  return data;
};
