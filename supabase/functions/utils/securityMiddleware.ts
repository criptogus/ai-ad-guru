
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
};

// Rate limiting tracker - simplified in-memory version
// In production, use a database or Redis to track this between function invocations
const ipRequestCounts: Record<string, { count: number, timestamp: number }> = {};

// Rate limiting middleware - returns true if the request is allowed, false if it should be blocked
export const checkRateLimit = (req: Request, limit = 100, windowMs = 60000): boolean => {
  // Get client IP - in production, you'd use a proper IP extraction method
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  
  // Clean up old entries
  Object.keys(ipRequestCounts).forEach(key => {
    if (now - ipRequestCounts[key].timestamp > windowMs) {
      delete ipRequestCounts[key];
    }
  });
  
  // Initialize or update the request count for this IP
  if (!ipRequestCounts[ip]) {
    ipRequestCounts[ip] = { count: 1, timestamp: now };
    return true;
  }
  
  // Check if this IP has exceeded the rate limit
  if (ipRequestCounts[ip].count >= limit) {
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
  // const allowedOrigins = ['https://app.yourdomain.com', 'https://yourdomain.com'];
  // return origin ? allowedOrigins.includes(origin) : false;
  
  // For development
  return true;
};

// Check for suspicious patterns in request data
export const hasSuspiciousPatterns = (data: any): boolean => {
  const stringified = JSON.stringify(data).toLowerCase();
  
  // Check for common malicious patterns
  const suspiciousPatterns = [
    'script>', '<script', 'javascript:', 'onerror=', 'onload=',
    'eval(', 'document.cookie', 'fetch(', 'xhr.', 'new XMLHttpRequest',
    '../../', '../', '/etc/passwd', '/bin/bash',
    'SELECT * FROM', 'UNION SELECT', 'DROP TABLE'
  ];
  
  return suspiciousPatterns.some(pattern => stringified.includes(pattern));
};

// Create a security-enhanced response
export const createSecureResponse = (
  body: any, 
  status = 200, 
  extraHeaders: Record<string, string> = {}
): Response => {
  return new Response(
    typeof body === 'string' ? body : JSON.stringify(body),
    {
      status,
      headers: {
        'Content-Type': typeof body === 'string' ? 'text/plain' : 'application/json',
        ...corsHeaders,
        ...securityHeaders,
        ...extraHeaders
      }
    }
  );
};

// Handle unauthorized requests
export const rejectUnauthorized = (message = 'Unauthorized'): Response => {
  return createSecureResponse(
    { error: message },
    401
  );
};

// Handle rate limited requests
export const rejectRateLimited = (): Response => {
  return createSecureResponse(
    { error: 'Too many requests. Please try again later.' },
    429,
    { 'Retry-After': '60' }
  );
};

// Sanitize request body to prevent injection attacks
export const sanitizeRequestData = (data: any): any => {
  if (typeof data !== 'object' || data === null) {
    return data;
  }
  
  const sanitized: any = Array.isArray(data) ? [] : {};
  
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key];
      
      if (typeof value === 'string') {
        // Basic string sanitization - you might need more sophisticated sanitization
        sanitized[key] = value
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+=/gi, 'data-on=');
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = sanitizeRequestData(value);
      } else {
        sanitized[key] = value;
      }
    }
  }
  
  return sanitized;
};
