
import { supabase } from "@/integrations/supabase/client";
import { OAuthParams, AdPlatform } from "./types";

const OAUTH_STORAGE_KEY = 'adPlatformAuth';

export const initiateOAuth = async (params: OAuthParams) => {
  const { platform, userId, redirectUri } = params;
  
  console.log(`Using redirect URI: ${redirectUri}`);
  
  try {
    // Generate the OAuth URL from our edge function
    console.log(`Invoking edge function for ${platform} OAuth URL generation`);
    const response = await supabase.functions.invoke('ad-account-auth', {
      body: {
        action: 'getAuthUrl',
        platform,
        redirectUri,
        userId
      }
    });
    
    if (!response) {
      console.error('No response from edge function');
      throw new Error(`Failed to initialize ${platform} OAuth flow. No response from server.`);
    }

    // Check the status of the response
    if (response.error) {
      console.error(`Error response from edge function:`, response.error);
      
      // Enhanced error handling with more specific information
      let errorMessage = `Failed to initialize ${platform} OAuth flow: ${response.error.message || 'Unknown error'}`;
      
      // Provide more specific error messages for common issues
      if (response.error.message && response.error.message.includes('Missing required')) {
        errorMessage = `Admin needs to configure ${platform} API credentials in Supabase`;
      } else if (response.error.message && response.error.message.includes('non-2xx status')) {
        // Handle edge function non-2xx status explicitly
        errorMessage = `Edge function error: The Supabase edge function returned a non-2xx status code. Check if the edge function is deployed correctly and all required credentials are set.`;
      } else if (response.error.message && response.error.message.includes('Failed to prepare OAuth flow')) {
        errorMessage = `Database error: ${response.error.message}. Please check database permissions or connection.`;
      }
      
      // Log detailed error for debugging
      console.error(`OAuth initialization error details:`, {
        errorMessage,
        originalError: response.error,
        platform,
        redirectUri
      });
      
      throw new Error(errorMessage);
    }
    
    const data = response.data;
    
    if (!data || !data.success || !data.authUrl) {
      console.error(`Invalid response from edge function:`, data);
      throw new Error(data?.error || `Failed to get valid auth URL for ${platform}`);
    }
    
    // Store that we're in the middle of an OAuth flow
    sessionStorage.setItem(OAUTH_STORAGE_KEY, JSON.stringify({
      platform,
      inProgress: true,
      userId
    }));
    
    // Return the OAuth URL for redirection
    return data.authUrl;
  } catch (error) {
    console.error(`Error in initiateOAuth:`, error);
    throw error;
  }
};

export const handleOAuthCallback = async (redirectUri: string) => {
  // Check if we're coming back from an OAuth redirect
  const url = new URL(window.location.href);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');
  
  // Clean up the URL
  if (code || error) {
    window.history.replaceState({}, document.title, window.location.pathname);
  }
  
  // Check for OAuth errors
  if (error) {
    console.error('OAuth error:', error);
    throw new Error(`Authorization denied or cancelled: ${error}`);
  }
  
  // Retrieve stored OAuth flow data
  const storedAuthData = sessionStorage.getItem(OAUTH_STORAGE_KEY);
  if (!code || !state || !storedAuthData) {
    return null; // Not a callback or missing data
  }
  
  const authData = JSON.parse(storedAuthData);
  const { platform, userId } = authData;
  
  // Clear the stored OAuth data
  sessionStorage.removeItem(OAUTH_STORAGE_KEY);
  
  console.log(`Using callback redirect URI: ${redirectUri}`);
  
  try {
    // Exchange the code for tokens
    const response = await supabase.functions.invoke('ad-account-auth', {
      body: {
        action: 'exchangeToken',
        code,
        state,
        platform,
        redirectUri,
        userId
      }
    });
    
    if (!response) {
      console.error('No response from token exchange');
      throw new Error(`Failed to exchange token for ${platform}. No response from server.`);
    }

    if (response.error) {
      console.error(`Error response from exchange token:`, response.error);
      throw new Error(`Failed to exchange token for ${platform}: ${response.error.message || 'Unknown error'}`);
    }
    
    const data = response.data;
    
    if (!data || !data.success) {
      console.error(`Invalid response from token exchange:`, data);
      throw new Error(data?.error || `Failed to complete ${platform} connection`);
    }
    
    return { platform };
  } catch (error) {
    console.error(`Error in handleOAuthCallback:`, error);
    throw error;
  }
};

export const isOAuthCallback = () => {
  const url = new URL(window.location.href);
  const code = url.searchParams.get('code');
  const storedAuthData = sessionStorage.getItem(OAUTH_STORAGE_KEY);
  
  return Boolean(code && storedAuthData);
};
