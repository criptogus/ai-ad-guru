
/**
 * OAuth initiation utilities
 */

import { supabase } from "@/integrations/supabase/client";
import { AdPlatform } from "../types";
import { OAuthParams, OAuthStorageData } from "./types";
import { storeOAuthData } from "./storage";
import { DEFAULT_REDIRECT_URI } from "./constants";

/**
 * Initiate OAuth flow for the specified platform
 */
export const initiateOAuth = async (params: OAuthParams): Promise<string> => {
  const { platform, userId, state } = params;
  
  if (!userId) {
    throw new Error('User must be authenticated to connect ad accounts');
  }
  
  // Always use the consistent redirect URI
  const effectiveRedirectUri = DEFAULT_REDIRECT_URI;
  
  console.log(`==== OAUTH INITIATION DEBUG INFO ====`);
  console.log(`Initiating ${platform} OAuth flow`);
  console.log(`Using redirect URI: ${effectiveRedirectUri}`);
  console.log(`For user: ${userId}`);
  console.log(`With state: ${state || 'not provided'}`);
  console.log(`Make sure this URI is registered in your ${platform} developer console: ${effectiveRedirectUri}`);
  console.log(`=====================================`);
  
  try {
    // Generate a secure state if not provided
    const secureState = state || crypto.randomUUID();
    
    // Generate the OAuth URL from our edge function
    console.log(`Invoking edge function for ${platform} OAuth URL generation with state: ${secureState}`);
    const response = await supabase.functions.invoke('ad-account-auth', {
      body: {
        action: 'getAuthUrl',
        platform,
        redirectUri: effectiveRedirectUri,
        userId,
        state: secureState // Pass the state parameter to the edge function
      }
    });
    
    if (!response) {
      console.error('No response from edge function');
      throw new Error(`Failed to initialize ${platform} OAuth flow. No response from server.`);
    }

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
    
    // Store OAuth flow information
    const oauthData: OAuthStorageData = {
      platform,
      inProgress: true,
      userId,
      startTime: Date.now(),
      redirectUri: effectiveRedirectUri,
      state: data.state || secureState // Use the state from response if available, fallback to local state
    };
    
    storeOAuthData(oauthData);
    
    // Return the OAuth URL for redirection
    return authUrl;
  } catch (error) {
    console.error(`==== OAUTH ERROR ====`);
    console.error(`Error in initiateOAuth:`, error);
    console.error(`===================`);
    throw error;
  }
};
