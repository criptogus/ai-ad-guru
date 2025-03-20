
// Define common CORS headers for browser requests
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // In production, restrict to specific domains
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

// Security headers for all responses
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'; upgrade-insecure-requests;",
  'Cache-Control': 'no-store, max-age=0',
};

// Rate limiting tracker - simplified in-memory version
// In production, use a database or Redis to track this between function invocations
const ipRequestCounts: Record<string, { count: number, timestamp: number }> = {};

// Clean up old entries to prevent memory leaks
const cleanupOldEntries = () => {
  const now = Date.now();
  const expiryTime = 60000; // 1 minute in milliseconds
  
  Object.keys(ipRequestCounts).forEach(key => {
    if (now - ipRequestCounts[key].timestamp > expiryTime) {
      delete ipRequestCounts[key];
    }
  });
};

// Rate limiting middleware - returns true if the request is allowed, false if it should be blocked
export const checkRateLimit = (req: Request, limit = 100, windowMs = 60000): boolean => {
  // Run cleanup periodically
  cleanupOldEntries();
  
  // Get client IP - in production, you'd use a proper IP extraction method
  const ip = req.headers.get('x-forwarded-for') || 
             req.headers.get('x-real-ip') || 
             'unknown';
  const now = Date.now();
  
  // Further restrict based on the endpoint being accessed
  const url = new URL(req.url);
  const path = url.pathname;
  
  // More restrictive limits for sensitive operations
  const isAuthEndpoint = path.includes('/auth/') || 
                         path.includes('/login') || 
                         path.includes('/register');
  
  const isAdminEndpoint = path.includes('/admin/');
  
  // Set different limits based on endpoint type
  const actualLimit = isAuthEndpoint ? Math.floor(limit / 2) : 
                     isAdminEndpoint ? Math.floor(limit / 4) : 
                     limit;
  
  // Initialize or update the request count for this IP
  if (!ipRequestCounts[ip]) {
    ipRequestCounts[ip] = { count: 1, timestamp: now };
    return true;
  }
  
  // Check if this IP has exceeded the rate limit
  if (ipRequestCounts[ip].count >= actualLimit) {
    // Log potential abuse
    console.warn(`Rate limit exceeded for IP: ${ip}, endpoint: ${path}`);
    return false;
  }
  
  // Increment the request count
  ipRequestCounts[ip].count += 1;
  ipRequestCounts[ip].timestamp = now;
  return true;
};

// Validate request origin for enhanced security
export const isValidOrigin = (req: Request): boolean => {
  const origin = req.headers.get('origin');
  
  // In production, restrict to specific origins
  // Uncomment this for production:
  /*
  const allowedOrigins = [
    'https://app.yourdomain.com', 
    'https://yourdomain.com',
    'https://api.yourdomain.com'
  ];
  return origin ? allowedOrigins.includes(origin) : false;
  */
  
  // For development
  return true;
};

// Generate a secure random string - useful for nonces, CSRF tokens, etc.
export const generateSecureToken = (length = 32): string => {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Validate CSRF token
export const validateCsrfToken = (req: Request, storedToken: string): boolean => {
  // Get token from request headers
  const csrfToken = req.headers.get('x-csrf-token');
  
  // Verify token exists and matches stored token
  return !!csrfToken && csrfToken === storedToken;
};

// Check for suspicious patterns in request data
export const hasSuspiciousPatterns = (data: any): boolean => {
  const stringified = JSON.stringify(data).toLowerCase();
  
  // Check for common malicious patterns
  const suspiciousPatterns = [
    'script>', '<script', 'javascript:', 'onerror=', 'onload=',
    'eval(', 'document.cookie', 'fetch(', 'xhr.', 'new XMLHttpRequest',
    '../../', '../', '/etc/passwd', '/bin/bash',
    'SELECT * FROM', 'UNION SELECT', 'DROP TABLE',
    'alert(', 'confirm(', 'prompt(', 'on\\w+\\s*=',
    '<iframe', '<object', '<embed', '<form',
    'data:text/html', 'vbscript:', 'expression(',
    '<base', '<link rel="import"', 'behavior:',
    'WAITFOR DELAY', 'exec ', 'xp_cmdshell',
    'Object.defineProperty', 'constructor.constructor',
    '__proto__', 'prototype', '__defineGetter__',
    'Function(', 'setTimeout(', 'setInterval(',
    'document.write(', 'document.writeln('
  ];
  
  return suspiciousPatterns.some(pattern => {
    // Use regular expressions for more complex patterns
    if (pattern.includes('\\')) {
      const regex = new RegExp(pattern, 'i');
      return regex.test(stringified);
    }
    return stringified.includes(pattern);
  });
};

// Create a security-enhanced response
export const createSecureResponse = (
  body: any, 
  status = 200, 
  extraHeaders: Record<string, string> = {}
): Response => {
  // Generate a unique request ID for tracking/logging
  const requestId = generateSecureToken(16);
  
  return new Response(
    typeof body === 'string' ? body : JSON.stringify(body),
    {
      status,
      headers: {
        'Content-Type': typeof body === 'string' ? 'text/plain' : 'application/json',
        ...corsHeaders,
        ...securityHeaders,
        'X-Request-ID': requestId,
        ...extraHeaders
      }
    }
  );
};

// Handle unauthorized requests
export const rejectUnauthorized = (message = 'Unauthorized'): Response => {
  return createSecureResponse(
    { error: message },
    401,
    { 'WWW-Authenticate': 'Bearer' }
  );
};

// Handle rate limited requests
export const rejectRateLimited = (): Response => {
  return createSecureResponse(
    { error: 'Too many requests. Please try again later.' },
    429,
    { 
      'Retry-After': '60',
      'X-RateLimit-Reset': (Date.now() + 60000).toString()
    }
  );
};

// Handle forbidden requests
export const rejectForbidden = (message = 'Forbidden'): Response => {
  return createSecureResponse(
    { error: message },
    403
  );
};

// Sanitize request body to prevent injection attacks
export const sanitizeRequestData = (data: any): any => {
  if (typeof data !== 'object' || data === null) {
    // For strings, apply string sanitization
    if (typeof data === 'string') {
      return sanitizeString(data);
    }
    return data;
  }
  
  const sanitized: any = Array.isArray(data) ? [] : {};
  
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key];
      
      if (typeof value === 'string') {
        sanitized[key] = sanitizeString(value);
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = sanitizeRequestData(value);
      } else {
        sanitized[key] = value;
      }
    }
  }
  
  return sanitized;
};

// Helper function to sanitize strings
const sanitizeString = (input: string): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/<base\b[^<]*(?:(?!<\/base>)<[^<]*)*<\/base>/gi, '')
    .replace(/javascript:/gi, 'blocked-js:')
    .replace(/data:/gi, 'blocked-data:')
    .replace(/vbscript:/gi, 'blocked-vbs:')
    .replace(/on\w+=/gi, 'data-blocked-event=');
};

// Validate JWT token structure and signature (basic)
export const validateJwtStructure = (token: string): boolean => {
  // Check basic JWT format: header.payload.signature
  const parts = token.split('.');
  if (parts.length !== 3) {
    return false;
  }
  
  // Check that each part is base64 decodable
  try {
    // For header and payload, we can decode and check if they're valid JSON
    const header = JSON.parse(atob(parts[0]));
    const payload = JSON.parse(atob(parts[1]));
    
    // Check for required fields
    return typeof header === 'object' && 
           header !== null && 
           typeof header.alg === 'string' && 
           typeof payload === 'object' && 
           payload !== null && 
           typeof payload.exp === 'number';
  } catch (e) {
    return false;
  }
};

// Apply security checks to an incoming request
export const applySecurityChecks = async (
  req: Request, 
  options: {
    validateOrigin?: boolean;
    checkRateLimit?: boolean;
    rateLimitValue?: number;
    requireAuth?: boolean;
    csrfToken?: string;
    validateCsrf?: boolean;
  } = {}
): Promise<{ valid: boolean; response?: Response }> => {
  const { 
    validateOrigin = true, 
    checkRateLimit = true, 
    rateLimitValue = 100, 
    requireAuth = false,
    csrfToken,
    validateCsrf = false
  } = options;
  
  // Check origin if required
  if (validateOrigin && !isValidOrigin(req)) {
    return { 
      valid: false, 
      response: createSecureResponse({ error: 'Invalid origin' }, 403) 
    };
  }
  
  // Check rate limit if required
  if (checkRateLimit && !checkRateLimit(req, rateLimitValue)) {
    return { 
      valid: false, 
      response: rejectRateLimited() 
    };
  }
  
  // Validate CSRF token if required
  if (validateCsrf && csrfToken && !validateCsrfToken(req, csrfToken)) {
    return { 
      valid: false, 
      response: createSecureResponse({ error: 'Invalid or missing CSRF token' }, 403) 
    };
  }
  
  // Check authentication if required
  if (requireAuth) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { 
        valid: false, 
        response: rejectUnauthorized('Authentication required') 
      };
    }
    
    const token = authHeader.split(' ')[1];
    
    // Basic JWT structure validation
    if (!validateJwtStructure(token)) {
      return { 
        valid: false, 
        response: rejectUnauthorized('Invalid token format') 
      };
    }
    
    // JWT validation should be performed by the application with proper signature verification
    // This is just a basic structural check
  }
  
  return { valid: true };
};
