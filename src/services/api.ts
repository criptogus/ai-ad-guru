
import { supabase } from '@/integrations/supabase/client';
import { sanitizeInput } from '@/utils/security';
import { securityMonitor } from '@/middleware/securityMiddleware';

/**
 * Secure API service for making authenticated requests
 * This centralizes all API calls and applies consistent security measures
 */

// Default request options with security enhancement
const defaultOptions = {
  credentials: 'same-origin' as RequestCredentials, // Fixed TS error with type assertion
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest', // Helps prevent CSRF
  },
};

// Interface for API request options
interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  requiresAuth?: boolean;
}

/**
 * Internal function to make secure API requests
 */
const makeRequest = async <T>(
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
        csrfToken = sessionStorage.getItem('csrf_token') || '';
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

/**
 * Sanitize request body to prevent injection
 */
const sanitizeRequestBody = (body: any): any => {
  if (!body) return body;

  // Handle arrays
  if (Array.isArray(body)) {
    return body.map(item => sanitizeRequestBody(item));
  }

  // Handle objects
  if (typeof body === 'object') {
    const sanitized: Record<string, any> = {};
    for (const key in body) {
      if (Object.prototype.hasOwnProperty.call(body, key)) {
        const value = body[key];
        if (typeof value === 'string') {
          sanitized[key] = sanitizeInput(value);
        } else if (typeof value === 'object' && value !== null) {
          sanitized[key] = sanitizeRequestBody(value);
        } else {
          sanitized[key] = value;
        }
      }
    }
    return sanitized;
  }

  // Handle strings
  if (typeof body === 'string') {
    return sanitizeInput(body);
  }

  // Return as is for other primitives
  return body;
};

/**
 * Secure API service
 */
export const secureApi = {
  /**
   * Make a GET request
   */
  get: <T>(url: string, options: Omit<ApiRequestOptions, 'method' | 'body'> = {}) => 
    makeRequest<T>(url, { ...options, method: 'GET' }),

  /**
   * Make a POST request
   */
  post: <T>(url: string, body: any, options: Omit<ApiRequestOptions, 'method'> = {}) => 
    makeRequest<T>(url, { ...options, method: 'POST', body }),

  /**
   * Make a PUT request
   */
  put: <T>(url: string, body: any, options: Omit<ApiRequestOptions, 'method'> = {}) => 
    makeRequest<T>(url, { ...options, method: 'PUT', body }),

  /**
   * Make a DELETE request
   */
  delete: <T>(url: string, options: Omit<ApiRequestOptions, 'method'> = {}) => 
    makeRequest<T>(url, { ...options, method: 'DELETE' }),

  /**
   * Make a secure request to Supabase Edge Functions
   */
  invokeFunction: async <T>(
    functionName: string,
    body: any = {},
    options: { requiresAuth?: boolean } = {}
  ): Promise<T> => {
    try {
      const { requiresAuth = true } = options;
      
      // Log edge function call for security monitoring
      securityMonitor.trackApiAccess(`edge_function/${functionName}`, 'POST');
      
      // Sanitize request body
      const sanitizedBody = sanitizeRequestBody(body);
      
      // Add CSRF token for protection
      if (requiresAuth) {
        const csrfToken = sessionStorage.getItem('csrf_token');
        if (csrfToken) {
          sanitizedBody._csrf = csrfToken;
        }
      }
      
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: sanitizedBody,
      });

      if (error) {
        // Log security-related edge function errors
        securityMonitor.log('edge_function_error', {
          function: functionName,
          error: error.message || 'Unknown error'
        }, 'error');
        
        throw error;
      }

      return data as T;
    } catch (error) {
      console.error(`Error invoking function ${functionName}:`, error);
      throw error;
    }
  },
  
  /**
   * Server-side validation helper
   * This simulates server-side validation in the client
   * In a real app, this would be implemented on the server
   */
  validateServerSide: (data: any, validationRules: Record<string, (value: any) => boolean>): { 
    valid: boolean; 
    errors: Record<string, string> 
  } => {
    const errors: Record<string, string> = {};
    
    // Apply validation rules
    Object.entries(validationRules).forEach(([field, validator]) => {
      const value = data[field];
      if (!validator(value)) {
        errors[field] = `Invalid value for ${field}`;
      }
    });
    
    return {
      valid: Object.keys(errors).length === 0,
      errors
    };
  }
};

// Initialize CSRF token when module loads
const initializeCsrf = () => {
  const token = Array.from(new Uint8Array(32), byte => 
    byte.toString(16).padStart(2, '0')
  ).join('');
  sessionStorage.setItem('csrf_token', token);
};

// Run initialization
initializeCsrf();

// Refresh CSRF token periodically for enhanced security
setInterval(() => {
  // Only refresh if the user is active (has interacted with the page recently)
  const lastActivity = parseInt(sessionStorage.getItem('last_user_activity') || '0', 10);
  const now = Date.now();
  
  // If user was active in the last 5 minutes, refresh the token
  if (now - lastActivity < 5 * 60 * 1000) {
    initializeCsrf();
  }
}, 30 * 60 * 1000); // Refresh every 30 minutes

// Track user activity
document.addEventListener('click', () => {
  sessionStorage.setItem('last_user_activity', Date.now().toString());
});
