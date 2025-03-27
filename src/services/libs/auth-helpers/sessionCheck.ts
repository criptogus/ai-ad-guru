
import { supabase } from '@/integrations/supabase/client';

/**
 * Session check helper functions
 */
export const sessionHelpers = {
  /**
   * Check if a user is authenticated
   */
  isAuthenticated: async () => {
    const { data } = await supabase.auth.getSession();
    return !!data.session;
  },
  
  /**
   * Get the current user data
   */
  getCurrentUser: async () => {
    const { data } = await supabase.auth.getUser();
    return data?.user || null;
  },
  
  /**
   * Get the user's profile data
   */
  getUserProfile: async (userId: string) => {
    if (!userId) return null;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    return data;
  },
  
  /**
   * Get the complete user data with profile
   */
  getFullUserData: async () => {
    const { data: authData } = await supabase.auth.getUser();
    const user = authData?.user;
    
    if (!user) return null;
    
    const profile = await sessionHelpers.getUserProfile(user.id);
    
    return {
      ...user,
      ...profile,
    };
  }
};
