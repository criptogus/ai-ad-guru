
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";
import { corsHeaders } from "./cors.ts";

// Type for state data
export interface OAuthStateData {
  userId: string;
  platform: string;
  redirectUri: string;
  created: string;
}

// Store state in Supabase
export const storeOAuthState = async (
  supabaseClient: any, 
  stateParam: string, 
  stateData: OAuthStateData
) => {
  const { error } = await supabaseClient
    .from('oauth_states')
    .insert({
      state: stateParam,
      data: stateData,
      expires_at: new Date(Date.now() + 10 * 60 * 1000) // 10 minute expiry
    });
  
  if (error) {
    console.error("Error storing OAuth state:", error);
    throw new Error("Failed to prepare OAuth flow: " + error.message);
  }
};

// Retrieve and validate state
export const retrieveOAuthState = async (supabaseClient: any, state: string) => {
  const { data, error } = await supabaseClient
    .from('oauth_states')
    .select('data')
    .eq('state', state)
    .single();
  
  if (error || !data) {
    console.error("Error retrieving OAuth state:", error);
    throw new Error("Invalid or expired OAuth state");
  }
  
  return data.data as OAuthStateData;
};

// Clean up used state
export const cleanupOAuthState = async (supabaseClient: any, state: string) => {
  await supabaseClient
    .from('oauth_states')
    .delete()
    .eq('state', state);
};
