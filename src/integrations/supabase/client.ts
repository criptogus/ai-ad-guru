
import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and anon key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a single instance of the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // Ensure sessions are persisted
    autoRefreshToken: true, // Auto refresh tokens
    storageKey: 'ad-manager-auth', // Custom storage key
    storage: localStorage, // Use localStorage (more persistent than sessionStorage)
    debug: import.meta.env.DEV, // Enable debug in development
  }
});

// Additional helper to configure session expiration
export const configureSessionExpiration = async (expiresIn = 86400) => {
  // 86400 seconds = 24 hours
  try {
    // Get current session
    const { data } = await supabase.auth.getSession();
    if (data?.session) {
      // Store expiration time
      const expiresAt = Date.now() + expiresIn * 1000;
      localStorage.setItem('session_expires_at', expiresAt.toString());
      console.log(`Session configured to expire in ${expiresIn} seconds`);
    }
  } catch (error) {
    console.error('Error configuring session expiration:', error);
  }
};
