/**
 * OAuth service types
 */

import { AdPlatform } from '../types';

export interface OAuthParams {
  platform: AdPlatform;
  userId: string;
  redirectUri?: string;
  state?: string; // Added state parameter as optional
}

export interface OAuthStorageData {
  platform: AdPlatform;
  inProgress: boolean;
  userId: string;
  startTime: number;
  redirectUri: string;
  state: string;
}

export interface OAuthTokenExchangeResponse {
  success: boolean;
  platform?: AdPlatform;
  error?: string;
  authUrl?: string;
  url?: string;
  state?: string;
}

export interface TokenData {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}
