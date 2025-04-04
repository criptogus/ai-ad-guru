
/**
 * OAuth storage utilities
 */

import { OAuthStorageData } from './types';
import { OAUTH_STORAGE_KEY } from './constants';

/**
 * Store OAuth flow information in sessionStorage
 */
export const storeOAuthData = (data: OAuthStorageData): boolean => {
  try {
    sessionStorage.setItem(OAUTH_STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (storageError) {
    console.warn('Could not store OAuth state in session storage:', storageError);
    return false;
  }
};

/**
 * Retrieve stored OAuth flow data
 */
export const getOAuthData = (): OAuthStorageData | null => {
  try {
    const storedData = sessionStorage.getItem(OAUTH_STORAGE_KEY);
    if (!storedData) return null;
    
    return JSON.parse(storedData);
  } catch (storageError) {
    console.warn('Failed to retrieve OAuth state from session storage:', storageError);
    return null;
  }
};

/**
 * Clear stored OAuth flow data
 */
export const clearOAuthData = (): boolean => {
  try {
    sessionStorage.removeItem(OAUTH_STORAGE_KEY);
    return true;
  } catch (storageError) {
    console.warn('Could not clear OAuth state from session storage:', storageError);
    return false;
  }
};
