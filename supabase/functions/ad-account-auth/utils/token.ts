
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

export async function storeTokens(
  supabase: SupabaseClient,
  userId: string,
  platform: string,
  accessToken: string,
  refreshToken: string,
  accountId: string,
  expiresAt: string,
  metadata: any = {}
): Promise<boolean> {
  try {
    console.log(`Storing ${platform} tokens for user ${userId}`);
    
    // Check if integration already exists
    const { data: existingIntegration, error: fetchError } = await supabase
      .from('user_integrations')
      .select('id')
      .eq('user_id', userId)
      .eq('platform', platform)
      .maybeSingle();
      
    if (fetchError) {
      console.error('Error checking for existing integration:', fetchError);
      throw new Error(`Failed to check for existing integration: ${fetchError.message}`);
    }
    
    // Update or insert based on whether integration already exists
    if (existingIntegration) {
      const { error: updateError } = await supabase
        .from('user_integrations')
        .update({
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_at: expiresAt,
          account_id: accountId,
          updated_at: new Date().toISOString(),
          metadata
        })
        .eq('id', existingIntegration.id);
        
      if (updateError) {
        console.error(`Error updating ${platform} integration:`, updateError);
        throw new Error(`Failed to update ${platform} integration: ${updateError.message}`);
      }
    } else {
      const { error: insertError } = await supabase
        .from('user_integrations')
        .insert({
          user_id: userId,
          platform,
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_at: expiresAt,
          account_id: accountId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          metadata
        });
        
      if (insertError) {
        console.error(`Error inserting ${platform} integration:`, insertError);
        throw new Error(`Failed to create ${platform} integration: ${insertError.message}`);
      }
    }
    
    console.log(`Successfully stored ${platform} tokens`);
    return true;
  } catch (error) {
    console.error('Error storing tokens:', error);
    throw error;
  }
}

export async function revokeTokens(
  supabase: SupabaseClient,
  userId: string,
  platform: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_integrations')
      .delete()
      .eq('user_id', userId)
      .eq('platform', platform);
      
    if (error) {
      console.error(`Error revoking ${platform} tokens:`, error);
      throw new Error(`Failed to revoke ${platform} access: ${error.message}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error revoking tokens:', error);
    throw error;
  }
}
