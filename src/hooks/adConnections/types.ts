
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
}

export interface AdConnectionsActions {
  fetchConnections: () => Promise<void>;
  initiateGoogleConnection: () => void;
  initiateMetaConnection: () => void;
  removeConnection: (id: string, platformName: string) => Promise<void>;
}

export type AdPlatform = 'google' | 'meta';

export interface OAuthParams {
  platform: AdPlatform;
  userId: string;
  redirectUri: string;
}
