
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { OAuthCallbackResult } from '../types';

interface OAuthErrorResponse {
  error: string;
  errorDescription?: string;
}

interface OAuthSuccessResponse {
  code: string;
  state: string;
  platformParam?: string;
}

/**
 * Extract and parse OAuth parameters from URL
 */
export function extractOAuthParams(location: {
  search: string;
}): OAuthSuccessResponse | OAuthErrorResponse | null {
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  const platformParam = searchParams.get('platform') || '';

  // Enhanced debug logging for the OAuth callback URL
  console.log("==== OAUTH URL DEBUG INFO ====");
  console.log("Full URL:", location.search);
  console.log("Extracted Parameters:", { code: code ? "present" : "missing", state, error, errorDescription, platformParam });
  console.log("================================");

  // If no code or error, this is not an OAuth redirect
  if (!code && !error) {
    console.log("No OAuth callback parameters detected");
    return null;
  }

  if (error) {
    console.error("OAuth error response:", { error, errorDescription });
    return { 
      error, 
      errorDescription: errorDescription || undefined 
    };
  }

  if (!code || !state) {
    console.error("Missing required OAuth parameters:", { code: code ? "present" : "missing", state: state ? "present" : "missing" });
    return {
      error: "Missing required OAuth parameters"
    };
  }

  return {
    code,
    state,
    platformParam
  };
}

/**
 * Handle OAuth error response
 */
export function handleOAuthError(errorResponse: OAuthErrorResponse): void {
  const { error, errorDescription } = errorResponse;
  const errorMsg = errorDescription ? `${error}: ${errorDescription}` : error;
  
  // Fixed: Using correct sonner toast API format
  toast.error("Authentication Error", {
    description: `Error: ${errorMsg}. The platform denied access.`
  });
}

/**
 * Retrieve stored OAuth data from session storage
 */
export function getStoredOAuthData() {
  try {
    const storedData = sessionStorage.getItem('adPlatformAuth');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      console.log("Retrieved stored OAuth data:", { 
        platform: parsedData?.platform,
        hasStoredState: !!parsedData?.state,
        stateValue: parsedData?.state?.substring(0, 8) + '...'
      });
      return parsedData;
    }
    console.warn("No OAuth data found in session storage");
    return null;
  } catch (storageErr) {
    console.error("Error retrieving stored OAuth state:", storageErr);
    return null;
  }
}

/**
 * Clean up saved OAuth data from session storage
 */
export function cleanupOAuthData() {
  try {
    sessionStorage.removeItem('adPlatformAuth');
    console.log("Cleaned up OAuth data from session storage");
  } catch (e) {
    console.warn("Error removing OAuth state from sessionStorage:", e);
  }
}

/**
 * Exchange code for token using Supabase Edge Function
 */
export async function exchangeToken(
  code: string, 
  state: string, 
  redirectUri: string,
  platform: string,
  userId?: string
): Promise<any> {
  // Use the consistent redirect URI
  const effectiveRedirectUri = 'https://auth.zeroagency.ai/auth/v1/callback';
  console.log("Using redirect URI for token exchange:", effectiveRedirectUri);

  // Log the token exchange parameters for debugging
  console.log("Token exchange parameters:", {
    code: code ? code.substring(0, 8) + '...' : 'missing',
    state: state ? state.substring(0, 8) + '...' : 'missing',
    platform,
    userId: userId ? userId.substring(0, 8) + '...' : 'missing'
  });

  // Exchange code for token using Supabase function
  const response = await supabase.functions.invoke('ad-account-auth', {
    body: {
      action: 'exchangeToken',
      code,
      state,
      redirectUri: effectiveRedirectUri,
      userId,
      platform
    }
  });

  if (response.error) {
    console.error("Token exchange error response:", response.error);
    throw new Error(`Token exchange failed: ${response.error.message}`);
  }

  return response.data;
}

/**
 * Get platform display name
 */
export function getPlatformDisplayName(platform: string): string {
  switch (platform) {
    case 'google': return 'Google Ads';
    case 'meta': return 'Meta Ads';
    case 'linkedin': return 'LinkedIn Ads';
    case 'microsoft': return 'Microsoft Ads';
    default: return 'Ad Platform';
  }
}

/**
 * Determine where to redirect based on connection count 
 */
export async function determineRedirectPath(userId: string): Promise<string> {
  // Check how many connections the user has
  const { count, error: countError } = await supabase
    .from('user_integrations')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);
    
  if (countError) {
    console.error('Error checking connection count:', countError);
    return '/connections';
  }
  
  // First connection, stay on connections page
  if (count === 1) {
    return '/connections';
  } 
  
  // User has multiple connections, redirect to campaign creation
  return '/campaign/create';
}
