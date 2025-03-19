
import { Session } from "@supabase/supabase-js";

export interface Connection {
  id: string;
  platform: string;
  account_id: string;
  created_at: string;
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
  initiateGoogleConnection: () => void;
  initiateLinkedInConnection: () => void;
  initiateMicrosoftConnection: () => void;
  removeConnection: (id: string, platformName: string) => Promise<void>;
}

export type AdPlatform = 'google' | 'linkedin' | 'microsoft';

export interface OAuthParams {
  platform: AdPlatform;
  userId: string;
  redirectUri: string;
}
