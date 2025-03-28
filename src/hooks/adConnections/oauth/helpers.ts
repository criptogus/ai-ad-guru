
import { OAuthParams } from "./types";
import { oauthStorage } from "./storage";

/**
 * Helper functions for OAuth operations
 */
export const oauthHelpers = {
  /**
   * Clean OAuth related URL parameters
   */
  cleanUrlParameters: (): void => {
    try {
      const url = new URL(window.location.href);
      const hasOAuthParams = url.searchParams.has('code') || url.searchParams.has('error');
      
      if (hasOAuthParams) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (historyError) {
      console.warn('Failed to clean URL:', historyError);
    }
  },

  /**
   * Check if current URL contains OAuth callback parameters
   */
  isOAuthCallback: (): boolean => {
    try {
      const url = new URL(window.location.href);
      const code = url.searchParams.get('code');
      
      // Check session storage for OAuth state
      return Boolean(code && oauthStorage.hasOAuthInProgress());
    } catch (error) {
      console.warn('Could not access URL or session storage:', error);
      return false;
    }
  },

  /**
   * Validate OAuth flow data
   */
  validateOAuthData: (data: any): boolean => {
    return (
      data && 
      typeof data === 'object' && 
      data.platform && 
      data.userId && 
      data.startTime
    );
  },

  /**
   * Check if OAuth flow has timed out
   */
  hasOAuthFlowTimedOut: (startTime: number): boolean => {
    // Consider timed out after 10 minutes
    return startTime && (Date.now() - startTime > 10 * 60 * 1000);
  },

  /**
   * Format platform name for display
   */
  formatPlatformName: (platform: string): string => {
    switch (platform) {
      case 'google': return 'Google';
      case 'meta': return 'Meta';
      case 'linkedin': return 'LinkedIn';
      case 'microsoft': return 'Microsoft';
      default: return platform;
    }
  },

  /**
   * Clear stored OAuth flow data (proxies to storage)
   */
  clearOAuthState: (): boolean => {
    return oauthStorage.clearOAuthState();
  }
};
