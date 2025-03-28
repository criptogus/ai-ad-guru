
import { supabase } from "@/integrations/supabase/client";
import { OAuthParams } from "./types";
import { oauthStorage } from "./storage";

/**
 * Initiate OAuth flow for ad platform connections
 */
export const initiateOAuth = async (params: OAuthParams) => {
  const { platform, userId, redirectUri } = params;
  
  if (!userId) {
    throw new Error('User must be authenticated to connect ad accounts');
  }
  
  if (!redirectUri) {
    throw new Error('Redirect URI is required for the OAuth flow');
  }
  
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
        errorMessage = `Edge function error: The Supabase edge function returned a non-2xx status code. Check if the edge function is deployed correctly and all required credentials are set.`;
      } else if (response.error.message && response.error.message.includes('Failed to prepare OAuth flow')) {
        errorMessage = `Database error: ${response.error.message}. Please check database permissions or connection.`;
      }
      
      throw new Error(errorMessage);
    }
    
    const data = response.data;
    
    // Enhanced validation for authUrl
    if (!data) {
      throw new Error(`Empty response from edge function for ${platform} OAuth URL generation`);
    }
    
    if (!data.success) {
      throw new Error(data.error || `Failed to initialize ${platform} OAuth flow`);
    }
    
    // Check for authUrl or url property in response (handle both formats)
    const authUrl = data.authUrl || data.url;
    
    if (!authUrl) {
      console.error('Response missing authUrl/url:', data);
      throw new Error(`Failed to get valid auth URL for ${platform}`);
    }
    
    // Store that we're in the middle of an OAuth flow
    oauthStorage.storeOAuthState({
      platform,
      inProgress: true,
      userId,
      startTime: Date.now(),
      redirectUri
    });
    
    // Return the OAuth URL for redirection
    return authUrl;
  } catch (error) {
    console.error(`Error in initiateOAuth:`, error);
    throw error;
  }
};
