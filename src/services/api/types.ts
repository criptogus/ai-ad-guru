
export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  requiresAuth?: boolean;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}
