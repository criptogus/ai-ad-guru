
import { supabase } from '@/integrations/supabase/client';
import { Connection } from './types';

/**
 * Fetch user's ad platform connections
 */
export const fetchUserConnections = async (userId: string): Promise<Connection[]> => {
  try {
    // Fetch connections from user_integrations table
    const { data, error } = await supabase
      .from('user_integrations')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching connections:', error);
      throw new Error(`Failed to fetch connections: ${error.message}`);
    }

    return data as Connection[];
  } catch (error: any) {
    console.error('Error in fetchUserConnections:', error);
    throw error;
  }
};

/**
 * Remove a user's ad platform connection
 */
export const removeUserConnection = async (connectionId: string, userId: string): Promise<void> => {
  try {
    // First, get the connection details to identify platform
    const { data: connectionData, error: fetchError } = await supabase
      .from('user_integrations')
      .select('platform')
      .eq('id', connectionId)
      .eq('user_id', userId)
      .single();

    if (fetchError) {
      console.error('Error fetching connection details:', fetchError);
      throw new Error(`Connection not found or access denied: ${fetchError.message}`);
    }

    // Remove from database
    const { error } = await supabase
      .from('user_integrations')
      .delete()
      .eq('id', connectionId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error removing connection:', error);
      throw new Error(`Failed to remove connection: ${error.message}`);
    }

    // Call platform-specific edge function to revoke tokens if applicable
    if (connectionData?.platform) {
      try {
        await supabase.functions.invoke('ad-account-auth', {
          body: {
            action: 'revokeToken',
            platform: connectionData.platform,
            userId
          }
        });
      } catch (revokeError) {
        console.warn('Failed to revoke API token, but DB record was deleted:', revokeError);
        // We don't throw here since the DB record is already deleted
      }
    }
  } catch (error: any) {
    console.error('Error in removeUserConnection:', error);
    throw error;
  }
};
