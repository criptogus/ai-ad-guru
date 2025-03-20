
import { supabase } from '@/integrations/supabase/client';
import { sanitizeInput } from '@/utils/security';

/**
 * Secure API service for making authenticated requests
 * This centralizes all API calls and applies consistent security measures
 */

// Default request options with security enhancement
const defaultOptions = {
  credentials: 'same-origin',
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
    // Get current session for authenticated requests
    let authHeaders = {};
    if (requiresAuth) {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.access_token) {
        authHeaders = {
          Authorization: `Bearer ${data.session.access_token}`,
        };
      } else {
        throw new Error('Authentication required but user is not logged in');
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
      
      // Sanitize request body
      const sanitizedBody = sanitizeRequestBody(body);
      
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: sanitizedBody,
      });

      if (error) {
        throw error;
      }

      return data as T;
    } catch (error) {
      console.error(`Error invoking function ${functionName}:`, error);
      throw error;
    }
  },
};
