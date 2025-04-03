
export async function storeTokens(
  supabaseClient: any,
  userId: string,
  platform: string,
  accessToken: string,
  refreshToken: string | null,
  accountId: string,
  expiresAt: string,
  metadata: any = {}
) {
  try {
    const { error } = await supabaseClient
      .from('user_integrations')
      .upsert(
        {
          user_id: userId,
          platform,
          access_token: accessToken,
          refresh_token: refreshToken || null,
          account_id: accountId,
          expires_at: expiresAt,
          updated_at: new Date().toISOString(),
          metadata
        },
        { onConflict: 'user_id,platform' }
      );
      
    if (error) {
      console.error(`Error storing ${platform} tokens:`, error);
      throw new Error(`Failed to store tokens: ${error.message}`);
    }
    
    console.log(`Successfully stored ${platform} tokens for user ${userId}`);
    return true;
  } catch (err) {
    console.error(`Exception storing ${platform} tokens:`, err);
    throw err;
  }
}

export async function revokeTokens(
  supabaseClient: any,
  userId: string,
  platform: string
) {
  try {
    // Get the existing tokens first
    const { data, error: fetchError } = await supabaseClient
      .from('user_integrations')
      .select('access_token, refresh_token')
      .eq('user_id', userId)
      .eq('platform', platform)
      .single();
      
    if (fetchError && fetchError.code !== 'PGRST116') { // Not found error
      console.error(`Error fetching ${platform} tokens:`, fetchError);
      throw new Error(`Failed to fetch tokens: ${fetchError.message}`);
    }
    
    // If no tokens found, nothing to revoke
    if (!data) {
      console.log(`No ${platform} tokens found for user ${userId}`);
      return true;
    }
    
    // Platform-specific revocation logic would go here
    // ...
    
    // Delete tokens from database regardless of revocation result
    const { error: deleteError } = await supabaseClient
      .from('user_integrations')
      .delete()
      .eq('user_id', userId)
      .eq('platform', platform);
      
    if (deleteError) {
      console.error(`Error deleting ${platform} tokens:`, deleteError);
      throw new Error(`Failed to delete tokens: ${deleteError.message}`);
    }
    
    console.log(`Successfully deleted ${platform} tokens for user ${userId}`);
    return true;
  } catch (err) {
    console.error(`Exception revoking ${platform} tokens:`, err);
    throw err;
  }
}
