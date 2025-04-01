
import { createClient } from '@supabase/supabase-js';

// Use the custom domain for authentication
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://svnockyhgohttzgbgydo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bm9ja3loZ29odHR6Z2JneWRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMDEwMTEsImV4cCI6MjA1Nzg3NzAxMX0.wJ4kM_H0HR-X1u5LQecSzgEq0UuebZaeYUaI_uS2ah4';
const customAuthDomain = 'https://auth.zeroagency.ai';

console.log('Initializing Supabase client with URL:', supabaseUrl);
console.log('Using custom auth domain:', customAuthDomain);

// Create a single instance of the Supabase client with custom domain for auth
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // Ensure sessions are persisted
    autoRefreshToken: true, // Auto refresh tokens
    storageKey: 'ad-manager-auth', // Custom storage key
    storage: localStorage, // Use localStorage (more persistent than sessionStorage)
    debug: import.meta.env.DEV, // Enable debug in development
    flowType: 'pkce', // Use PKCE flow for added security
  }
});

// For newer versions of Supabase, we need to update the global auth settings
// if we want to use a custom auth domain
if (customAuthDomain) {
  // Use a redirect callback instead of directly calling setSession with options
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session && window.location.href.includes(supabaseUrl)) {
      // Redirect to the custom auth domain
      window.location.href = window.location.href.replace(supabaseUrl, customAuthDomain);
    }
  });
}

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
