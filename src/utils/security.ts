
/**
 * Security utility functions for the application
 */

// Sanitize user input to prevent XSS attacks with enhanced protection
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // Enhanced sanitization - more comprehensive protection against XSS
  return input
    .replace(/<(script|iframe|object|embed|form|style|link|meta|base)[^>]*>[\s\S]*?<\/\1>/gi, '') // Block dangerous tags completely
    .replace(/<[^>]*\son\w+\s*=\s*(['"]).*?\1[^>]*>/gi, match => 
      match.replace(/\son\w+\s*=\s*(['"]).*?\1/gi, '')) // Remove all event handlers
    .replace(/javascript:|data:|vbscript:|file:|about:|ms-/gi, match => 
      `blocked-${match}`) // Block dangerous protocols
    .replace(/&lt;script[\s\S]*?&gt;[\s\S]*?&lt;\/script&gt;/gi, '') // Encoded script tags
    .replace(/expression\s*\([\s\S]*?\)/gi, '') // Block CSS expressions
    .replace(/(document|window|eval|setTimeout|setInterval|Function|constructor)\s*\(/gi, 
      match => `blocked_${match}`) // Block dangerous JS functions
    .trim();
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// Validate password strength
export const isStrongPassword = (password: string): { valid: boolean; message: string } => {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  
  if (!/[^A-Za-z0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character' };
  }
  
  return { valid: true, message: 'Password meets strength requirements' };
};

// Create a Content Security Policy header with improved security directives
export const getCSPHeader = (): string => {
  return `
    default-src 'self';
    script-src 'self' https://cdn.jsdelivr.net https://www.google-analytics.com 'nonce-${generateNonce()}';
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: https://*.supabase.co https://images.unsplash.com;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.openai.com;
    frame-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
  `.replace(/\s+/g, ' ').trim();
};

// Generate a random nonce for CSP
export const generateNonce = (): string => {
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Validate file uploads for security - Enhanced with additional checks
export const validateFileUpload = (
  file: File, 
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxSizeInMB: number = 5
): { valid: boolean; message: string } => {
  // Check if file exists
  if (!file) {
    return { valid: false, message: 'No file provided' };
  }
  
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return { 
      valid: false, 
      message: `Invalid file type. Allowed types: ${allowedTypes.map(t => t.replace('image/', '')).join(', ')}` 
    };
  }
  
  // Check file size
  const fileSizeInMB = file.size / (1024 * 1024);
  if (fileSizeInMB > maxSizeInMB) {
    return { 
      valid: false, 
      message: `File is too large. Maximum size is ${maxSizeInMB}MB` 
    };
  }
  
  // Additional security check - validate file extension matches content type
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  const expectedExtensions: Record<string, string[]> = {
    'image/jpeg': ['jpg', 'jpeg'],
    'image/png': ['png'],
    'image/gif': ['gif'],
    'image/webp': ['webp']
  };
  
  const validExtensions = expectedExtensions[file.type] || [];
  if (fileExtension && validExtensions.length > 0 && !validExtensions.includes(fileExtension)) {
    return {
      valid: false,
      message: `File extension (.${fileExtension}) doesn't match the content type (${file.type})`
    };
  }
  
  return { valid: true, message: 'File validation passed' };
};

// Generate a secure random token with enhanced entropy
export const generateSecureToken = (length: number = 32): string => {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Generate CSRF token for form submissions
export const generateCsrfToken = (): string => {
  const token = generateSecureToken(32);
  // Store in session storage to verify later
  sessionStorage.setItem('csrf_token', token);
  return token;
};

// Verify CSRF token from form submissions
export const verifyCsrfToken = (token: string): boolean => {
  const storedToken = sessionStorage.getItem('csrf_token');
  if (!storedToken || storedToken !== token) {
    return false;
  }
  // Use once and regenerate
  sessionStorage.removeItem('csrf_token');
  return true;
};

// Detect potentially malicious payloads in user input
export const detectMaliciousPayload = (input: string): boolean => {
  // Common patterns used in XSS and injection attacks
  const suspiciousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/i,
    /javascript:/i,
    /data:text\/html/i,
    /onerror=/i,
    /onload=/i,
    /onclick=/i,
    /eval\(/i,
    /document\.cookie/i,
    /document\.domain/i,
    /document\.write/i,
    /fetch\(/i,
    /\balert\(/i,
    /\bprompt\(/i,
    /\bconfirm\(/i,
    /\bconsole\./i,
    /\(\)\s*\{/i,
    /select.+from.+where/i,
    /union\s+select/i,
    /--[^\r\n]*/i,
    /\/\*[^*]*\*+([^/*][^*]*\*+)*\//i
  ];
  
  return suspiciousPatterns.some(pattern => pattern.test(input));
};
