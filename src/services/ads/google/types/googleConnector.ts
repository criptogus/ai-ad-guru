
/**
 * Google Ads Connector Types
 */

export interface GoogleOAuthCredentials {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface GoogleConnectionStatus {
  connected: boolean;
  accountId?: string;
  accountName?: string;
  expiresAt?: number;
  adsAccessGranted?: boolean;
  error?: string;
}

export interface GoogleCredentialsTestResult {
  success: boolean;
  message: string;
}
