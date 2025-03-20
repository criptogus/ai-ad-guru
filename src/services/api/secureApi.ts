
import { supabase } from '@/integrations/supabase/client';
import { securityMonitor } from '@/middleware/securityMiddleware';
import { makeRequest } from './requestHandler';
import { sanitizeRequestBody } from './sanitization';
import { validateServerSide } from './validation';
import { ApiRequestOptions } from './types';
import { csrfManager } from './csrf';

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
        const csrfToken = csrfManager.getToken();
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
   */
  validateServerSide,
};
