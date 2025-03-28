
export type AdPlatform = 'google' | 'meta' | 'linkedin' | 'microsoft';

export interface Connection {
  id: string;
  user_id: string;
  platform: AdPlatform;
  access_token?: string;
  refresh_token?: string;
  account_id?: string;
  expires_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AdConnectionsState {
  connections: Connection[];
  isLoading: boolean;
  isConnecting: boolean;
  error: string | null;
  errorDetails: string | null;
  errorType: string | null;
}

export interface AdConnectionsActions {
  fetchConnections: () => Promise<void>;
  initiateGoogleConnection: () => Promise<void>;
  initiateLinkedInConnection: () => Promise<void>;
  initiateMicrosoftConnection: () => Promise<void>;
  initiateMetaConnection: () => Promise<void>;
  removeConnection: (id: string, platformName: string) => Promise<void>;
}

export interface OAuthParams {
  platform: AdPlatform;
  userId: string | undefined;
  redirectUri: string;
}

export interface SecurityLogEntry {
  event: string;
  user_id: string | undefined;
  platform?: AdPlatform;
  timestamp: string;
  ip_address?: string;
  details?: Record<string, any>;
}
