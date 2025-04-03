
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.23.0';

export async function storeTokens(
  supabase: SupabaseClient,
  userId: string,
  platform: string,
  accessToken: string,
  refreshToken: string,
  accountId: string,
  expiresAt: string,
  metadata: Record<string, any> = {}
): Promise<boolean> {
  try {
    console.log(`Storing ${platform} tokens for user ${userId}`);
    
    // First check if this user already has a connection for this platform
    const { data: existingConnection } = await supabase
      .from('user_integrations')
      .select('id')
      .eq('user_id', userId)
      .eq('platform', platform)
      .maybeSingle();
      
    if (existingConnection) {
      // Update existing connection
      console.log(`Updating existing ${platform} connection for user ${userId}`);
      
      const { error: updateError } = await supabase
        .from('user_integrations')
        .update({
          access_token: accessToken,
          refresh_token: refreshToken,
          account_id: accountId,
          expires_at: expiresAt,
          metadata,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingConnection.id);
        
      if (updateError) {
        console.error(`Error updating ${platform} connection:`, updateError);
        return false;
      }
      
      console.log(`Successfully updated ${platform} connection`);
      return true;
    } else {
      // Create new connection
      console.log(`Creating new ${platform} connection for user ${userId}`);
      
      const { error: insertError } = await supabase
        .from('user_integrations')
        .insert({
          id: crypto.randomUUID(),
          user_id: userId,
          platform,
          access_token: accessToken,
          refresh_token: refreshToken,
          account_id: accountId,
          expires_at: expiresAt,
          metadata,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        
      if (insertError) {
        console.error(`Error creating ${platform} connection:`, insertError);
        return false;
      }
      
      console.log(`Successfully created ${platform} connection`);
      return true;
    }
  } catch (error) {
    console.error(`Error storing ${platform} tokens:`, error);
    return false;
  }
}
