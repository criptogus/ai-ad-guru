
export type AdPlatform = 'google' | 'meta' | 'linkedin' | 'microsoft';

export interface Connection {
  id: string;
  platform: AdPlatform;
  accountId?: string;
  accountName?: string;
  expiresAt?: string;
  metadata?: Record<string, any>;
}

export interface OAuthParams {
  platform: AdPlatform;
  userId: string;
  redirectUri: string;
}

export interface AdConnectionsState {
  connections: Connection[];
  isLoading: boolean;
  isConnecting: boolean;
  connectingPlatform?: AdPlatform | null;
  error: string | null;
  errorDetails: string | null;
  errorType: string | null;
}

export interface AdConnectionsActions {
  fetchConnections: () => Promise<void>;
  initiateGoogleConnection: () => void;
  initiateMetaConnection: () => void;
  initiateLinkedInConnection: () => void;
  initiateMicrosoftConnection: () => void;
  removeConnection: (id: string, platformName: string) => Promise<void>;
}

export interface AdAccountInfo {
  id: string;
  name: string;
  currency?: string;
  timeZone?: string;
  status?: string;
}

export interface GoogleAdsAccount {
  id: string;
  resourceName: string;
  name?: string;
  status?: string;
}

export interface SecurityLogEntry {
  event: string;
  user_id: string;
  platform?: AdPlatform;
  timestamp: string;
  details?: Record<string, any>;
}

// Add new OAuth callback result types
export interface BaseOAuthCallbackResult {
  platform: AdPlatform;
  userId: string;
  success: boolean;
}

export interface GoogleOAuthCallbackResult extends BaseOAuthCallbackResult {
  platform: 'google';
  googleAdsAccess?: boolean;
}

export interface LinkedInOAuthCallbackResult extends BaseOAuthCallbackResult {
  platform: 'linkedin';
  linkedInAdsAccess?: boolean;
}

export interface MetaOAuthCallbackResult extends BaseOAuthCallbackResult {
  platform: 'meta';
  metaAdsAccess?: boolean;
}

export interface MicrosoftOAuthCallbackResult extends BaseOAuthCallbackResult {
  platform: 'microsoft';
  microsoftAdsAccess?: boolean;
}

export type OAuthCallbackResult = 
  | GoogleOAuthCallbackResult 
  | LinkedInOAuthCallbackResult 
  | MetaOAuthCallbackResult 
  | MicrosoftOAuthCallbackResult;
