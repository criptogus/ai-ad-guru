
import { AdPlatform } from "../types";

export const OAUTH_STORAGE_KEY = 'adPlatformAuth';

export interface OAuthParams {
  platform: AdPlatform;
  userId: string | undefined;
  redirectUri: string;
}

export interface OAuthFlowData {
  platform: AdPlatform;
  inProgress: boolean;
  userId: string | undefined;
  startTime: number;
  redirectUri: string;
}

export interface OAuthCallbackResult {
  platform: AdPlatform;
  userId: string | undefined;
  success: boolean;
}

export interface OAuthErrorDetails {
  type: string;
  message: string;
  details?: string;
}
