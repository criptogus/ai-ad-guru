
/**
 * OAuth service - Main entry point
 * This file is a backwards-compatible wrapper around the new modular OAuth implementation
 */

import { OAuthParams, AdPlatform, OAuthCallbackResult } from "./types";
import { 
  initiateOAuth as initiateOAuthInternal,
  handleOAuthCallback as handleOAuthCallbackInternal,
  isOAuthCallback as isOAuthCallbackInternal,
  clearOAuthData as clearOAuthDataInternal
} from './oauth';

export const initiateOAuth = async (params: OAuthParams) => {
  return initiateOAuthInternal(params);
};

export const handleOAuthCallback = async (redirectUri: string): Promise<OAuthCallbackResult | null> => {
  return handleOAuthCallbackInternal(redirectUri);
};

export const isOAuthCallback = (): boolean => {
  return isOAuthCallbackInternal();
};

export const clearOAuthState = () => {
  return clearOAuthDataInternal();
};
