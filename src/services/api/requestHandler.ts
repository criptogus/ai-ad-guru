
import { supabase } from '@/integrations/supabase/client';
import { securityMonitor } from '@/middleware/securityMiddleware';
import { ApiRequestOptions } from './types';
import { sanitizeRequestBody } from './sanitization';
import { csrfManager } from './csrf';

// Default request options with security enhancement
const defaultOptions = {
  credentials: 'same-origin' as RequestCredentials,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest', // Helps prevent CSRF
  },
};

/**
 * Internal function to make secure API requests
 */
export const makeRequest = async <T>(
  url: string,
  options: ApiRequestOptions = {}
): Promise<T> => {
  const {
    method = 'GET',
    body,
    headers = {},
    requiresAuth = true,
  } = options;

  try {
    // Track API request for security monitoring
    securityMonitor.trackApiAccess(url, method);
    
    // Get current session for authenticated requests
    let authHeaders = {};
    let csrfToken = '';
    
    if (requiresAuth) {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.access_token) {
        authHeaders = {
          Authorization: `Bearer ${data.session.access_token}`,
        };
        
        // Track authenticated request with user ID
        if (data.session.user?.id) {
          securityMonitor.trackApiAccess(url, method, data.session.user.id);
        }
      } else {
        throw new Error('Authentication required but user is not logged in');
      }
      
      // Add CSRF protection for mutating operations
      if (method !== 'GET') {
        csrfToken = csrfManager.getToken();
        if (csrfToken) {
          authHeaders = {
            ...authHeaders,
            'X-CSRF-Token': csrfToken
          };
        }
      }
    }

    // Sanitize request body to prevent injection attacks
    const sanitizedBody = body ? sanitizeRequestBody(body) : undefined;

    const response = await fetch(url, {
      ...defaultOptions,
      method,
      headers: {
        ...defaultOptions.headers,
        ...authHeaders,
        ...headers,
      },
      ...(sanitizedBody ? { body: JSON.stringify(sanitizedBody) } : {}),
    });

    // Check for HTTP errors
    if (!response.ok) {
      // Try to parse error response
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: response.statusText };
      }

      // Log security-related HTTP errors
      if (response.status === 401 || response.status === 403) {
        securityMonitor.log('security_access_denied', {
          url,
          method,
          status: response.status,
          message: errorData.message || response.statusText
        }, 'warn');
      } else if (response.status === 429) {
        securityMonitor.log('rate_limit_exceeded', {
          url,
          method
        }, 'warn');
      }

      throw {
        status: response.status,
        message: errorData.message || 'An error occurred',
        data: errorData,
      };
    }

    // Parse JSON response
    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error('API request failed:', error);
    
    // Log API errors for security monitoring
    securityMonitor.log('api_request_error', {
      url,
      method,
      error: error.message || 'Unknown error'
    }, 'error');
    
    throw error;
  }
};
