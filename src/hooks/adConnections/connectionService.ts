
import { supabase } from '@/integrations/supabase/client';
import { Connection } from './types';

/**
 * Fetch all ad platform connections for the user
 */
export const fetchUserConnections = async (userId: string): Promise<Connection[]> => {
  try {
    console.log('Fetching connections for user:', userId);
    
    const { data, error } = await supabase
      .from('user_integrations')
      .select('*')
      .eq('user_id', userId);
      
    if (error) {
      throw error;
    }
    
    console.log('Found connections:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('Error fetching user connections:', error);
    throw new Error('Failed to load connections');
  }
};

/**
 * Remove an ad platform connection for the user
 */
export const removeUserConnection = async (
  connectionId: string, 
  userId: string
): Promise<boolean> => {
  try {
    console.log(`Removing connection ${connectionId} for user ${userId}`);
    
    // Security check: verify the connection belongs to this user
    const { data: verifyData, error: verifyError } = await supabase
      .from('user_integrations')
      .select('id')
      .eq('id', connectionId)
      .eq('user_id', userId)
      .single();
      
    if (verifyError || !verifyData) {
      throw new Error('Connection not found or not authorized');
    }
    
    const { error } = await supabase
      .from('user_integrations')
      .delete()
      .eq('id', connectionId)
      .eq('user_id', userId);
      
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error removing user connection:', error);
    throw new Error('Failed to remove connection');
  }
};

/**
 * Test a specific connection for the user
 */
export const testConnection = async (
  platform: string,
  userId: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    const { data, error } = await supabase.functions.invoke('test-ad-connection', {
      body: { 
        platform,
        userId
      }
    });
    
    if (error) {
      throw error;
    }
    
    return {
      success: data.success,
      message: data.message
    };
  } catch (error: any) {
    console.error('Error testing connection:', error);
    return {
      success: false,
      message: error.message || 'Connection test failed'
    };
  }
};
