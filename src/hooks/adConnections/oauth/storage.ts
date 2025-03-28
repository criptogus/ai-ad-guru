
import { OAuthFlowData } from "./types";
import { OAUTH_STORAGE_KEY } from "./types";

/**
 * Storage utilities for OAuth flow data
 */
export const oauthStorage = {
  /**
   * Store OAuth flow in progress data
   */
  storeOAuthState: (data: OAuthFlowData): boolean => {
    try {
      sessionStorage.setItem(OAUTH_STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (storageError) {
      console.warn('Could not store OAuth state in session storage:', storageError);
      return false;
    }
  },

  /**
   * Retrieve stored OAuth flow data
   */
  getOAuthState: (): OAuthFlowData | null => {
    try {
      const storedAuthData = sessionStorage.getItem(OAUTH_STORAGE_KEY);
      return storedAuthData ? JSON.parse(storedAuthData) : null;
    } catch (storageError) {
      console.error('Failed to retrieve OAuth state from session storage:', storageError);
      return null;
    }
  },

  /**
   * Clear stored OAuth flow data
   */
  clearOAuthState: (): boolean => {
    try {
      sessionStorage.removeItem(OAUTH_STORAGE_KEY);
      return true;
    } catch (error) {
      console.warn('Could not clear OAuth state:', error);
      return false;
    }
  },

  /**
   * Check if we're in the middle of an OAuth flow
   */
  hasOAuthInProgress: (): boolean => {
    try {
      return Boolean(sessionStorage.getItem(OAUTH_STORAGE_KEY));
    } catch (error) {
      return false;
    }
  }
};
