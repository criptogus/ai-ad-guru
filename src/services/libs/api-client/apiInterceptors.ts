
/**
 * API Interceptors
 * Interceptors for HTTP requests and responses
 */

import { errorLogger } from '@/services/libs/error-handling';

export interface RequestInterceptor {
  onRequest: (config: any) => Promise<any>;
  onRequestError: (error: any) => Promise<any>;
}

export interface ResponseInterceptor {
  onResponse: (response: any) => Promise<any>;
  onResponseError: (error: any) => Promise<any>;
}

/**
 * Create an authentication interceptor
 */
export const createAuthInterceptor = (getToken: () => Promise<string | null>): RequestInterceptor => {
  return {
    onRequest: async (config) => {
      try {
        const token = await getToken();
        if (token) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
          };
        }
        return config;
      } catch (error) {
        errorLogger.logError(error, 'authInterceptor.onRequest');
        return config;
      }
    },
    onRequestError: async (error) => {
      errorLogger.logError(error, 'authInterceptor.onRequestError');
      return Promise.reject(error);
    }
  };
};

/**
 * Create an error handling interceptor
 */
export const createErrorInterceptor = (): ResponseInterceptor => {
  return {
    onResponse: async (response) => {
      return response;
    },
    onResponseError: async (error) => {
      errorLogger.logError(error, 'errorInterceptor.onResponseError');
      
      // Check for authentication errors
      if (error.response?.status === 401) {
        // Handle unauthorized error
        console.log('Authentication error detected');
      }
      
      // Check for server errors
      if (error.response?.status >= 500) {
        // Handle server error
        console.log('Server error detected');
      }
      
      return Promise.reject(error);
    }
  };
};
