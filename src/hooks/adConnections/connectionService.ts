
import { supabase } from '@/integrations/supabase/client';
import { Connection } from './types';

/**
 * Fetch all ad platform connections for a user
 */
export const fetchUserConnections = async (userId: string): Promise<Connection[]> => {
  try {
    const { data, error } = await supabase
      .from('user_integrations')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    // Transform database results into Connection objects
    return (data || []).map(connection => ({
      id: connection.id,
      platform: connection.platform,
      accountId: connection.account_id || undefined,
      accountName: connection.metadata?.accountName || undefined,
      expiresAt: connection.expires_at || undefined,
      metadata: connection.metadata || {},
    }));
  } catch (error) {
    console.error('Error fetching user connections:', error);
    throw new Error('Failed to fetch ad platform connections');
  }
};

/**
 * Remove a user's connection to an ad platform
 */
export const removeUserConnection = async (connectionId: string, userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_integrations')
      .delete()
      .eq('id', connectionId)
      .eq('user_id', userId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error removing connection:', error);
    throw new Error('Failed to remove connection');
  }
};

/**
 * Get LinkedIn Ads account information
 */
export const getLinkedInAdAccountDetails = async (accessToken: string) => {
  try {
    // First get the organizations the user has access to
    const orgResponse = await fetch('https://api.linkedin.com/v2/organizationAcls?q=roleAssignee', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0',
        'Content-Type': 'application/json'
      }
    });
    
    if (!orgResponse.ok) {
      throw new Error(`LinkedIn Organizations API error: ${orgResponse.status}`);
    }
    
    const orgData = await orgResponse.json();
    
    // Then get the ad accounts
    const adAccountsResponse = await fetch('https://api.linkedin.com/v2/adAccountsV2?q=search', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0',
        'Content-Type': 'application/json'
      }
    });
    
    if (!adAccountsResponse.ok) {
      throw new Error(`LinkedIn Ad Accounts API error: ${adAccountsResponse.status}`);
    }
    
    const adAccountsData = await adAccountsResponse.json();
    
    return {
      organizations: orgData.elements || [],
      adAccounts: adAccountsData.elements || []
    };
  } catch (error) {
    console.error('Error fetching LinkedIn account details:', error);
    throw error;
  }
};
