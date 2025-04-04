
/**
 * OAuth utility functions
 */

import { getOAuthData } from './storage';

/**
 * Check if the current URL contains OAuth callback parameters
 */
export const isOAuthCallback = (): boolean => {
  const url = new URL(window.location.href);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  
  // More robust check - we need both code and state
  if (!code || !state) {
    return false;
  }
  
  // Check session storage for OAuth state
  const hasStoredOAuthState = Boolean(getOAuthData());
  
  return Boolean(code && state && hasStoredOAuthState);
};
