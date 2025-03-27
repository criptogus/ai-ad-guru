
import { supabase } from '@/integrations/supabase/client';
import { AuthError, User, Session } from '@supabase/supabase-js';

/**
 * Auth Service API
 * This service encapsulates all authentication-related operations
 */
export const authApi = {
  /**
   * Sign in with email and password
   */
  signInWithEmail: async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password });
  },

  /**
   * Sign up with email and password
   */
  signUpWithEmail: async (email: string, password: string, metadata?: object) => {
    return supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: metadata
      }
    });
  },

  /**
   * Sign out the current user
   */
  signOut: async () => {
    return supabase.auth.signOut();
  },

  /**
   * Get the current session
   */
  getSession: async () => {
    return supabase.auth.getSession();
  },

  /**
   * Get the current user
   */
  getCurrentUser: async () => {
    const { data } = await supabase.auth.getUser();
    return data?.user || null;
  },

  /**
   * Reset password
   */
  resetPassword: async (email: string) => {
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
  },

  /**
   * Update password
   */
  updatePassword: async (newPassword: string) => {
    return supabase.auth.updateUser({ password: newPassword });
  },

  /**
   * Setup auth state change listener
   */
  onAuthStateChange: (callback: (event: string, session: Session | null) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};
