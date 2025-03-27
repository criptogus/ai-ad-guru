
/**
 * HTTP Client for making API requests
 * This is a wrapper around fetch with added functionality
 */
export const httpClient = {
  /**
   * Make a GET request
   */
  get: async <T>(url: string, options: RequestInit = {}): Promise<T> => {
    const response = await fetch(url, {
      ...options,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      throw await handleErrorResponse(response);
    }
    
    return response.json();
  },
  
  /**
   * Make a POST request
   */
  post: async <T>(url: string, data: any, options: RequestInit = {}): Promise<T> => {
    const response = await fetch(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw await handleErrorResponse(response);
    }
    
    return response.json();
  },
  
  /**
   * Make a PUT request
   */
  put: async <T>(url: string, data: any, options: RequestInit = {}): Promise<T> => {
    const response = await fetch(url, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw await handleErrorResponse(response);
    }
    
    return response.json();
  },
  
  /**
   * Make a DELETE request
   */
  delete: async <T>(url: string, options: RequestInit = {}): Promise<T> => {
    const response = await fetch(url, {
      ...options,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      throw await handleErrorResponse(response);
    }
    
    return response.json();
  }
};

/**
 * Handle error responses
 */
const handleErrorResponse = async (response: Response) => {
  try {
    const errorData = await response.json();
    return {
      status: response.status,
      message: errorData.message || response.statusText,
      data: errorData,
    };
  } catch (error) {
    return {
      status: response.status,
      message: response.statusText,
    };
  }
};
